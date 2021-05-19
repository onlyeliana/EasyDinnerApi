const md5 = require('md5')
const fs = require('fs')
const { users } = require('../routes/mongo/users')
const jwt = require('jsonwebtoken');
// 不管fs读文件的操作代码挪到任何地方，其路径都不要动，其始终相对于入口文件
const jwt_secret = fs.readFileSync("./.env", "utf-8");


module.exports.createUser = function (req, res, next) {
  const ran = Math.random().toString().slice(3) + Date.now()
  users.create({
    username: req.body.username,
    password: req.body.password,
    mobile: req.body.mobile,
    headIcon: 'https://pic4.zhimg.com/80/v2-c14e5277dec318d97fb0cfcebb799d91_1440w.jpg?source=1940ef5c',
    starlist: [],
    userId: ran,
  }).then(() => {
    res.send({
      type: 'success',
      msg: '注册成功'
    })
  }).catch(() => {
    res.send({
      type: 'error',
      msg: '改手机号已被注册'
    })
  })
}

module.exports.userLogin = function (req, res, next) {
  let data = req.body;
  // 查询数据库检查是否有当前这个用户
  // console.log(data);

  users.findOne(data).then((ret) => {
    if (ret === null) {
      // 没有用户（输出json数据，告诉用户没有数据）
      // 不能告诉用户是帐号错了还是密码错误。
      res.send({ error_code: 1000, message: "帐号或密码错误！" });
    } else {
      // 有这个用户（签发jwt）
      res.send({
        error_code: 0,
        message: "ok",
        // 两参数：载荷中我们自定义的数据，密钥
        _token: jwt.sign({ userId: ret.userId }, jwt_secret),
      });
    }
  });
}

module.exports.getUserInfo = function (req, res, next) {
  //这个地方是去验证token
  //判断是否存在token
  //无需登录直接通过token 来验证数据库获取登录状态信息

  // 1. 先去验证token
  let tmp = req.headers.authorization.split(" ");
  let _token = tmp[tmp.length - 1];

  try {
    const payload = jwt.verify(_token, jwt_secret);
    // 限制领牌有效期只有60分钟
    // 获取当前时间的时间戳
    const date = new Date();
    const iat = payload.iat;
    if (date.getTime() / 1000 - iat > 60 * 60) {
      // 令牌过期了
      res.send({
        error_code: 1001,
        message: "令牌已经过期！",
      });
    } else {
      users.findOne({
        userId: payload.userId
      }).then(ret => {
        if (ret == null) {
          res.send({
            error_code: 1002,
            message: "你的帐号已经被封号了！",
          });
        } else {
          // 增加一个更新令牌动作
          if (date.getTime() / 1000 - iat > 45 * 60) {
            _token = jwt.sign({ userId: ret.userId }, jwt_secret);
          }
          // 3.  返回给前端
          res.send({
            error_code: 0,
            message: "ok",
            data: {
              starlist: ret.starlist,
              username: ret.username,
              mobile: ret.mobile,
              headIcon: ret.headIcon,
              userId: ret.userId
            },
            _token,
          });
        }
      })
    }
  } catch (err) {
    res.send({
      error_code: 1111,
      message: "token令牌验证失败！",
    })
  }
}

//还有一个更新收藏夹的操作
//

module.exports.addStar = function (req, res, next) {
  let tmp = req.headers.authorization.split(" ");
  let _token = tmp[tmp.length - 1];
  //token 找到数据库的用户
  //发送一个cookid过来
  //加入到收藏数组里面
  let cookId = req.body.cookId;
  try {
    const payload = jwt.verify(_token, jwt_secret);
    // 限制领牌有效期只有60分钟
    // 获取当前时间的时间戳
    const date = new Date();
    const iat = payload.iat;
    if (date.getTime() / 1000 - iat > 60 * 60) {
      // 令牌过期了
      res.send({
        error_code: 1001,
        message: "令牌已经过期！",
      });
    } else {
      users.findOne({
        userId: payload.userId
      }).then(ret => {
        if (ret == null) {
          res.send({
            error_code: 1002,
            message: "你的帐号已经被封号了！",
          });
        } else {
          let starlist = ret.starlist;
          if (starlist.includes(cookId)) {
            res.send({
              error_code: 1,
              message: "已经收藏过啦",
            })
          } else {
            starlist.push(cookId)
          }
          users.updateOne({
            userId: payload.userId
          }, {
            starlist: starlist
          }).then(() => {
            res.send({
              error_code: 0,
              message: "收藏更新成功",
            })
          }).catch(() => {
            res.send({
              error_code: 1003,
              message: "收藏更新失败",
            })
          })


          // 增加一个更新令牌动作
          // if (date.getTime() / 1000 - iat > 45 * 60) {
          //   _token = jwt.sign({ userId: ret.userId }, jwt_secret);
          // }
          // // 3.  返回给前端
          // res.send({
          //   error_code: 0,
          //   message: "ok",
          //   data: {
          //     starlist: ret.starlist,
          //     username: ret.username,
          //     mobile: ret.mobile,
          //     headIcon: ret.headIcon,
          //     userId: ret.userId
          //   },
          //   _token,
          // });
        }
      })
    }
  } catch (err) {
    res.send({
      error_code: 1111,
      message: "token令牌验证失败！",
    })
  }
}
module.exports.delStar = function (req, res, next) {
  let tmp = req.headers.authorization.split(" ");
  let _token = tmp[tmp.length - 1];
  //token 找到数据库的用户
  //发送一个cookid过来
  //加入到收藏数组里面
  let cookId = req.body.cookId;
  try {
    const payload = jwt.verify(_token, jwt_secret);
    // 限制领牌有效期只有60分钟
    // 获取当前时间的时间戳
    const date = new Date();
    const iat = payload.iat;
    if (date.getTime() / 1000 - iat > 60 * 60) {
      // 令牌过期了
      res.send({
        error_code: 1001,
        message: "令牌已经过期！",
      });
    } else {
      users.findOne({
        userId: payload.userId
      }).then(ret => {
        if (ret == null) {
          res.send({
            error_code: 1002,
            message: "你的帐号已经被封号了！",
          });
        } else {
          let starlist = ret.starlist;
          if (starlist.includes(cookId)) {
            let i = starlist.indexOf(cookId);
            starlist.splice(i, 1);
          } else {
            res.send({
              error_code: 1003,
              message: "没有收藏过哦",
            })
          }
          users.updateOne({
            userId: payload.userId
          }, {
            starlist: starlist
          }).then(() => {
            res.send({
              error_code: 0,
              message: "删除成功",
            })
          }).catch(() => {
            res.send({
              error_code: 1004,
              message: "删除失败",
            })
          })


          // 增加一个更新令牌动作
          // if (date.getTime() / 1000 - iat > 45 * 60) {
          //   _token = jwt.sign({ userId: ret.userId }, jwt_secret);
          // }
          // // 3.  返回给前端
          // res.send({
          //   error_code: 0,
          //   message: "ok",
          //   data: {
          //     starlist: ret.starlist,
          //     username: ret.username,
          //     mobile: ret.mobile,
          //     headIcon: ret.headIcon,
          //     userId: ret.userId
          //   },
          //   _token,
          // });
        }
      })
    }
  } catch (err) {
    res.send({
      error_code: 1111,
      message: "token令牌验证失败！",
    })
  }
}