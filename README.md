# EasyDinnerApi
### node通过express框架构造服务器，通过router路由实现请求

### 功能简介
node.js已经搭建好了基本的服务器及路由配置，数据库使用MongoDB来作为我的数据库，MongoDB是按照bson（json的轻量二进制格式）存储的，增删改查与js的语法真的很像，刚开始学习的小伙伴建议从MongoDB入手，搭搭服务器体会不一样的乐趣

### 接口文档
端口默认为3100，修改可在bin文件下的www中修改port

####  注册
请求方式：post<br/>
请求地址：http://localhost:3100/backend/register<br/>
请求字段：<br/>
username : string   required<br/>
         password : string   required<br/>
         mobile: number required<br/>
####  普通登录
请求方式：post<br/>
请求地址：http://localhost:3100/backend/login<br/>
请求字段：<br/>mobile : string   required<br/>
         password : string   require<br/>
返回示例：{
            error_code:0,
            message:'ok',
            _token 
          }
####  token获取用户信息
请求方式：post<br/>
请求地址：http://localhost:3100/backend/get_user_info<br/><br/>
请求参数：header:authorization<br/>
返回示例：{
            error_code:0,
            message:'ok',
            _token
          }
#### 修改用户信息可上传头像
请求方式：post<br/>
请求地址：http://127.0.0.1:3100/upload/updata<br/>
请求字段：<br/>userId: payload.userId<br/>
         username:string <br/>
         headicon:file<br/>
#### 加入收藏夹
请求方式：post<br/>
请求地址：http://127.0.0.1:3100/backend/add_star<br/>
请求字段：<br/>userId: number<br/>
         cookId:number<br/>
#### 删除收藏夹
请求方式：post<br/>
请求地址：http://127.0.0.1:3100/backend/del_star<br/>
请求字段：<br/>userId: number<br/>
         cookId:number<br/>
