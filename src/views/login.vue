<template>
  <div class="login">
    <!-- <div class="windmill"></div> -->
    <!-- <div class="box"> -->

    <div class="login_box">
      <!-- <div> -->
      <!-- <img src="../assets/img/云上田野logo1.png" alt> -->
      <div class="img_box">
        <!-- <img src="../assets/img/video_logo.png" alt> -->
        <img src="../../public/img/video_logo.png" alt>
      </div>

      <!-- </div> -->
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="username">
          <i-input
            class="login_input"
            type="text"
            v-model="formInline.username"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem prop="password">
          <i-input
            class="login_input"
            type="password"
            v-model="formInline.password"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" class="sub_mit" :loading="loading" @click="handleSubmit">Signin</Button>
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
        username: "",
        password: ""
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
          }
          // {
          //   type: "string",
          //   min: 6,
          //   message: "The password length cannot be less than 6 bits",
          //   trigger: "blur"
          // }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.formInline.validate(async val => {
        if (val) {
          this.loading = true;
          var obj = {
            username: this.formInline.username,
            password: this.$md5(this.formInline.password)
          };
          let { data: res } = await this.$http.post(
            "/user/login",
            Qs.stringify(obj)
          );
          console.log(res);

          if (res.status != 0) {
            this.loading = false;
            this.$Message.error("用户名或密码错误");
            return;
          }
          window.sessionStorage.setItem("token", res.token);
          window.sessionStorage.setItem("user_info", JSON.stringify(res.data));
          this.$Message.success({
            content: `欢迎 ${res.data.username} 登录云上田野智能农业管理平台`,
            duration: 5
          });
          this.loading = false;
          this.$router.push("/main");
          // console.log(res);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sub_mit {
  background-color: #019799;
  &:hover {
    background-color: #23bcbeda;
  }
}
// .windmill {
//   position: absolute;

//   right: 20px;
//   bottom: 20px;
//   width: 250px;
//   height: 250px;
//   background-color: pink;
// }

.img_box {
  width: 40%;
  display: flex;
  position: relative;
  // align-items: center;
  // justify-content: space-between;
}

.login {
  // display: flex;
  height: 100%;
  width: 100%;
  // background-image: url(../assets/img/login_bg.jpg);
  // background-image: url(../assets/img/login_bg1.png);
  background-image: url(../assets/img/login_bg2.jpg);
  background-size: 100% 125%;
  .box {
    display: flex;
  }
  .login_box {
    position: absolute;
    display: flex;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 250px;
    width: 550px;
    border-radius: 5px;
    // background-color: #fff;
    // background-image: linear-gradient(360deg, #019799 10%, #34a5f5 84%);
    // border: 1px solid #fff;
    box-shadow: 0px 0px 15px 5px inset #019799;
    transition: all 0.5s;
    &:hover {
      box-shadow: 0px 0px 18px 5px inset #2ed2d4f8;
    }
    img {
      // width: 100%;
      // height: 100%;
      // flex: 20%;
      // width: 38%;
      position: absolute;
      top: 15%;
      left: 22%;
      width: 115px;
      height: 130px;
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
