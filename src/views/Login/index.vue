<template>
  <div class="login_body">
    <!-- 左边背景图 -->
    <div class="bg" />
    <!-- 右边登录框 -->
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!-- elementUI 提供的 一个表单结构 -->
      <!--
          el-form 自带表单校验 需要配置规则 单独校验
          :model="表单数据对象" :rules="规则对象"
          el-form-item prop="要校验的字段名
          el-input v-model=''
      -->
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="form.username" @change="checkRememberUsername"/>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="form.password" type="password" @change="checkRememberPassword"/>
        </el-form-item>

        <!--        <el-form-item-->
        <!--          label="验证码"-->
        <!--          prop="verifyCode"-->
        <!--        >-->
        <!--          <el-input />-->
        <!--        </el-form-item>-->

        <el-form-item prop="remember">
          <el-checkbox v-model="remember" @change="saveRememberState">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="login_btn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>

      <!-- <el-form ref="form2" :model="form2" :rules="rules2">-->
      <!-- <el-form-item-->
      <!--    label="用户名"-->
      <!--    prop="username2"-->
      <!--    >-->
      <!--          <el-input v-model="form2.username2" />-->
      <!--        </el-form-item>-->

      <!--        <el-form-item-->
      <!--          label="银行卡号"-->
      <!--          prop="cardId"-->
      <!--        >-->
      <!--          <el-input v-model="form2.cardId" />-->
      <!--        </el-form-item>-->

      <!--        <el-form-item-->
      <!--          label="密码"-->
      <!--          prop="password2"-->
      <!--        >-->
      <!--          <el-input v-model="form2.password2" />-->
      <!--        </el-form-item>-->

      <!--        <el-form-item>-->
      <!--          <el-button class="login_btn" type="primary" @click="login2">显示存款</el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
    </div>
  </div>
</template>

<script>

import { loginAPI } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      remember: false,
      form: {
        username: '',
        password: ''
      },
      // 提供规则
      rules: {
        // 非空校验 失去焦点时检查用户有没有填写 如果没有填写 提示用户
        // 字符数限制 失去焦点时检查长度 如果长度不符合 提示用户
        username: [
          { required: true, message: '用户名必须填写', trigger: 'blur' },
          { min: 5, max: 12, message: '用户名长度必须在 5 - 12 位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必须填写', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度必须在 6 - 12 位', trigger: 'blur' }
        ]
        // },
        // form2: {
        //   username2: '',
        //   cardId: '',
        //   password2: ''
        // },
        // rules2: {
        //   username2: [
        //     { required: true, message: '用户名必须填写', trigger: 'blur' }
        //   ],
        //   cardId: [
        //     { required: true, message: '银行卡号必须填写', trigger: 'blur' },
        //     { min: 16, max: 16, message: '银行卡号长度必须为 16 位', trigger: 'blur' }
        //   ],
        //   password2: [
        //     { required: true, message: '密码必须填写', trigger: 'blur' },
        //     { min: 6, message: '密码长度必须在 6 位以上', trigger: 'blur' }
        //   ]
      }
    }
  },
  // 生命周期函数 => 特定时机触发
  // mounted => 页面加载完成后触发
  mounted() {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    const remember = JSON.parse(localStorage.getItem('remember'))
    // const remember = localStorage.getItem('remember') === 'true'
    // const temp = localStorage.getItem('form')
    // if (temp) {
    //   this.form = JSON.parse(temp) // 不知道是否可用 需要验证
    //   this.form.username = JSON.parse(temp).username
    //   this.form.password = JSON.parse(temp).password
    //   this.remember = true
    // }
    if (!remember) {
      localStorage.removeItem('username')
      localStorage.removeItem('password')
    }
    this.form.username = remember ? username : ''
    this.form.password = remember ? password : ''
    this.remember = remember
  },
  methods: {
    // 登录
    login() {
      // console.log(this.form) // 拿到这个数据 可以调用 loginAPI 登陆
      // 登陆请求之前需要对整个表单进行整体校验
      // => 需要用到 el-form 提供的 validate 方法
      // => 需要先获取到 form 组件 通过 ref 获取
      // this.$refs.xx => 拿到组件 => 调用组件上的 validate 方法
      this.$refs.form.validate(
        ok => {
          // 整体校验通过后 进行登陆请求
          if (ok) {
            loginAPI(this.form).then(
              res => {
                console.log(res.data.token)
                // 如何调用仓库的 mutation 函数
                // this.$store.commit('模块名/mutation名', 参数) vuex 提供的一个属性 指向仓库本身
                // setToken(res.data.token) // 这不对
                this.$store.commit('user/setToken', res.data.token)
                // this.$router.push('/') 跳转页面 比如首页 vuex 提供的一个属性 指向路由实例
                this.$router.push('/')
                // this.$message elementUI 提供的一个属性 指向一个对象 身上有很多提示的方法
                this.$message.success('恭喜登陆成功')
                // this.$message.error('登陆失败')
                // console.log(this.remember)
                if (this.remember) {
                  this.saveUserInfo(
                    this.form.username,
                    this.form.password,
                    this.remember
                  )
                  // localStorage.setItem('form', JSON.stringify(this.form))
                } else {
                  localStorage.removeItem('username')
                  localStorage.removeItem('password')
                }
              }
            )
          } else {
            // 整体校验不通过 提示用户
            this.$message.error('请填写完整的登陆信息')
          }
        }
      )
      // // 进行登陆请求
      // loginAPI(this.form).then(
      //   res => console.log(res.data.token)
      // )
    },
    // login2() {
    //   this.$refs.form2.validate(
    //     ok => {
    //       if (ok) {
    //         console.log(this.form2)
    //       }
    //     }
    //   )
    // },
    // 前端本地存储
    // localStorage 永久存储
    // sessionStorage 关闭页面后就没了
    // cookie 永久/有效期内存储 比较灵活 但是容量小 一般适用于数据少
    // localStorage setItem getItem removeItem clear
    // JSON.stringify() JSON.parse()
    saveUserInfo(username, password, remember) {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      localStorage.setItem('remember', JSON.stringify(remember))
    },
    saveRememberState(remember) {
      localStorage.setItem('remember', JSON.stringify(remember))
      if (remember) {
        this.saveUserInfo(this.form.username, this.form.password, remember)
      }
    },
    checkRememberUsername(username) {
      if (this.remember) {
        localStorage.setItem('username', username)
      }
    },
    checkRememberPassword(password) {
      if (this.remember) {
        localStorage.setItem('password', password)
      }
    }
  }
}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat right top;
    //background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
