const _ = require('lodash');	
const nodemailer = require('nodemailer');
let emailCode  = 000000 //验证码为6位随机数
// 创建一个SMTP客户端配置
const config = {
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'wuzhanfly@163.com',
            pass: 'wzf48690812'
        }
    };
    
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

// 创建一个邮件对象
var mail = {
    // 发件人
    from: 'wuzhanfly@163.com',
    // 主题
    subject: 'test',
    // 收件人
    to: '505736712@qq.com',
    // 邮件内容，HTML格式
   // html: '<a href = "www.baidu.com">baidu</a>' // html body
    html: '<h1>Hello!</h1><p style="font-size: 18px;color:#000;">验证码为：<a href = "http://54.244.82.38/#/transactions"><u style="font-size: 16px;color:#1890ff;">'+ emailCode +'</u></a></p><p style="font-size: 14px;color:#666;">10分钟内有效</p>'

   
};

// const defaultMail = {
//     from: 'wuzhanfly@163.com',
//     html: 'html',
// };

// module.exports = function(mail){
//     // 应用默认配置
//     mail = _.merge({}, defaultMail, mail);
    
//     // 发送邮件
//     transporter.sendMail(mail, function(error, info){
//         if(error) return console.log(error);
//         console.log('mail sent:', info.response);
//     });
// };

//发送邮件
transporter.sendMail(mail, function(error, info){
    if(error) return console.log(error);
    console.log('mail sent:', info.response);
});
