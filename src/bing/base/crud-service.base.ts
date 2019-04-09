import { ServiceBase } from './service.base';
import { Injectable } from '@nestjs/common';
import { RepositoryBase } from './respository.base';
// import { Model } from 'mongoose';

// import { QueryParameter } from '../core/model';
import { util} from '../index';
// import { SelectQueryBuilder } from 'typeorm';
import { PagerList } from '../core/pager-list';

/**
 * 增删改查服务基类
 */
@Injectable()
export class CrudServiceBase<T> extends ServiceBase {

    /**
     * 初始化增删改查服务基类
     * @param repository 仓储
     */
    // constructor(protected readonly repository: Model<T>){
    //     super();
    // }

    // protected async pageHandler<TEntity>(query: QueryParameter, selectQueryBuilder: SelectQueryBuilder<TEntity>): Promise<PagerList<TEntity>> {
    //     const result = await selectQueryBuilder.skip(query.pageSize * (query.page - 1)).take(query.pageSize).getManyAndCount();
    //     const pageList = new PagerList<TEntity>();
    //     console.log('分页结果',result);
    //     pageList.initData(result[0], query, result[1]);
    //     return pageList;
    // }
}