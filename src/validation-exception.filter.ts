import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
      const formattedErrors = {};

      exceptionResponse.message.forEach((msg: string) => {
        const [field, ...errorMsg] = msg.split(' ');
        const fieldName = field.charAt(0).toLowerCase() + field.slice(1); // Ensure camelCase field names

        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = [];
        }
        formattedErrors[fieldName].push(errorMsg.join(' '));
      });

      return response.status(status).json(formattedErrors);
    }

    return response.status(status).json(exceptionResponse);
  }
}