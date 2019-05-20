import * as helper from './common/helper';
import * as encrypt from './common/encrypt';
import { Log } from './common/log';
import moment = require('moment');
import * as random from './common/random';
import { DataType } from './common/dateType';
import * as SeaweedFS from 'seaweedfs';

/**
 * 操作库
 */
export class Util {
    /**
     * 公共操作
     */
    static helper = helper;
    /**
     * 日志操作
     */
    static log = new Log();
    /**
     * 加密操作
     */
    static encrypt = encrypt;
    /**
     * moment操作
     */
    static moment = moment;
    /**
     * 随机字符串操作
     */
    static ramdom = random;
    /**
     * 时间格式化
     */
    static dateType = DataType;
    /**
     * token config
     */
    static session = {
        secrets: '123',
    };

    /**
     * SeaweedFS
     */
    static client = new SeaweedFS({
        masters: [{
          host: '7.7.3.12',
          port: 9333,
        },
      ],
      scheme: 'http',
      retry_count: 60,
      retry_timeout: 20000,
      log_name: 'SeaweedFS',
      log_level: 'info',
    });
}
