<template>
  <div class="login-container">
    <div class="login-form">
      <div class="title-container">
        <img :src="require('@/assets/image/logo.png')" />
      </div>
      <el-form
        autocomplete="off"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            maxlength="20"
            placeholder="用户名"
            autocomplete="new-password"
            clearable
          >
            <template slot="prepend">
              <img :src="require('@/assets/image/icon-login1.png')" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            maxlength="20"
            placeholder="登录密码"
            autocomplete="new-password"
            clearable
          >
            <template slot="prepend">
              <img :src="require('@/assets/image/icon-login2.png')" />
            </template>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          style="width: 100%; margin-bottom: 30px; padding: 15px"
          :loading="loading"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
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
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
    };
  },
  created() {},
  methods: {
    handleLoginBlur(id, val) {
      this.disabled = !this.disabled;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.username == "") {
            this.$message({
              type: "error",
              message: "请输入用户名",
            });
            return false;
          }
          if (this.loginForm.password == "") {
            this.$message({
              type: "error",
              message: "请输入密码",
            });
            return false;
          }
          this.loading = true;
          this.$store
            .dispatch("LoginSystem", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
              return false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: #4887ff url("~@/assets/image/icon-login-bg.jpg") no-repeat center
    center;
}
.mod-new-reg-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.login-container .login-form {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  padding: 35px 50px 30px 50px;
  margin: 200px auto;
  background: #fff;
  border-radius: 12px;
}
.login-container .title-container {
  text-align: center;
  margin-bottom: 35px;
}
.login-container .title-container img {
  margin: 0 auto;
  width: 88px;
}
.login-container .el-form-item {
  margin-bottom: 30px;
}
.login-container .el-input-group {
  border: 1px #4887fc solid;
  border-radius: 3px;
}
.login-container .el-input-group__prepend {
  border: none;
  background: #fff;
  padding: 0 5px;
}
.login-container .el-input-group__prepend img {
  width: 32px;
}
.login-container .is-error .el-input-group {
  border: 1px #f56c6c solid;
}
.login-container .el-input__inner {
  background: #fff !important;
  border: 6px;
  padding: 0 5px 0 1px;
  color: #4887fc;
  height: 40px;
  border: none;
}
.login-container input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset !important;
}
.login-container .el-form-item__error {
  padding-top: 5px;
}
</style>