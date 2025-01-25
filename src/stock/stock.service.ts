import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import axios from 'axios';
import { StockPrice } from './entities/stockPrice.entity';
import { Stock } from './entities/stock.entity';
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
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 9);
      const today = currentTime
        .toISOString()
        .substring(0, 10)
        .replace(/-/g, '');

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
    // let ACCESS_TOKEN = await this.cacheManager.get('token');
    const ACCESS_TOKEN = 'as';
    // if (!ACCESS_TOKEN) {
    //   await this.tokenCreate();
    //   await this.sleep(200);
    //   ACCESS_TOKEN = await this.cacheManager.get('token');
    // }

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
    // let ACCESS_TOKEN = await this.cacheManager.get('token');
    const ACCESS_TOKEN = 'as';
    // if (!ACCESS_TOKEN) {
    //   await this.tokenCreate();
    //   await this.sleep(200);
    //   ACCESS_TOKEN = await this.cacheManager.get('token');
    // }

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
        console.log(response.data.access_token, token);
        // this.cacheManager.set(token, `Bearer ${response.data.access_token}`, {
        //   ttl: 64800,
        // });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let stock = await this.stockRepository.findOne({
      where: {
        id,
        stockPrices: {
          created_at: MoreThanOrEqual(today),
        },
      },
      relations: ['stockPrices'],
      order: { stockPrices: { created_at: 'DESC' } },
    });

    if (!stock) {
      stock = await this.stockRepository.findOne({
        where: { id },
        relations: ['stockPrices'],
        order: { stockPrices: { created_at: 'DESC' } },
      });
      if (!stock) {
        throw new NotFoundException('stock not found');
      }
    }

    const prices = stock.stockPrices.map((StockPrice) => ({
      price: StockPrice.stck_prpr,
      time: StockPrice.created_at,
    }));
    stock.stockPrices.splice(1);

    return { stock, prices };
  }

  async getStockindex(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let KOSPI = await this.stockIndexRepository.find({
      where: { bstp_cls_code: '0001', created_at: MoreThanOrEqual(today) },
      order: { created_at: 'DESC' },
    });
    let KOSDAQ = await this.stockIndexRepository.find({
      where: { bstp_cls_code: '1001', created_at: MoreThanOrEqual(today) },
      order: { created_at: 'DESC' },
    });
    if (KOSPI.length === 0) {
      KOSPI = await this.stockIndexRepository.find({
        where: { bstp_cls_code: '0001' },
        order: { created_at: 'DESC' },
        take: 40,
      });
    }
    if (KOSDAQ.length === 0) {
      KOSDAQ = await this.stockIndexRepository.find({
        where: { bstp_cls_code: '1001' },
        order: { created_at: 'DESC' },
        take: 40,
      });
    }
    const KOSPIV = KOSPI.map((v) => ({
      price: v.bstp_nmix_prpr,
      time: v.created_at,
    }));
    const KOSDAQV = KOSDAQ.map((v) => ({
      price: v.bstp_nmix_prpr,
      time: v.created_at,
    }));
    return {
      KOSPI: KOSPI[0],
      KOSDAQ: KOSDAQ[0],
      KOSPIV: KOSPIV,
      KOSDAQV: KOSDAQV,
    };
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

  async getStockQuiz(): Promise<any> {
    const stockCodes = [
      '005930',
      '373220',
      '207940',
      '005490',
      '005380',
      '035420',
      '105560',
      '086520',
      '091990',
      '277810',
      '035900',
      '263750',
    ];
    const stocks = await this.stockRepository.find({
      where: {
        id: In(stockCodes),
      },
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
  async getStockRank(): Promise<any> {
    const stocks = await this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect(
        'stock.stockPrices',
        'stockPrice',
        'stockPrice.id = (SELECT MAX(id) FROM stock_price WHERE stock_price.stockId = stock.id)',
      )
      .getMany();

    const data = stocks.map((stock) => {
      return {
        id: stock.id,
        prdt_abrv_name: stock.prdt_abrv_name,
        rprs_mrkt_kor_name: stock.rprs_mrkt_kor_name,
        stck_prpr: stock.stockPrices[0].stck_prpr,
        prdy_vrss: stock.stockPrices[0].prdy_vrss,
        prdy_vrss_sign: stock.stockPrices[0].prdy_vrss_sign,
        prdy_ctrt: stock.stockPrices[0].prdy_ctrt,
        hts_avls: stock.stockPrices[0].hts_avls,
      };
    });

    data.sort((a, b) => parseFloat(b.prdy_ctrt) - parseFloat(a.prdy_ctrt));

    const top30Data = data.slice(0, 30);

    return top30Data;
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

  async getMyStock(user: Users): Promise<any> {
    const userId = user.id;

    const myStocks = await this.myStockRepository.find({
      where: {
        user: { id: userId },
      },
    });
    const stockIds = myStocks.map((myStock) => myStock.stockId);

    for (const stockId of stockIds) {
      const stock = await this.getStockPrice(stockId);
      const myStock = myStocks.find((item) => item.stockId === stockId);
      (myStock as any).stck_prpr = stock.stock.stockPrices[0].stck_prpr;
      (myStock as any).prdy_vrss = stock.stock.stockPrices[0].prdy_vrss;
      (myStock as any).prdy_ctrt = stock.stock.stockPrices[0].prdy_ctrt;
      (myStock as any).prices = stock.prices;
    }

    return myStocks;
  }
}
