<template>
  <div class="container">
    <img src="../../assets/01-4.jpg" class="image" />
    <mu-form ref="form" :model="validateForm" class="mu-demo-form">
      <mu-form-item label="username" help-text="请填写用户名" prop="username" :rules="usernameRules">
        <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="password" help-text="请填写密码" prop="password" :rules="passwordRules">
        <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
      </mu-form-item>
      <div>
        <mu-auto-complete label="输入右侧图片验证码" v-model="verifyCode"></mu-auto-complete>

        <img ref="image" @click.prevent="refresh" />
      </div>
      <mu-form-item prop="isAgree" :rules="argeeRules">
        <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
      </mu-form-item>
      <mu-form-item>
        <mu-button color="primary" @click="submit()">提交</mu-button>
        <mu-button @click="clear">重置</mu-button>
      </mu-form-item>
    </mu-form>
    <mu-dialog title="Wellcome" width="360" :open.sync="openSimple">
      <div>
        <span>请选择你的角色</span>
        <p v-for="(item, index) in roles" :key="index" @click="goIndex(item.roleId)">
          <span>{{ item.roleName }}</span>
        </p>
      </div>
      <mu-button slot="actions" flat color="primary">Close</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名' },
        { validate: (val) => val.length >= 3, message: '用户名长度大于3' }
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码' },
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10' }
      ],
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议' }],
      validateForm: {
        username: '',
        password: '',
        isAgree: false
      },
      verifyCode: '',
      vailiable: true,
      openSimple: false,
      roles: []
    }
  },
  created() {
    this.axios.get('http://localhost:8080/captcha?name=' + this.validateForm.username, { responseType: 'blob' }).then((res) => {
      console.log(res.headers)
      let img = this.$refs.image
      let url = window.URL.createObjectURL(res.data)
      img.src = url
    })
  },
  methods: {
    //获取验证码
    getVerify() {
      this.vailiable = false
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/captcha',
        // 2、将请求数据转换为form-data格式
        params: {
          name: this.validateForm.username
        },
        // 3、设置请求头Content-Type
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob'
      }).then((res) => {
        let img = this.$refs.image
        let url = window.URL.createObjectURL(res.data)
        img.src = url
      })
    },
    //提交登录信息
    submit() {
      // eslint-disable-next-line no-unused-vars
      this.$refs.form.validate().then((result) => {
        //模拟后端接口数据
        this.axios({
          method: 'post',
          url: 'http://localhost:8080/sysAdmin/login',
          data: {
            name: this.validateForm.username,
            password: this.validateForm.password,
            verifyCode: this.verifyCode
          }
        }).then((res) => {
          if (res.data.code === 1) {
            //存token
            localStorage.setItem('token', res.data.data.token)
            this.$store.commit('setToken', res.data.data.token)
            let admin = {
              id: res.data.data.admin.id,
              name: res.data.data.admin.name,
              roles: res.data.data.admin.roles,
              avatar: res.data.data.admin.avatar
            }
            //存admin
            localStorage.setItem('admin', JSON.stringify(admin))
            this.$store.commit('setAdmin', JSON.stringify(admin))
            this.roles = res.data.data.admin.roles
            this.roles = res.data.data.admin.roles
            const roleId = res.data.data.admin.roles[0].roleId

            alert('登录成功')
            if (this.roles.length > 1) {
              this.openSimple = true
            } else {
              this.$router.push({
                path: '/',
                query: {
                  roleId: roleId
                }
              })
            }
          } else {
            //登录失败
            alert(res.data.msg)
            //清空验证码文本框
            this.verifyCode = ''
          }
        })
        // localStorage.setItem('user', JSON.stringify(user))
        // localStorage.setItem('menuList', JSON.stringify(this.menuList))

        // this.$store.commit('setUser', user)
        // this.$store.commit('setMenuList', this.menuList)
      })
    },

    /* //获取用户角色
    getRole(token) {

      this.axios({
        method: 'get',
        url: 'http://localhost:8080/sysRole/',
        params: {
          roleId: roleId
        },
        // 3、设置请求头Content-Type
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: token
        }
      }).then((res) => {})
    },
 */
    //进入主页
    goIndex(roleId) {
      alert(roleId)
      this.$router.push({
        path: '/',
        query: {
          roleId: roleId
        }
      })
    },
    refresh() {
      //点击验证码图片，重新请求，刷新
      this.axios.get('http://localhost:8080/captcha?name=' + this.validateForm.username, { responseType: 'blob' }).then((res) => {
        let img = this.$refs.image
        let url = window.URL.createObjectURL(res.data)
        img.src = url
      })
    },
    clear() {
      this.$refs.form.clear()
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }
    }
  }
}
</script>
<style>
.mu-demo-form {
  max-width: 500px;
  padding: 20px 20px;
  margin-left: 220px;
  margin-top: 100px;
  background-color: rgb(226, 228, 228);
  box-shadow: 1px 1px 5px 2px #eee;
}

.container {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}
.image {
  width: 500px;
  height: 705px;
  margin-left: -300px;
}
</style>
