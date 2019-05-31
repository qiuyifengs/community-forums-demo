import { PassiveException } from './passive.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * 找不到页面异常
 */
export class NotFoundException extends PassiveException {
    /**
     * 初始化找不到页面异常
     * @param message 错误消息
     */
    constructor(message?: string) {
        super(message || '所请求的页面不存在或已被删除', HttpStatus.NOT_FOUND);
    }
}
