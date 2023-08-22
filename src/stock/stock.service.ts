import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async fetchDataAndSaveToDB() {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=005930`,
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
      const data = response.data;
      const entity = new Stock();
      entity.stck_shrn_iscd = data.output.stck_shrn_iscd;
      entity.bstp_kor_isnm = data.output.bstp_kor_isnm;
      entity.stck_oprc = data.output.stck_oprc;
      entity.stck_hgpr = data.output.stck_hgpr;
      entity.stck_lwpr = data.output.stck_lwpr;
      entity.acml_vol = data.output.acml_vol;
      entity.stck_prpr = data.output.stck_prpr;
      entity.acml_tr_pbmn = data.output.acml_tr_pbmn;
      entity.prdy_vrss = data.output.prdy_vrss;
      entity.hts_avls = data.output.hts_avls;
      entity.iscd_stat_cls_code = data.output.iscd_stat_cls_code;
      entity.prdy_ctrt = data.output.prdy_ctrt;
      entity.prdy_vrss = data.output.prdy_vrss;
      entity.prdy_vrss_sign = data.output.prdy_vrss_sign;

      await this.stockRepository.save(entity);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
