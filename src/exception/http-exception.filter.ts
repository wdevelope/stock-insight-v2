import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    console.log('exception 전');
    console.log('if문 들어가기 전 exception', exception);

    if (!(exception instanceof HttpException)) {
      console.log('if문 안 exception', exception);
      exception = new InternalServerErrorException();
    }
    console.log('exception 후');

    const response = (exception as HttpException).getResponse();

    const timestamp = new Date();
    const url = req.url;

    res
      .status((exception as HttpException).getStatus())
      .json({ response, timestamp, url });
  }
}
