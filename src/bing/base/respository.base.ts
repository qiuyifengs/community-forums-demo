import { QueryParameter } from '../core/model';
// import { util} from '../index';
// import { SelectQueryBuilder } from 'typeorm';
// import { PagerList } from '../core/pager-list';
// import { Document } from 'mongoose';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import * as mongoose from 'mongoose';

/**
 * 仓储基类
 */
export abstract class RepositoryBase<T> {

    // constructor(protected readonly repository: Model<T>){}

    /**
     * 操作库
     */
    // protected util = util;

    public async getAll(): Promise<any> {
        // this.findOne().exec();
        return '1';
        // return await this.repository.find().exec();
    }

    /**
     * 分页处理器
     * @param query 查询参数
     * @param selectQueryBuilder 查询构建器
     */
    // protected async pageHandler<TEntity>(query: QueryParameter, selectQueryBuilder: SelectQueryBuilder<TEntity>): Promise<PagerList<TEntity>> {
    //     const result = await selectQueryBuilder.skip(query.pageSize * (query.page - 1)).take(query.pageSize).getManyAndCount();
    //     const pageList = new PagerList<TEntity>();
    //     console.log('分页结果',result);
    //     pageList.initData(result[0], query, result[1]);
    //     return pageList;
    // }
}
