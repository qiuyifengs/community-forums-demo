/**
 * 服务端返回的标准结果
 */
export class Result<T>{
    /**
     * 状态码
     */
    code: number | StateCode;
    /**
     * 消息
     */
    message: string;
    /**
     * 数据
     */
    data: T;
    /**
     * 操作时间
     */
    operationTime: string;
}

/**
 * 状态码
 */
export enum StateCode {
    /**
     * 成功
     */
    Ok = 1,
    /**
     * 失败
     */
    Fail = 2,
}