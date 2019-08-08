<template>
  <div class="login">
    <!-- <div class="box"> -->

    <div class="login_box">
      <!-- <div> -->
      <img src="../assets/img/云上田野logo1.png" alt>
      <!-- </div> -->
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="username">
          <i-input type="text" v-model="formInline.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem prop="password">
          <i-input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">Signin</Button>
        </FormItem>
      </Form>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      formInline: {
        username: "数字茶园",
        password: "123456"
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.formInline.validate(async val => {
        if (val) {
          var obj = {
            username: this.formInline.username,
            password: this.$md5(this.formInline.password)
          };
          let { data: res } = await this.$http.post(
            "/user/login",
            Qs.stringify(obj)
          );
          if (res.status != 0) return this.$Message.error("用户名或密码错误");
          window.sessionStorage.setItem("token", res.token);
          window.sessionStorage.setItem("user_info", JSON.stringify(res.data));
          this.$router.push("/Home");
          // console.log(res);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  // display: flex;
  height: 100%;
  width: 100%;
  background-image: url(../assets/img/login_bg.jpg);
  background-size: 100% 100%;
  .box {
    display: flex;
  }
  .login_box {
    position: absolute;
    display: flex;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 300px;
    width: 550px;
    // background-color: #fff;
    background-image: linear-gradient(180deg, #019799 10%, #194797 84%);
    img {
      // width: 100%;
      height: 100%;
      // flex: 20%;
      width: 38%;
    }
    .ivu-form {
      padding-top: 50px;
      padding-left: 10px;
      flex: 70%;

      display: flex;
      flex-direction: column;
      // align-items: center;
      .ivu-btn {
        width: 100%;
      }
    }
  }
}
</style>
