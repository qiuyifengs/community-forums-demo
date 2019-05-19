import * as path from 'path'
import * as multer from 'multer'
import * as fs from 'fs'

export const uploadConfig = {
    fileFilter: (req, file, cb) => {
        let extension = (file.originalname.split('.').pop())
        //Put here your custom validation for file extensións.
        // To accept the file pass `true`, like so:
        cb(null, true);
        // To reject this file pass `false` or throw Exception, like so:
        //cb(new HttpException ("File format is not valid", HttpStatus.BAD_REQUEST), false)
    },
    limits: {
        fileSize: 209715200 //2 Megabytes
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var _path = path.join(__dirname, "../../../static_files");
            if(!fs.existsSync(_path)){
                fs.mkdirSync(_path);
            }
            cb(null, _path);    // 保存的路径，备注：需要自己创建
        },
        filename: function (req, file, cb) {
            // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
            cb(null, file.originalname);  
        }
    })
};