<template>
  <div class=""/>
</template>

<script>
export default {
  layout: 'blank',
  middleware: async (ctx) => {
    let {status,data} = await ctx.$axios.get('/users/exit')
    if (status ===200&&data&&data.code===0) {
      window.location.href = '/'
    }
  }
  // 原理就是让点击这个退出按钮，去到达exit这个页面，然后到达这个页面后自动执行这个中间件，自动执行里面的
  // 请求接口动作，注意前端是通过地址后面的路由来跳转页面的，这种跳转路由的方式体现在pages文件夹中，nuxt
  // 会自动将里面的文件转换成路由的关系，pages的根目录就相当于当前注意的根目录，pages里面的文件嵌套关系
  // 就是路由的嵌套关系

}
</script>
