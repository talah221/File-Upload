<template>
  <c-mobile-menu />
  <router-view />
  <!-- <div class="layout-rtl main-app">
    <Login
      v-if="isLoggedIn === false"
      :allowAutoLogin="true"
      :logoImgSrc="logoImgSrc"
      :compName="compName"
      :compGUID="compGUID"
      loginHeader="כניסה רם קונטרול"
    />
    <Main v-if="isLoggedIn" :logoImgSrc="logoImgSrc" :compName="compName" />
  </div> -->
</template>

<script>
import CMobileMenu from "./components/c-mobile-menu";

// import { mapState, mapGetters } from "vuex";
// import Login from "./components/Login";
// import Main from "./views/Main";

export default {
  components: {
    CMobileMenu
    //   Login,
    //   Main
  }
  // ,
  // data() {
  //   return {
  //     logoImgSrc: "assets/Logo.png",
  //     compName: "ram aderet"
  //   };
  // },
  // mounted() {
  //   // console.log("locale", this.$primevue);

  //   this.$cookie.config({
  //     expire: "30d",
  //     path: "/",
  //     domain: "",
  //     secure:
  //       window.location.host.substring(0, 9) === "localhost" ? false : true, //for debugging
  //     sameSite: "Lax"
  //   });

  //   // this.$cookie.getCookie("")
  //   //DEV URL: http://localhost:8080/?compGUID=79D4854D-F78C-4940-87BC-834CCB96ED8C
  //   // const search = queryString.parse(window.location.search);
  //   // if (search.compGUID) {
  //   setTimeout(() => {
  //     this.$store.commit(
  //       "api/setCompGuid",
  //       "79D4854D-F78C-4940-87BC-834CCB96ED8C"
  //     ); //DEV
  //   }, 1000);

  //   //   this.$cookie.setCookie("compGuid", search.compGUID);
  //   // } else {
  //   //   let cookieCompGuid = this.$cookie.getCookie("compGuid");
  //   //   if (cookieCompGuid) this.$store.commit("api/setCompGuid", cookieCompGuid);
  //   // }
  // },
  // computed: {
  //   ...mapGetters("api", ["isLoggedIn"]),
  //   ...mapState({
  //     compID: state => state.api.compID,
  //     compGUID: state => state.api.compGUID
  //   })
  // }
};
</script>
<style>
/* .main-app {
  font-size: 15px;
} */
</style>
