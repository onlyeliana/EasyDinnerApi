// 导入md5包
const md5 = require("md5");
// 对密码加密
var passwdCrypt = function (req, res, next) {
  // 此处需要用到“加盐/料加密”的思想，直接md5会有被爆破的风险
  req.body.password = md5(
    req.body.password + md5(req.body.password).substr(10, 10)
  );
  next();
};
// 导出
module.exports = passwdCrypt;
