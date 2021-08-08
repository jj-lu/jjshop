<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <el-form label-width="0px" 
      class="login_form" 
      :model="loginForm" 
      :rules="loginRules" 
      ref="loginFromRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user"  v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>

        <el-row class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
        loginForm: {
            username: 'admin',
            password: '123456'
        },
        loginRules: {
            username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入用户密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ]
        }
    };
  },
  methods: {
      loginFormReset(){
          this.$refs.loginFromRef.resetFields();
      },
      login(){
          this.$refs.loginFromRef.validate(valid => {
              // console.log(valid);
              if(valid){
                this.$http.post('/login',this.loginForm).then(res => {
                  console.log(res);
                  if(res.data.meta.status == 200){
                    // console.log('登录成功');
                    this.$message({
                      type:'success',
                      message: '登录成功'
                    })

                    // sessionStorage保存token
                    window.sessionStorage.setItem('token',res.data.data.token);

                    // 页面跳转 
                    this.$router.push('/home');
                  }else {
                    // console.log('登录失败');
                    this.$message({
                      type: 'error',
                      message: '登录失败'
                    })
                  }
                })
              }else{
                return
              }
          })
      }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  box-shadow: 0 0 10 #ddd;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  padding: 20px;
  left: 0;
  right: 0;
  bottom: 0;
  // margin-bottom: 0px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>