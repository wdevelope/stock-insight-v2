import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import axios from 'axios';
import { StockPrice } from './entities/stockPrice.entity';
import { Stock } from './entities/stock.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MyStock } from './entities/myStock.entity';
import { Users } from 'src/users/users.entity';
import { StockIndex } from './entities/stockIndex.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockPrice)
    private stockPriceRepository: Repository<StockPrice>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(MyStock)
    private myStockRepository: Repository<MyStock>,
    @InjectRepository(StockIndex)
    private stockIndexRepository: Repository<StockIndex>,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async stockNameSave() {
    await this.stockNameSaveMarket('ksq');
    await this.stockNameSaveMarket('stk');

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');

    const deleteResult = await this.stockRepository.delete({
      updated_day: Not(today),
    });

    console.log(`Deleted ${deleteResult.affected} rows.`);
  }
  private async stockNameSaveMarket(market: string) {
    let dayCal = 15;
    const dayWeek = new Date().getDay();
    if (dayWeek >= 0 && dayWeek <= 1) {
      dayCal = 63;
    } else if (dayWeek === 6) {
      dayCal = 39;
    }
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - dayCal);
    const enterDay = currentTime
      .toISOString()
      .substring(0, 10)
      .replace(/-/g, '');

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://data-dbg.krx.co.kr/svc/apis/sto/${market}_isu_base_info?basDd=${enterDay}`,
      headers: {
        AUTH_KEY: process.env.AUTH_KEY,
      },
    };

    try {
      const response = await axios.request(config);
      const { OutBlock_1 } = response.data;
      const today = new Date().toISOString().substring(0, 10).replace(/-/g, '');

      for (const OutBlock of OutBlock_1) {
        const entity = new Stock();
        entity.id = OutBlock.ISU_SRT_CD;
        entity.prdt_abrv_name = OutBlock.ISU_ABBRV;
        entity.rprs_mrkt_kor_name = OutBlock.MKT_TP_NM;
        entity.updated_day = today;

        await this.stockRepository.upsert(entity, ['id']);
        await this.sleep(5);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async startStockNameSave() {
    const job = new CronJob(
      '0 55 8 * * 1-5',
      () => {
        console.log('start');
        this.stockNameSave();
      },
      null,
      false,
      'Asia/Seoul',
    );
    await this.schedulerRegistry.addCronJob('stockNameSave', job);
    job.start();
  }
  async stopStockNameSave() {
    const job = await this.schedulerRegistry.getCronJob('stockNameSave');
    job.stop();
  }

  async stockPriceSave() {
    const allStock = await this.stockRepository.find();
    const stockCodes = allStock.map((data) => data.id);
    let ACCESS_TOKEN = await this.cacheManager.get('token');
    if (!ACCESS_TOKEN) {
      await this.tokenCreate();
      await this.sleep(200);
      ACCESS_TOKEN = await this.cacheManager.get('token');
    }

    for (const stockCode of stockCodes) {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stockCode}`,
        headers: {
          'content-type': 'application/json',
          authorization: String(ACCESS_TOKEN),
          appkey: process.env.APPKEY,
          appsecret: process.env.APPSECRET,
          tr_id: 'FHKST01010100',
        },
      };
      try {
        const response = await axios.request(config);
        const { output } = response.data;

        await this.stockPriceRepository.save({
          stck_prpr: output.stck_prpr,
          prdy_vrss: output.prdy_vrss,
          prdy_vrss_sign: output.prdy_vrss_sign,
          prdy_ctrt: output.prdy_ctrt,
          stck_oprc: output.stck_oprc,
          stck_hgpr: output.stck_hgpr,
          stck_lwpr: output.stck_lwpr,
          stck_sdpr: output.stck_sdpr,
          acml_vol: output.acml_vol,
          acml_tr_pbmn: output.acml_tr_pbmn,
          hts_frgn_ehrt: output.hts_frgn_ehrt,
          hts_avls: output.hts_avls,
          per: output.per,
          pbr: output.pbr,
          w52_hgpr: output.w52_hgpr,
          w52_lwpr: output.w52_lwpr,
          whol_loan_rmnd_rate: output.whol_loan_rmnd_rate,
          bstp_kor_isnm: output.bstp_kor_isnm,
          iscd_stat_cls_code: output.iscd_stat_cls_code,
          stock: { id: stockCode },
        });
        await this.sleep(60);
      } catch (error) {
        console.error(`Error processing stock ${stockCode}: ${error.message}`);
      }
    }
  }

  async stockIndexSave() {
    const indexCodes = ['0001', '1001'];
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    let ACCESS_TOKEN = await this.cacheManager.get('token');
    if (!ACCESS_TOKEN) {
      await this.tokenCreate();
      await this.sleep(200);
      ACCESS_TOKEN = await this.cacheManager.get('token');
    }

    for (const indexCode of indexCodes) {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice?fid_cond_mrkt_div_code=U&fid_input_iscd=${indexCode}&fid_input_date_1=${today}&fid_input_date_2=${today}&fid_period_div_code=D`,
        headers: {
          'content-type': 'application/json',
          authorization: String(ACCESS_TOKEN),
          appkey: process.env.APPKEY,
          appsecret: process.env.APPSECRET,
          tr_id: 'FHKUP03500100',
        },
      };
      try {
        const response = await axios.request(config);
        const { output1 } = response.data;

        await this.stockIndexRepository.save({
          bstp_cls_code: output1.bstp_cls_code,
          bstp_nmix_prpr: output1.bstp_nmix_prpr,
          bstp_nmix_prdy_vrss: output1.bstp_nmix_prdy_vrss,
          bstp_nmix_prdy_ctrt: output1.bstp_nmix_prdy_ctrt,
        });
        await this.sleep(60);
      } catch (error) {
        console.error(`Error processing stock ${indexCode}: ${error.message}`);
      }
    }
  }

  private async tokenCreate() {
    const data = JSON.stringify({
      grant_type: 'client_credentials',
      appkey: process.env.APPKEY,
      appsecret: process.env.APPSECRET,
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
      headers: {
        'content-type': 'application/json',
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        const token = 'token';
        this.cacheManager.set(token, `Bearer ${response.data.access_token}`, {
          ttl: 64800,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async startStockPriceSave() {
    const job = new CronJob(
      '0 */10 9-16 * * 1-5',
      () => {
        console.log('start');
        this.stockPriceSave();
        this.stockIndexSave();
      },
      null,
      false,
      'Asia/Seoul',
    );
    await this.schedulerRegistry.addCronJob('stockPriceSave', job);
    job.start();
  }
  async stopStockPriceSave() {
    const job = await this.schedulerRegistry.getCronJob('stockPriceSave');
    job.stop();
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStockPrice(id: string): Promise<any> {
    const stock = await this.stockRepository.findOne({
      where: { id: id },
      relations: ['stockPrices'],
      order: { stockPrices: { created_at: 'DESC' } },
    });
    const prices = stock.stockPrices.map((StockPrice) => ({
      price: StockPrice.stck_prpr,
      time: StockPrice.created_at,
    }));
    stock.stockPrices.splice(1);

    return { stock, prices };
  }

  async getStockindex(): Promise<any> {
    const KOSPI = await this.stockIndexRepository.findOne({
      where: { bstp_cls_code: '0001' },
      order: { created_at: 'DESC' },
    });
    const KOSDAQ = await this.stockIndexRepository.findOne({
      where: { bstp_cls_code: '1001' },
      order: { created_at: 'DESC' },
    });

    return { KOSPI: KOSPI, KOSDAQ: KOSDAQ };
  }

  async getStockPage(page: number = 1): Promise<any> {
    const take = 30;

    const [stocks, total] = await this.stockRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ['stockPrices'],
    });
    return {
      data: stocks.map((stock) => {
        const latestPrice = stock.stockPrices.reduce((latest, price) => {
          if (!latest || price.created_at > latest.created_at) {
            return price;
          }
          return latest;
        }, null);

        return {
          id: stock.id,
          prdt_abrv_name: stock.prdt_abrv_name,
          rprs_mrkt_kor_name: stock.rprs_mrkt_kor_name,
          stck_prpr: latestPrice.stck_prpr,
          prdy_vrss: latestPrice.prdy_vrss,
          prdy_vrss_sign: latestPrice.prdy_vrss_sign,
          prdy_ctrt: latestPrice.prdy_ctrt,
          hts_avls: latestPrice.hts_avls,
        };
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async searchStock(query: string): Promise<any> {
    const stocks = await this.stockRepository.find({
      where: [
        { id: Like(`%${query}%`) },
        { prdt_abrv_name: Like(`%${query}%`) },
      ],
      relations: ['stockPrices'],
    });

    return {
      data: stocks.map((stock) => {
        const latestPrice = stock.stockPrices.reduce((latest, price) => {
          if (!latest || price.created_at > latest.created_at) {
            return price;
          }
          return latest;
        }, null);

        return {
          id: stock.id,
          prdt_abrv_name: stock.prdt_abrv_name,
          rprs_mrkt_kor_name: stock.rprs_mrkt_kor_name,
          stck_prpr: latestPrice.stck_prpr,
          prdy_vrss: latestPrice.prdy_vrss,
          prdy_vrss_sign: latestPrice.prdy_vrss_sign,
          prdy_ctrt: latestPrice.prdy_ctrt,
          hts_avls: latestPrice.hts_avls,
        };
      }),
    };
  }

  async addMyStock(user: Users, stockId: string): Promise<void> {
    const userId = user.id;
    const stock = await this.stockRepository.findOne({
      where: { id: stockId },
    });
    if (!stock) {
      throw new NotFoundException('stock not found');
    }
    const existMyStock = await this.myStockRepository.findOne({
      where: {
        stockId: stockId,
        user: { id: userId },
      },
    });
    if (existMyStock) {
      throw new ConflictException('stock has already been registered');
    }

    const myStock = new MyStock();
    myStock.stockId = stock.id;
    myStock.prdt_abrv_name = stock.prdt_abrv_name;
    myStock.user = user;

    await this.myStockRepository.save(myStock);
  }

  async deleteMyStock(user: Users, stockId: string): Promise<void> {
    const userId = user.id;

    const existMyStock = await this.myStockRepository.findOne({
      where: {
        user: { id: userId },
        stockId: stockId,
      },
    });
    if (!existMyStock) {
      throw new ConflictException('stock not saved');
    }

    await this.myStockRepository.remove(existMyStock);
  }

  async getMyStock(user: Users): Promise<MyStock[]> {
    const userId = user.id;

    return await this.myStockRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }
}
