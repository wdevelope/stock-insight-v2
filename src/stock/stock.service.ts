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
    const stockCode = '086520';
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
      const entity = new Stock();
      entity.stck_shrn_iscd = output.stck_shrn_iscd;
      entity.rprs_mrkt_kor_name = output.rprs_mrkt_kor_name;
      entity.bstp_kor_isnm = output.bstp_kor_isnm;
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
      entity.iscd_stat_cls_code = output.iscd_stat_cls_code;

      await this.stockRepository.save(entity);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
