<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，<span class="username">{{ user }}</span>
      [<nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link to="/login" class="login">立即登录</nuxt-link>
      <nuxt-link to="register" class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ""
    };
  },
  async mounted() { // 因为后端的返回值是user和email，这里只用到了user，所以解构出user，这个status是
                    // 返回结果中外层的状态码，这里是两层的解构,返回结果形式：{status:..，data:{...}}
    const {status, data:{user}}= await this.$axios.get('/users/getUser')
    if (status ===200) {
      this.user = user
    }
  }
};
</script>

<style></style>
