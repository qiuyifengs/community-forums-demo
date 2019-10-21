import { QueryParameter } from './model';
import { util } from '../../bing';
/**
 * 分页集合
 */
export class PagerList<T>{
    /**
     * 页索引
     */
    page: number;
    /**
     * 每页显示行数
     */
    pageSize: number;
    /**
     * 总行数
     */
    totalCount: number;
    /**
     * 总页数
     */
    pageCount: number;
    /**
     * 排序条件
     */
    order: string;
    /**
     * 数据
     */
    data: T[];

    /**
     * 初始化分页集合
     * @param list 分页集合
     */
    constructor(list?: PagerList<T>) {
        if (!list) {
            return;
        }
        this.page = list.page;
        this.pageSize = list.pageSize;
        this.totalCount = list.totalCount;
        this.pageCount = list.pageCount;
        this.order = list.order;
        this.data = list.data;
    }

    /**
     * 初始化数据
     * @param list 集合
     */
    public initData(list: T[], queryParameter: QueryParameter, totalCount: number): void {
        this.data = list;
        this.page = util.helper.toInt(queryParameter.page);
        this.pageSize = util.helper.toInt(queryParameter.limit);
        this.totalCount = util.helper.toInt(totalCount);
        this.initPageCount();
    }

    /**
     * 初始化总页数
     */
    private initPageCount(): void {
        if ((this.totalCount % this.pageSize) === 0) {
            this.pageCount = util.helper.toInt(this.totalCount / this.pageSize);
            return;
        }
        this.pageCount = util.helper.floor((this.totalCount / this.pageSize) + 1);
    }
}