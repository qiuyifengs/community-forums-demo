/**
 * 创建操作审计
 */
export interface ICreationAudited {
    /**
     * 创建时间
     */
    creationTime: Date;
    /**
     * 创建人编号
     */
    creatorId: string;
}

/**
 * 修改操作审计
 */
export interface IModificationAudited {
    /**
     * 最后修改时间
     */
    lastModificationTime: Date;
    /**
     * 最后修改人编号
     */
    lastModifierId: string;
}

/**
 * 删除操作审计
 */
export interface IDeletionAudited {
    /**
     * 删除时间
     */
    deletionTime: Date;
    /**
     * 删除人编号
     */
    deleterId: string;
}

/**
 * 操作审计
 */
export interface IAudited extends ICreationAudited, IModificationAudited { }

/**
 * 全部操作审计
 */
export interface IFullAudited extends IAudited, IDeletionAudited { }

/**
 * 审计方法
 */
export enum AuditedMethod {
    /**
     * 创建
     */
    Created,
    /**
     * 更新
     */
    Updated,
    /**
     * 删除
     */
    Deleted,
}