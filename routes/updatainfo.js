var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken');
// 不管fs读文件的操作代码挪到任何地方，其路径都不要动，其始终相对于入口文件
const fs = require('fs')
const jwt_secret = fs.readFileSync("./.env", "utf-8");


// var {
//     testSession,
//     loginUser
// } = require('../controllers/loginController')
//引入multer包
var multer = require('multer')
var path = require('path')
//multer的基本配置

//用一下老师的基本配置
//但是我觉得之前那个也挺好的
//基本配置一下目标路径和文件名

//只要上传就执行基本配置
//生成文件名
//转存路径
var storage = multer.diskStorage({
    //目标路径
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, 'headimg-' + Date.now() + file.originalname)
    }
})

var upload = multer({
    storage: storage
})

// router.post('/', function (req, res, next) {

//     //只能通过session登录 
//     //不要通过什么post传值啥的登录了

//     if (req.session.login_data) {

//         var data = req.session.login_data[0]
//         if (data && typeof data === 'object' && !(data instanceof Array)) {
//             //说明有seesion

//             //太好了
//             //把session里面的数据传出去
//             //里面是一个登录的对象的信息
//             res.send(data)
//         }

//     } else {
//         res.send({
//             type: 'errorlogin',
//             msg: '没有登录 请登录'
//         })
//     }

// })

function imgupload(req, res, next) {

    //这里对上传来的图片进行转存

    //返回图片的新的路径

    res.send(req.file)

}


router.post('/img', upload.single('headIcon'), function imgupload(req, res, next) {

    //这里对上传来的图片进行转存

    //返回图片的新的路径


    if (req.file) {
        res.send({
            type: 'success',
            msg: '头像上传成功',
            src: 'http://39.106.203.89:3000/images/' + req.file.filename
        })
    } else {
        res.send({
            type: 'error',
            msg: '头像上传失败'
        })
    }

})

router.post('/updata', upload.single('headIcon'), function (req, res, next) {
    //可以获取到 req.file 进行转存
    //可以获取到req.body 里面的数据
    //这里一定是有session的但是也不一定所以有session的情况下
    //req.body req.file
    //使用user数据库

    //找到对应的用户
    //对用户更新




    //表
    const { users } = require('../routes/mongo/users')


    var src = 'http://39.106.203.89:3100/images/' + req.file.filename

    let tmp = req.headers.authorization.split(" ");
    let _token = tmp[tmp.length - 1];

    try {
        const payload = jwt.verify(_token, jwt_secret);
        // 限制领牌有效期只有60分钟
        // 获取当前时间的时间戳
        const iat = payload.iat;

        users.updateOne({
            userId: payload.userId
        }, {
            username: req.body.username,
            headIcon: src
        })
            .then(function () {
                res.send({
                    type: 'success',
                    msg: '更新成功',
                    src: src,
                })
                // req.session.login_data = this;
            })
            .catch(function () {
                res.send({
                    type: 'error',
                    msg: '更新失败'
                })
            })
        // users.findOne({
        //     userId: payload.userId
        // }).then(ret => {
        //     if (ret == null) {
        //         res.send({
        //             error_code: 1002,
        //             message: "你的帐号已经被封号了！",
        //         });
        //     } else {
        //         // 增加一个更新令牌动作
        //         if (date.getTime() / 1000 - iat > 45 * 60) {
        //             _token = jwt.sign({ userId: ret.userId }, jwt_secret);
        //         }
        //         // 3.  返回给前端
        //         res.send({
        //             error_code: 0,
        //             message: "ok",
        //             data: {
        //                 starlist: ret.starlist,
        //                 username: ret.username,
        //                 mobile: ret.mobile,
        //                 headIcon: ret.headIcon,
        //                 userId: ret.userId
        //             },
        //             _token,
        //         });
        //     }
        // })
    } catch (err) {
        res.send({
            error_code: 1111,
            message: "token令牌验证失败！",
        })
    }



    //更新成功后也要修改session数据



})


module.exports = router;