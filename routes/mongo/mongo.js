//连接数据库
//直接 导出这个数据库
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/easyDinning')
  .then(() => {
    console.log('数据库已经连接');
  })
  .catch(() => {
    console.log('数据库连接失败');
  })

module.exports = { mongoose }