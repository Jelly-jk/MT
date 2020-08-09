import Koa from 'koa'

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
//加载一些重要包
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'  // 处理post的请求
import session from 'koa-generic-session' // 登陆注册都是代码直接操作session的，没有直接去操作cookie，这个可以实现帮我们自动操作cookie
import Redis from 'koa-redis'
import json from 'koa-json'  // 美化服务端向客户端发送json数据的美化效果，格式化的
import dbConfig from './dbs/config'   // 导入配置文件
import passport from './interface/utils/passport'     // 导入配置文件

// 解决跨域问题
import cors from 'koa2-cors'

import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'
import categroy from './interface/categroy'
import cart from './interface/cart'
import order from './interface/order'




const app = new Koa()

// 解决跨域问题
app.use(cors())

// 配置路由的根路径，外置的路由文件都是以这个根路径为起点的
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000


// 定义redis的密钥，并设置session是采用redis存储。
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({key: 'mt', prefix: 'mt:uid', store: new Redis()}))  // 这个是koa-generic-session插件的配置。



// 使用bodyParser中间件，解析post参数
app.use(bodyParser({      
  extendTypes:['json','form','text']
}))

app.use(json())


// 连接数据库，注意下面的dbConfig是指上面导入进来的config文件，里面的dbs属性是指数据库地址。
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})

// passport相关配置，处理登陆相关的操作，这里也是，匆匆带过的。。
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  //导入和配置接口路由（mark）一定要放在这个位置，放在别的位置可能会失效
  // 导入路由表
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({message: `Server listening on http://${host}:${port}`, badge: true})
}

start()
