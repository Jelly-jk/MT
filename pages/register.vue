<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>

    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register"
            >同意以下协议并注册</el-button
          >
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank"
            >《美团网用户协议》</a
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  layout: "blank",
  data() {
    return {
      statusMsg: '',
      error:'',
      ruleForm:{
        name:'',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      rules:{
        name:[{
          required:true, type:'string',message:'请输入昵称', tigger:'blur'
        }],
        email:[{
          required:true, type:'email',message:'请输入邮箱', tigger:'blur'
        }],
        pwd:[{
          required:true, message:'请输入密码', tigger:'blur'
        }],
        cpwd:[{
          required:true, message:'请输重复输入密码', tigger:'blur'
        },{
          validator:(rule,value,callback)=>{
            if (value==='') {
              callback(new Error('请再次输入密码'))
            }else if(value !== this.ruleForm.pwd){
              callback(new Error('两次输入的密码不一致'))
            }else{
              callback()
            }
          }, tigger:'bulr'
        }]
      }
    }
  },
  methods: {
    sendMsg: function () {
              const self = this;
              let namePass
              let emailPass
              if (self.timerid) {
                return false
              }
              this.$refs['ruleForm'].validateField('name', (valid) => {
                // 这种$refs['ruleForm']写法完全等价于$refs.ruleForm,如果ruleForm是变量那么只能采用中括号的写法，并且不加引号
                namePass = valid // 为空才代表正确，有值代表错误，和validate方法相反
              })
              self.statusMsg = ''
              if (namePass) {
                return false
              }
              this.$refs['ruleForm'].validateField('email', (valid) => {
                emailPass = valid
              })
              if (!namePass && !emailPass) {
                self.$axios.post('/users/verify', {
                  //设置中文编码
                  username: encodeURIComponent(self.ruleForm.name),
                  email: self.ruleForm.email
                }).then(({
                  status,
                  data
                }) => {
                  if (status === 200 && data && data.code === 0) {
                    let count = 60;
                    self.statusMsg = `验证码已发送,剩余${count--}秒`
                    self.timerid = setInterval(function () {
                      self.statusMsg = `验证码已发送,剩余${count--}秒`
                      if (count === 0) {
                        clearInterval(self.timerid)
                        self.timerid = null
                        self.statusMsg = ''
                      }
                    }, 1000)
                  } else {
                    self.statusMsg = data.msg  // data.msg返回的是：验证码已发送
                  }
                })
              }
            },
    register: function() {
      let self = this;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          self.$axios.post('/users/signup', {
            //设置中文编码
            username: window.encodeURIComponent(self.ruleForm.name),
            //使用MD5进行密码加密，MD5处理之后会有很多值，并不是hash值，于是需要toString()函数
            // 需要引用crypt-js这个包
            password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
            email: self.ruleForm.email,
            code: self.ruleForm.code
          }).then(({
            status,
            data
          }) => {
            if (status === 200) {
              if (data && data.code === 0) {  // 后台定义的只有code等于0的时候才是操作成功
                //强制跳转到登录页面
                location.href = '/login'
              } else {
                self.error = data.msg
              }
            } else {
              self.error = `服务器出错，错误码:${status}`
            }
            //定时清空error
            setTimeout(function () {
              self.error = ''
            }, 1500)
          })
        }
      })
    }
  },
};
</script>

<style lang="scss">
  @import "@/assets/css/register/index.scss";
</style>
