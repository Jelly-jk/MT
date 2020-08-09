export default {    // 整体向外暴露一个对象

    // 配置数据库相关配置（MongoDB和redis）
    dbs:'mongodb://127.0.0.1:27017/student',
    redis: {
        get host() {  // 函数名前加get表示该函数只读
            return '127.0.0.1'  // 表示redis运行的主机，这里是本机就写了这个，如果需要写到其他地方比如服务器上就写对应真实的ip
        },
        get port (){
            return 6379 // 端口号，redis默认就是这个
        }
    },

    // 配置邮箱的smtp服务
    smtp: {
        get host () {
            return 'smtp.qq.com'    //  固定写法
        },
        get user() {
            return '1510355547@qq.com' //填入你的邮箱
        },
        get pass(){
            return 'bzfmoyffgstvggbh' //填入你的授权码  gypfzcexnfulghhh
          },


        // 下面code和expire这两个会以键值对的形式存到redis中，方便后台对前台页面提交过来的验证码进行校验  
        //  具体存的时机是在调用这个函数的时候才生成验证码并存到redis中的！！
	      get code(){
          return ()=>{  // 生成随机的四位验证码
            return Math.random().toString(16).slice(2,6).toUpperCase()
          }
        },
        get expire(){   // 设置验证码的过期时间，别的地方可以直接调用这个方法，保证过期时间的统一性
          return ()=>{
            return new Date().getTime()+60*60*1000  // 这里好像讲错了 。。 这样写是一小时不是一分钟
          }
        }

    }
}