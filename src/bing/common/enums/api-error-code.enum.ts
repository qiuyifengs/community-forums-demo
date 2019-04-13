export enum ApiErrorCode {
    TIMEOUT = -1, // 系统繁忙
    SUCCESS = 10000, // 成功
    USER_ID_INVALID = 10001, // 用户id无效
    USER_NAME_HAD = 10002, // 用户名已存在
    USER_PASSWORD_ERROR = 10003, // 密码不正确
    REMOVE_FAILT = 10004, // 取消失败
    USER_REGISTER_SUCCESS = 10005, // 注册成功
    USER_LOGIN_SUCCESS = 10006, // 登入成功
    USER_REQ = 10007, // 用户名重复
    VERIFICA_EMAIL_SUCCESS = 10008, // 邮箱验证成功
    VERIFICA_EMAIL_Failure = 10009, // 验证失败
    VERIFICA_EMAIL_TOKEN = 10010, // 验证失败,TOKEN
    NO_DATA = 10011, // 查无数
    USER_EMAIL_ERROR = 10012, // 邮箱不正确
    REPLY_SUCCESS = 10013, // 评论成功
    DELETE_SUCCESS = 10014, // 删除成功
    PUBLISH_SUCCESS = 10015, // 发表或者保存成功
    PUBLISH_FAILURE = 10016, // 发表或者保存失败
    CHANGE_USERINFO_FERROR = 10017, // 修改资料失败
}
