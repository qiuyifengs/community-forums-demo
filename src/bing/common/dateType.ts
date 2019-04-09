
/**
 * 时间格式化工具
 */
export class DataType {
    static async trancdate() {
        const date = new Date();
        const yy = date.getFullYear();
        const mon = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        const dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        const hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
        const mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        const ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
        return yy + '-' + mon + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
    }
    /**
     * to second
     */
    static async toSecond() {
        return await this.trancdate();
    }
    /**
     * to day
     */
    static async toDay() {
        const toDay = await this.trancdate();
        const returnDay = toDay.substring(0, 10);
        return returnDay;
    }
    /**
     * getTime
     */
    static getTime() {
        const date = new Date();
        return date.getTime();
    }
}
