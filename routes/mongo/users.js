//引入连接好的mongoose
const { mongoose } = require('./mongo')


//生成一个users的库
//这个库有一个规则
//命名规则 导出这个库


const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
  },
  username: {
    type: String,
    requierd: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  headIcon: {
    type: String,
    required: false,
  },
  starlist: {
    type: Array,
  }
})

//根据规则创建一个表
//构造函数
var users = mongoose.model('users', userSchema)
module.exports = { users }