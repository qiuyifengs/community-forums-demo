import { NestInterceptor, Injectable, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { util, Result } from '@/bing';
import { map } from 'rxjs/operators';

/**
 * 结果包装 拦截器
 */
@Injectable()
export class ResultWrapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        return call$.pipe(map(value => {
            const data = {
                code: 1,
                operationTime: util.moment().utc().format('YYYY-MM-DD hh:mm:ss.SSS'),
            };
            const resData = Object.assign(data, value);
            return resData as Result<any>;
        }));
    }
}