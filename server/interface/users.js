import Router from 'koa-router'
import Redis from 'koa-redis'  // 用来统一管理验证码，来匹配验证码和发送验证码的用户这种一一对应的关系
import nodeMailer from 'nodemailer'  // 开启当前邮箱账号可以给别的邮箱发送这种验证消息
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

//声明路由，当前这个问价下都是以users为起点的路径
let router = new Router({prefix: '/users'})

//获取redis客户端（因为，当前模块要启用redis服务，所以当前模块相对于redis服务就是个客户端，redis是服务端）
let Store = new Redis().client



//注册接口，获取用户在前端页面中提交的表单数据
router.post('/signup', async (ctx) => {
  const {username, password, email, code} = ctx.request.body;
  // 这些变量都是页面中表单在发起请求时提交的数据，用来和后端的数据作对比。
  if (code) {
    // 这个code是前端获取的验证码，这个验证码是modemail下发的，会填在表单里一起提交到后台，后台需要对这
    // 个验证码进行验证，看是否是modemail下发的，也就是和nodemail下发时存在redis中的备份进行对比。
    // 下面这种格式是自己定义的，redis是键值对的存储方式，为了方便区分是哪个版块的键值对，所以在键名前面
    // 加了个nodemail：，也就是nodemail发送的数据会存到nodemail前缀的这个key下面，并跟上动态的用户名
    // 这个下发验证码存储的定义在本页代码接口的下面，接口verify里面定义的！！！先去看那个回来再看下面两行

    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // Store.hget是返回给定字段的值。如果给定的字段或 key 不存在时，返回 nil 
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    // 所以上面的这两个是查询当nodemail
    // 上面的这两个，code和expire是在config.js里面定义的，里面是用来配置数据库和redis的配置文件的
    // 因为在nodemail发送验证码的时候就已经将code和expire这两个字段以键值对的形式存到了redis里，所以这里
    // 可以把那两个键的值给取出来，对应的当前访问的用户，保证一一对应的关系。


    if (code === saveCode) {  // 如果验证码前后端一致就验证是否过期

      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }

    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }


  // 使用MongoDB来查询用户名，如果有了就说明注册过了
  let user = await User.find({username})
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }


  // 如果上述验证都通过了，就要将数据写到数据库，用户注册成功
  let nuser = await User.create({username, password, email})  // 将用户输入的数据写进数据库，这三个应该是属性简写


  // 如果写入成功了，就代表数据库已经有这个数据了，那么就可以自动登录了，将自动为用户请求登录接口进行登录
  if (nuser) {
    let res = await axios.post('/users/signin', {username, password})  // 这个请求的返回值在下面登录地方定义的
    if (res.data && res.data.code === 0) {  
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})




//登录接口，使用Passport提供的api进行验证
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) { // 这个函数是passport.js中的done函数的回调，done调用时传递了不同的参数进来
    if (err) {
      ctx.body = {          //  local代表我们使用的是本地策略，也是authenticate的固定用法。authenticate是在passport包源码中定义的，所以是固定用法
        code: -1,
        msg: err
      }
    } else {
      if (user) {  // 如果用户正常存在就是true，就登录
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)  // 进行登录的动作   这个方法哪来的？  passport包向ctx中添加的！！这两个方法是passport这个包向ctx上下文对象中添加的。login() 方法会调用passport.js中序列化函数执行序列化，并把login中的参数传递到序列化函数中的第一个参数中。
      } else {  //  如果没拿到就抛出异常
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)  // 这种是api的固定用法，需要调用一下并传递上下文进去，没有为什么，就是规定。
})





//验证码验证接口
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username  // 获取当前请求者的用户名
  // 获取当前用户请求的验证码的过期时间
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')  // 根据当前请求者查询验证码有效期，这个过期时间也是在下面写入redis中进行存入的，也就是说一开始是拿不到这个过期时间的值的
  //拦截频繁刷接口操作
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  //发邮件功能
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    service: false,
    auth: {
      user: Email.smtp.user,  // 开启SMTP功能，发送邮件的邮箱
      pass: Email.smtp.pass   // 发送邮件的邮箱授权码
    }
  })
  //确定接收方，发送相关信息
  let ko = {
    code: Email.smtp.code(),  // 生成的验证码，这里用的都是在之前config里面定义好的函数，这里用Email变量引入的，所以这里引用非常方便
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  //邮件中显示内容定义
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《Jelly的高仿美团网全栈开发》注册码',
    html: `您在《Jelly的高仿美团网全栈开发》网页中注册，您的邀请码是${ko.code}`
  }
  //发送邮件
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('error')
    } else {
      //在redis中存储注册方信息
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }  // 上面的这种存储方式是成对存在的意思，每两个是一对，键值对的形式
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})




//退出接口
router.get('/exit', async (ctx, next) => {
  //执行注销操作
  await ctx.logout()   
  //进行二次验证，看是否成功注销掉，是否已认证
  if (!ctx.isAuthenticated()) {    // isAuthenticated这个是在passport包源码中定义的，所以是固定用法
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})




//获取用户名
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user  // passport是存储在session中的，如果登录状态，session中一定有passport，passport中一定有user
    ctx.body={
      user:username,
      email
    }
  }else{
    ctx.body={
      user:'',
      email:''
    }
  }
})

export default router
//  本质上就是个外置路由文件，向router这个实例对象中添加了一些路由的匹配规则。
//  这种koa2的写法和egg.js 的mvc模式差不多，只不过egg将路由匹配和匹配后对应的controller操作分离成两个文件来写了。

