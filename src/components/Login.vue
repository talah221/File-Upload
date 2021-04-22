<template>
  <div class="p-d-flex p-ai-center p-jc-center" dir="rtl">
    <transition name="fade">
      <div>
        <!-- <img :src="logoImgSrc" :alt="compName" class="logo-style" /> -->
        <div class="p-d-flex p-flex-column p-ai-center p-jc-center">
          <img src="@/assets/img/logo.png" :alt="compName" class="logo-style" />
        </div>
        <h1>{{ loginHeader }}</h1>
        <div class="p-field p-grid">
          <label class="p-col-fixed lbl-style" for="userName">משתמש</label>
          <div class="p-col">
            <InputText type="text" name="userName" v-model.trim="userName" />
          </div>
        </div>
        <div class="p-field p-grid">
          <label class="p-col-fixed lbl-style" for="userName">סיסמה</label>
          <div class="p-col">
            <Password
              v-model.lazy="password"
              @keypress.enter="login"
              :feedback="false"
            />
          </div>
        </div>
        <div class="p-field-checkbox p-grid">
          <label class="p-col-fixed lbl-style" for="rememberMe"
            >זכור אותי</label
          >
          <div class="p-col">
            <CheckBox v-model="rememberMe" :binary="true" />
          </div>
        </div>
        <Button class="p-field" @click="login">כניסה</Button>
      </div>
    </transition>
  </div>
  <Toast position="bottom-right" />
</template>

<script>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import CheckBox from "primevue/checkbox";
import { encrypt, decrypt, apiGetSessionToken } from "../services/APointAPI";
// import { mapState } from "vuex"
//todo יש לשים ספינר בעת ביצוע לוגין(המטרה - למנוע מהמשתמש לראות את מסך הלוגין בעת ריענון הדף)
export default {
  name: "Login",
  props: {
    allowAutoLogin: {
      type: Boolean,
      default: false
    },
    compName: {
      type: String,
      default: "A Point Systems"
    },
    loginHeader: {
      type: String,
      default: "כניסה למערכת "
    },
    logoImgSrc: {
      type: String,
      default: "/assets/img/Logo.jpg"
    },
    compGUID: {
      type: String,
      require: true
    }
  },
  components: {
    InputText,
    Button,
    CheckBox,
    Password
  },
  // emits: ["loginOK"],
  data() {
    return {
      userName: "",
      password: "",
      rememberMe: false //this.$cookie.getCookie("main-user-remember")
    };
  },
  methods: {
    autoLogin() {
      this.$store.commit("main/setSpinner", true);
      this.rememberMe = this.$cookie.getCookie("main-user-remember") === "true";
      // console.log("main-user-remember", this.rememberMe, this.compGUID);
      // console.log("compGUID", this.compGUID);
      if (this.rememberMe && this.compGUID) {
        let userObject = decrypt(
          this.$cookie.getCookie("main-user-object"),
          this.compGUID
        );
        this.userName = userObject.userName;
        // console.log("userObject", userObject);
        //TODO: test auto login feature
        if (this.allowAutoLogin) {
          this.password = userObject.pswd;
          if (this.password !== "") {
            console.log("auto login");
            this.login();
          } else {
            this.$store.commit("main/setSpinner", false);
          }
        } else {
          this.$store.commit("main/setSpinner", false);
        }
      } else if (!this.rememberMe) {
        this.$store.commit("main/setSpinner", false);
      }
    },
    async validateLogin() {
      let userID = await apiGetSessionToken(
        this.compGUID,
        this.userName,
        this.password
      );
      // let userID = await apiGetSessionToken(
      //   this.compGUID,
      //   this.userName,
      //   this.password
      // );

      return userID !== 0;
    },

    async login() {
      if (await this.validateLogin()) {
        if (this.rememberMe) {
          this.$cookie.setCookie(
            "main-user-object",
            encrypt(
              {
                userName: this.userName,
                pswd: this.allowAutoLogin ? this.password : ""
              },
              this.compGUID
            )
          );
        }

        this.$cookie.setCookie("main-user-remember", this.rememberMe);
        // this.$emit("loginOK");
        this.$store.commit("main/setSpinner", false);
      } else {
        //login failed
        // console.log('login fail')
        this.$toast.add({
          severity: "error",
          summary: "כשל כניסה",
          detail: "משתמש או סיסמה לא נכונים",
          life: 3000,
          closable: true
        });
        this.$store.commit("main/setSpinner", false);
      }
    }
  },
  watch: {
    compGUID() {
      // console.log("watch compGUID", newValue, oldValue);
      this.autoLogin();
    }
  },
  // computed: {
  //   ...mapState({
  //     compGUID: state => state.api.compGUID
  //   })

  // },
  mounted() {
    this.autoLogin();
  }
};
</script>

<style>
.lbl-style {
  min-width: 60px;
  max-width: 80px;
}
.logo-style {
  max-width: 240px;
  height: auto;
}
/* animation effect, transition="bounce" */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

/* fade effect, transition="fade" */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
