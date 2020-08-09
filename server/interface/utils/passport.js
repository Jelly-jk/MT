//koa2使用passport权限认证中间件安装包
import passport from 'koa-passport'

//本地验证策略
import LocalStrategy from 'passport-local'

//导入本地数据库，就是在db文件夹下建立的user数据表
import UserModel from '../../dbs/models/users'

//提交数据（策略）
passport.use(new LocalStrategy(async function(username,password,done){
                                // 这里的参数是用户提交的，下面的result是根据提交的从数据库中查出来的

  // 设置查询条件
  let where = {
    username  // username:username的简写
  };
  //从本地数据库查找，判断是否存在该用户
  let result = await UserModel.findOne(where)
  if(result!=null){
    //找到之后匹配密码
    if(result.password===password){
      return done(null,result)    // 这个是在调用user.js中的authenticate中的第二个参数（也就是哪个回调函数）
    }else{
      return done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户不存在')
  }
}))


// 以下序列化是封装固定好的api，没有为什么直接这样用就行

//序列化,让用户每次进入时候，通过session验证，登陆成功后将用户信息存到session中
passport.serializeUser(function(user,done){   // ctx.login()方法会触发这个序列化函数,这个login方法是passport这个包向ctx上下文对象中添加的
  done(null,user)
   /*done的第一个参数为错误信息，没有就返回null，第二个参数为用户信息（验证失败则为false）*/
})
//反序列化，以后再发送请求的时候会在session中读取这个对象
passport.deserializeUser(function(user,done){  
  return done(null,user)
  
})

//导出
export default passport
