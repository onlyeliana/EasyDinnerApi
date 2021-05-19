const express = require('express')
const router = express.Router()

//创建了一个路由
//这个路由是以我们规定的为跟路由，然后不同的请i求路径不同的请求从处理函数
//中间件 controller里面去写处理函数
const { createUser, userLogin, getUserInfo, addStar, delStar } = require('../controllers/usersController')
const { users } = require('./mongo/users')
var passwdCrypt = require("../middlewares/passwdCrypt");
const { route } = require('.');

router.get('/', function (req, res, next) {
  res.end('backend')
})

//注册的服务器路由
//post请求
//必要参数等
//已经进行了重复性的测试
router.post('/register', function (req, res, next) {
  //注册一定是都准备好了才会发送
  //通过前端验证 这里不需要在验证了
  //特别好的是不需要进行查找然后如果有一样的不饿能注册了
  //这样节省了很多的好处
  console.log(req.body);
  if (req.body.username && req.body.password && req.body.mobile) {
    next()
  } else {
    res.send({
      type: 'error',
      msg: '缺少必要参数'
    })
  }
}, passwdCrypt, createUser)


router.post('/login', passwdCrypt, userLogin)
router.post('/get_user_info', getUserInfo)

router.post('/add_star', addStar)
router.post('/del_star', delStar)


module.exports = router