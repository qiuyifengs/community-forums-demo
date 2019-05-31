import { ApiModelProperty } from '@nestjs/swagger';
/**
 * 标识
 */
export interface IKey {
    /**
     * 标识
     */
    id: string;
}

/**
 * 乐观锁
 */
export interface IVersion {
    /**
     * 版本号
     */
    version: string;
}

/**
 * 逻辑删除
 */
export interface IDelete {
    /**
     * 是否删除
     */
    isDeleted: boolean;
}

/**
 * 视图模型
 */
export class ViewModel implements IKey {
    /**
     * 标识
     */
    @ApiModelProperty({ description: '标识' })
    id: string;
}

/**
 * 查询参数
 */
export class QueryParameter {
    /**
     * 页索引，即第几页
     */
    @ApiModelProperty({ description: 'curr page', default: 1 })
    page: number;
    /**
     * 每页显示行数
     */
    @ApiModelProperty({ description: 'page limit', default: 10 })
    limit: number;

    /**
     * 排序条件
     */
    order: string;
    /**
     * 搜索关键字
     */
    keyword: string;
}