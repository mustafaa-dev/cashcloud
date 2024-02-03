import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Catch()
export class ApiGatewayErrorFilter implements ExceptionFilter {
  sendErrorDevelopment = (err: any, response: any) => {
    const status = +err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: HttpStatus.NOT_ACCEPTABLE,
      message: err,
    });
  };

  sendErrorProduction = (err: any, req: any, response: any) => {
    response.status(err.status).json({
      statusCode: err.status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: err.message,
    });
  };
  handleDuplicateError = (exception: any) => {
    const status = HttpStatus.NOT_ACCEPTABLE;
    const message = exception.sqlMessage.split('for')[0];
    return { message, status };
  };

  handleTypeError = (exception: any) => {
    const status = HttpStatus.NOT_ACCEPTABLE;
    const message = exception.message;
    return { message, status };
  };

  handleHttpError = (exception: any) => {
    const status = exception.getStatus();
    const message = exception.message;
    return { message, status };
  };
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception?.driverError?.code === 'ER_DUP_ENTRY')
      error = this.handleDuplicateError(exception);

    if (exception instanceof HttpException)
      error = this.handleHttpError(exception);

    if (exception instanceof TypeError) error = this.handleTypeError(exception);
    if (process.env.NODE_ENV === 'dev') {
      return this.sendErrorDevelopment(exception, response);
    } else return this.sendErrorProduction(error, request, response);
  }
}
