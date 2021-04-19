<template>
  <div
    class="layout-rtl "
    :class="{ mainApp: isLoggedIn === true && isDesktop }"
  >
    <Login
      v-if="isLoggedIn === false"
      :allowAutoLogin="true"
      :logoImgSrc="logoImgSrc"
      :compName="compName"
      :compGUID="compGUID"
      loginHeader="כניסה רם קונטרול"
    />
    <Main v-if="isLoggedIn" />
    <!-- <Main v-if="isLoggedIn" :logoImgSrc="logoImgSrc" :compName="compName" /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Login from "./components/Login";
import Main from "./views/Main";
import screen from "@/scripts/screen.js";

export default {
  components: {
    Login,
    Main
  },
  data() {
    return {
      // logoImgSrc: "./assets/img/Logo.png",
      logoImgSrc: "/assets/logo-apoint.png",
      // logoImgSrc: "/assets/img/logo-small.png",
      compName: "ram aderet"
    };
  },
  mounted() {
    // console.log("locale", this.$primevue);

    this.$cookie.config({
      expire: "30d",
      path: "/",
      domain: "",
      secure:
        window.location.host.substring(0, 9) === "localhost" ? false : true, //for debugging
      sameSite: "Lax"
    });

    // this.$cookie.getCookie("")
    //DEV URL: http://localhost:8080/?compGUID=79D4854D-F78C-4940-87BC-834CCB96ED8C
    // const search = queryString.parse(window.location.search);
    // if (search.compGUID) {
    setTimeout(() => {
      this.$store.commit(
        "api/setCompGuid",
        "79D4854D-F78C-4940-87BC-834CCB96ED8C"
      ); //DEV
    }, 1000);

    //   this.$cookie.setCookie("compGuid", search.compGUID);
    // } else {
    //   let cookieCompGuid = this.$cookie.getCookie("compGuid");
    //   if (cookieCompGuid) this.$store.commit("api/setCompGuid", cookieCompGuid);
    // }
  },
  computed: {
    ...mapGetters("api", ["isLoggedIn"]),
    ...mapState({
      compID: state => state.api.compID,
      compGUID: state => state.api.compGUID
    }),
    isDesktop: () => screen.isDesktop()
  }
};
</script>
<style>
.mainApp {
  margin-right: 20rem;
}
@media screen and (min-width: 896px) {
  .single_form .field {
    width: 30%;
  }
}
@media screen and (max-width: 896px) {
  .single_form .field {
    width: 49%;
  }
}
@media screen and (max-width: 600px) {
  .single_form .field {
    width: 95%;
  }
}
.single_form {
  display: flex;
  flex-wrap: wrap;
}
.single_form .field {
  margin-left: auto !important;
  margin-right: auto !important;
}
.single_form .field label {
  width: 25%;
}
.single_form .field > div {
  width: 74%;
}
.single_form_buttons {
  display: flex;
  flex-wrap: wrap;
}
.single_form button {
  margin-left: auto !important;
  margin-right: auto !important;
}
.p-dialog {
  width: 90vh;
  height: 90vh;
}
.p-dialog-content {
  height: 90vh;
}
.chipFilters {
  display: flex;
  flex-wrap: wrap;
}
.chipFilters > div {
  border: 1px black solid;
}
</style>
