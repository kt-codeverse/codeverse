import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let error: HttpException;

    if (exception instanceof HttpException) {
      error = exception;
    } else {
      error = new InternalServerErrorException();
    }

    const response = error.getResponse();

    const log = {
      timestamp: new Date().toISOString(),
      url: req.url,
      response,
    };

    Logger.log(JSON.stringify(log));

    res.status(error.getStatus()).json(response);
  }
}
