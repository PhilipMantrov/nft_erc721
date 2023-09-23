import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { throwError } from "rxjs";
import * as Sentry from "@sentry/node";

interface RpcExceptionBody {
  code: string;
  message: string;
}

@Catch()
export class ExceptionsFilter extends BaseRpcExceptionFilter {
  public catch(exception: RpcException, host: ArgumentsHost) {
    console.log(exception);
    const args = host.getArgs();
    return exception.getError
      ? throwError(() => exception.getError())
      : throwError(() => new RpcException(exception).getError());
  }
}
