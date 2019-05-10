import $ from 'jquery'
import jQuery from 'jquery';
window.$ = $
window.jQuery = $
// baseUrl
// var baseUrl = 'http://192.168.4.188:3002/';
var baseUrl = 'http://127.0.0.1:3002/';
/**
 * checkEmail
 * @param {*} email 
 */
function checkEmail(email) {
    var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if (myReg.test(email)) {
        return true;
    } else {
        return false;
    }
}
/**
 * goPage
 * @param {*} pathName 
 */
function goPage(pathName, newWin) {
    if (newWin) {
        window.open(baseUrl + pathName)
    } else {
        $(window).attr('location', baseUrl + pathName);
    }
}
/**
 * _ajax
 * @param {*} method 
 * @param {*} url 
 * @param {*} params 
 */
function myAjax(method, url, params) {
    return new Promise((resolve, rejects) => {
        try {
            $.ajax({
                type: method,

                url: baseUrl + url,
                data: params,
                // headers: {
                //     'Authorization': 'Bearer ',// <jwt token>
                // },
                success: (data) => {
                    resolve(data);
                },
                error: (err) => {
                    rejects(err);
                }
            })
        }
        catch (err) {
            return err
        }
    })

}

/**
* 格式化时间
*
* @param {String} str
* @returns 格式化后的时间
*/
function formatDateFilter(value) {
    if (!value) return ''
    // safari中不支持2018-02-13这种格式转为时间戳会显示NaN, - 替换 /
    var date = new Date(value.replace(/-/g, '/'))
    var time = new Date().getTime() - date.getTime() // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return ''
    } else if ((time / 1000 < 30)) {
        return '<span lang="just"> 刚刚</span>'
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000), 10) + '<span lang="seconds"> 秒前</span>'
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000), 10) + '<span lang="minutes"> 分钟前</span>'
    } else if ((time / 3600000) < 24) {
        return parseInt((time / 3600000), 10) + '<span lang="hours"> 小时前</span>'
    } else if ((time / 86400000) < 31) {
        return parseInt((time / 86400000), 10) + '<span lang="days"> 天前</span>'
    } else if ((time / 2592000000) < 12) {
        return parseInt((time / 2592000000), 10) + '<span lang="months"> 月前</span>'
    } else {
        return parseInt((time / 31536000000), 10) + '<span lang="years"> 年前</span>'
    }
}

function formatDateFilter2(value) {
    var mistiming = Math.round(new Date() / 1000) - (value / 1000);
    var postfix = mistiming > 0 ? '前' : '后'
    mistiming = Math.abs(mistiming)
    var arrr = ['<span lang="years"> 年前</span>', '<span lang="months"> 月前</span>', '星期前', '<span lang="days"> 天前</span>', '<span lang="hours"> 小时前</span>', '<span lang="minutes"> 分钟前</span>', '<span lang="seconds"> 秒前</span>', '<span lang="just"> 刚刚</span>']
    var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]

    for (var i = 0; i < 7; i++) {
        var inm = Math.floor(mistiming / arrn[i])
        if (inm != 0) {
            return inm + arrr[i]
        }
    }
}
// return "yyyy-MM-dd hh:mm:ss"
function format(fmt, date)   
{ //author: meizz   
    var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;
}

function renderColor(id,name) {
    var info = JSON.parse(localStorage.getItem('staffInfo-'+id));
    var color =null;
    if(info){
      if((!info.name)&&name){
        localStorage.setItem('staffInfo-'+id,JSON.stringify({id:id,name:name,color:info.color}));
        return info.color;
      }else{
        return info.color;
      }
    }else{
      if(name){
        color ='#';
        for(var i = 0;i<6;i++){
          color+=Math.round(Math.random() * 9);
        }
        localStorage.setItem('staffInfo-'+id,JSON.stringify({id:id,name:name,color:color}));
        return color;
      }else{
        color ='#';
        for(var i = 0;i<6;i++){
          color+=Math.round(Math.random() * 9);
        }
        localStorage.setItem('staffInfo-'+id,JSON.stringify({id:id,color:color}));
        return color;
      }
    }
}
/**
 * show article content in articleDetail page
 * @param {*} valArr 
 */
function dealArticleContent(valArr) {
    valArr.forEach(item => {
        if (item.type === 'text') {
            if (item.value.indexOf('[qq_') > -1) {
                let emojiDom = `<img class="emoji-pic" src="http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/`
                let value = item.value.replace(/\[qq_/g, emojiDom)
                item.value = `<p class="text-box" data-type="${item.type}">${value.replace(/\]/g, '.gif">')}</div>`
            } else {
                item.value = `<p class="text-box" data-type="${item.type}">${item.value}</div>`
            }
            
        } else if (item.type === 'link') {
            let linkVal = []
            for (const link of item.url) {
                linkVal.push(`<p class="link-box" data-type="${item.type}"><a href="${link.link}">${link.title}</a></p>`)
            }
            item.value = linkVal.join('')
        } else if (item.type === 'pic') {
            if (item.value.indexOf('[qq_') > -1) {
                let emojiDom = `<img class="emoji-pic" src="http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/`
                let value = item.value.replace(/\[qq_/g, emojiDom)
                item.value = `<p class="img-box" data-type="${item.type}"><img src="${item.url}" /><br />${value.replace(/\]/g, '.gif">')}</p>`
            } else {
                item.value = `<p class="img-box" data-type="${item.type}"><img src="${item.url}" /><br />${item.value}</p>`
            }
        } else if (item.type === 'video') {
            if (item.value.indexOf('[qq_') > -1) {
                let emojiDom = `<img class="emoji-pic" src="http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/`
                let value = item.value.replace(/\[qq_/g, emojiDom)
                item.value = `<p class="video-box" data-type="${item.type}"><video controls="" autoplay="" name="media"><source src="${item.url}" type="video/mp4"></video><br />${value.replace(/\]/g, '.gif">')}</p>`
            } else {
                item.value = `<p class="video-box" data-type="${item.type}"><video controls="" autoplay="" name="media"><source src="${item.url}" type="video/mp4"></video><br />${item.value}</p>`
            }
            
        }
    })
    return valArr;
}
/**
 * Processing List Display Format
 * @param {*} valArr 
 */
function dealPostList(valArr) {
    valArr.forEach(item => {
        if (item.type === 'text') {
            if (item.value.indexOf('[qq_') > -1) {
                let emojiDom = `<img src="http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/`
                let value = item.value.replace(/\[qq_/g, emojiDom)
                item.value = `${value.replace(/\]/g, '.gif">')}`
            } else {
                item.value = `${item.value }`
            }
        } else if (item.type === 'link') {
            let linkVal = []
            for (const link of item.url) {
                linkVal.push(`${link.title}`)
            }
            item.value = linkVal.join('')
        } else if (item.type === 'pic') {
            item.value = `${item.value}`
            item.url = `${item.url}`
        } else if (item.type === 'video') {
            item.value = `${item.value}`
        }
    })
    return valArr
}

// translate
function translateFun(lang) {
    let lan = lang ? lang : localStorage.getItem('langData') ? JSON.parse(localStorage.getItem('langData')).lang : 'cn'
    $('[lang]').each(function(e){
        let key = $(this).attr('lang')
        if (lan == 'cn') {
            $(this).text(zh[key])
        } else {
            $(this).text(en[key])
        }
    })
}

    
