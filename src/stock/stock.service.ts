import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { StockPrice } from './entities/stockPrice.entity';
// import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockPrice)
    private stockPriceRepository: Repository<StockPrice>, // private schedulerRegistry: SchedulerRegistry,
  ) {}

  // @Cron('0 */10 9-16 * * 1-5', {
  //   name: 'stock',
  //   timeZone: 'Asia/Seoul',
  // })
  // @Cron('0 25 * * * *', { name: 'stockSave' })
  async fetchDataAndSaveToDB() {
    const stockCodes = process.env.STOCKCODES.split(',');

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
        const entity = new StockPrice();
        entity.stck_prpr = output.stck_prpr;
        entity.prdy_vrss = output.prdy_vrss;
        entity.prdy_vrss_sign = output.prdy_vrss_sign;
        entity.prdy_ctrt = output.prdy_ctrt;
        entity.stck_oprc = output.stck_oprc;
        entity.stck_hgpr = output.stck_hgpr;
        entity.stck_lwpr = output.stck_lwpr;
        entity.stck_sdpr = output.stck_sdpr;
        entity.acml_vol = output.acml_vol;
        entity.acml_tr_pbmn = output.acml_tr_pbmn;
        entity.hts_frgn_ehrt = output.hts_frgn_ehrt;
        entity.hts_avls = output.hts_avls;
        entity.per = output.per;
        entity.pbr = output.pbr;
        entity.w52_hgpr = output.w52_hgpr;
        entity.w52_lwpr = output.w52_lwpr;
        entity.whol_loan_rmnd_rate = output.whol_loan_rmnd_rate;

        await this.stockPriceRepository.save(entity);
        await this.sleep(100);
      } catch (error) {
        console.error(`Error processing stock ${stockCode}: ${error.message}`);
      }
    }
  }
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
