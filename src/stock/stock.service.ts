import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { StockPrice } from './entities/stockPrice.entity';
import { Stock } from './entities/stock.entity';
// import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockPrice)
    private stockPriceRepository: Repository<StockPrice>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>, // private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async tokenCreate() {
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
        this.cacheManager.set(token, `Bearer ${response.data.access_token}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async stockNameSave() {
    await this.stockNameSaveMarket('ksq');
    await this.stockNameSaveMarket('stk');
  }
  private async stockNameSaveMarket(market: string) {
    const today = new Date().toISOString().substring(0, 10).replace(/-/g, '');
    const yesterday = +today - 1;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://data-dbg.krx.co.kr/svc/apis/sto/${market}_isu_base_info?basDd=${yesterday}`,
      headers: {
        AUTH_KEY: process.env.AUTH_KEY,
      },
    };

    try {
      const response = await axios.request(config);
      const { OutBlock_1 } = response.data;

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

  // @Cron('0 */10 9-16 * * 1-5', {
  //   name: 'stock',
  //   timeZone: 'Asia/Seoul',
  // })
  // @Cron('*/20 * * * * *', { name: 'stockSave' })
  // async fetchDataAndSaveToDB() {
  //   // const stockCodes = process.env.STOCKCODES.split(',');
  //   const stockCode = '005930';

  //   // for (const stockCode of stockCodes) {
  //   const config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stockCode}`,
  //     headers: {
  //       'content-type': 'application/json',
  //       authorization: process.env.ACCESS_TOKEN,
  //       appkey: process.env.APPKEY,
  //       appsecret: process.env.APPSECRET,
  //       tr_id: 'FHKST01010100',
  //     },
  //   };

  //   try {
  //     const response = await axios.request(config);
  //     const { output } = response.data;
  //     console.log(output);
  //     const entity = new StockPrice();
  //     const st = await this.stockRepository.findOne({
  //       where: { id: '005930' },
  //     });
  //     entity.stck_prpr = output.stck_prpr;
  //     entity.prdy_vrss = output.prdy_vrss;
  //     entity.prdy_vrss_sign = output.prdy_vrss_sign;
  //     entity.prdy_ctrt = output.prdy_ctrt;
  //     entity.stck_oprc = output.stck_oprc;
  //     entity.stck_hgpr = output.stck_hgpr;
  //     entity.stck_lwpr = output.stck_lwpr;
  //     entity.stck_sdpr = output.stck_sdpr;
  //     entity.acml_vol = output.acml_vol;
  //     entity.acml_tr_pbmn = output.acml_tr_pbmn;
  //     entity.hts_frgn_ehrt = output.hts_frgn_ehrt;
  //     entity.hts_avls = output.hts_avls;
  //     entity.per = output.per;
  //     entity.pbr = output.pbr;
  //     entity.w52_hgpr = output.w52_hgpr;
  //     entity.w52_lwpr = output.w52_lwpr;
  //     entity.whol_loan_rmnd_rate = output.whol_loan_rmnd_rate;
  //     entity.stock = st;

  //     console.log(entity);

  //     await this.stockPriceRepository.save(entity);
  //     await this.sleep(100);
  //   } catch (error) {
  //     console.error(`Error processing stock ${stockCode}: ${error.message}`);
  //   }
  //   // }
  // }
  // @Cron('*/20 * * * * *', { name: 'stockSave' })
  async fetchDataAndSaveToDB() {
    const allStock = await this.stockRepository.find();
    const stockCodes = allStock.map((data) => data.id);
    // const ACCESS_TOKEN = await this.cacheManager.get(token);

    for (const stockCode of stockCodes) {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stockCode}`,
        headers: {
          'content-type': 'application/json',
          authorization: process.env.ACCESS_TOKEN,
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
        await this.sleep(100);
      } catch (error) {
        console.error(`Error processing stock ${stockCode}: ${error.message}`);
      }
    }
  }
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStockPrices(): Promise<StockPrice[]> {
    return await this.stockPriceRepository.find();
  }
}
