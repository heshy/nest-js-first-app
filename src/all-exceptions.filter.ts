import { Catch, HttpException, HttpStatus, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

type MyResponseObject = {
    statusCode: number,
    timeStamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllEceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new MyLoggerService(AllEceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost): void {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObject: MyResponseObject = {
            statusCode:200,
            timeStamp: new Date().toISOString(),
            path: request.url,
            response: ''
        }

        if(exception instanceof HttpException){
            myResponseObject.statusCode = exception.getStatus();
            myResponseObject.response = exception.getResponse();
        }else if(exception instanceof PrismaClientValidationError) {
             myResponseObject.statusCode = 422;
             myResponseObject.response = exception.message.replaceAll(/\n/g, ' ');
        }else {
            myResponseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            myResponseObject.response = 'Internal Server Error';
        }

        response.status(myResponseObject.statusCode)
            .json(myResponseObject);
        
        this.logger.error(myResponseObject.response, AllEceptionsFilter.name);

        super.catch(exception, host);

    }       

}
