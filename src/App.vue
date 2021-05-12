<template>
  <!-- {{ displaySpinner }} -->

  <div class="block" v-show="displaySpinner">
    <ProgressSpinner v-if="displaySpinner" class="vueSpinner" />
  </div>
  <div
    class="layout-rtl "
    :class="{ mainApp: isLoggedIn === true && isDesktop }"
  >
    <Main v-if="isLoggedIn" />
    <Login
      v-else
      :allowAutoLogin="true"
      :logoImgSrc="logoImgSrc"
      :compName="compName"
      :compGUID="compGUID"
      loginHeader="כניסה רם קונטרול"
    />
    <!-- <Main v-if="isLoggedIn" :logoImgSrc="logoImgSrc" :compName="compName" /> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Login from "./components/Login";
import Main from "./views/Main";
import screen from "@/scripts/screen.js";
import ProgressSpinner from "primevue/progressspinner";

export default {
  components: {
    Login,
    Main,
    ProgressSpinner
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
    window.onbeforeunload = function() {
      return "Your work will be lost.";
    };
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
      compGUID: state => state.api.compGUID,
      displaySpinner: state => state.main.displaySpinner
    }),
    isDesktop: () => screen.isDesktop()
  }
};
</script>
<style>
.vueSpinner {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-top: 40vh !important;
}
.block {
  width: 100vw;
  height: 100vh;
  background-color: #f4f4f4;
  z-index: 9000;
  position: fixed;
}
.mainApp {
  margin-right: 20rem;
}
.qc-button {
  height: 52px;
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
  max-width: 950px;
  margin: auto;
  width: 99%;
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
.single_form .field > div .p-inputwrapper,
.single_form .field > div .p-inputwrapper input {
  height: 45px;
  width: 100%;
}
.single_form .field > div .p-buttonset .p-button {
  height: 45px;
}
.single_form .field > div .p-buttonset .p-button:last-of-type {
  width: 35%;
}
.single_form .field > div .p-buttonset .p-button:first-of-type {
  width: 65%;
}
.single_form_buttons {
  display: flex;
}
.p-dialog {
  width: 35%;
}

@media (max-width: 600px) {
  .p-dialog {
    width: 85%;
    /* min-height: 60vh; */
  }
}

.p-dialog-content {
  min-height: 350px;
}
.chipFilters {
  display: flex;
  flex-wrap: wrap;
}
.chipFilters > div {
  border: 1px solid #bfbfbf;
  background-color: #f2f2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  margin-bottom: 3px;
  margin-right: 3px;
  max-width: 47vw;
}

.chipFilters > div > div {
  border-left: 1px solid;
  padding-left: 5px;
  margin-left: 5px;
}
.boldFont {
  font-weight: bold;
}
.p-multiselect.p-multiselect-chip .p-multiselect-token {
  border: 1px solid #bfbfbf;
  background-color: #f2f2f2;
  color: #000;
  padding: 0.25rem 0.5rem;
  margin-left: 0.5rem;
  border-radius: 3px;
}
.p-multiselect-token-label {
  border-left: 1px solid;
  padding-left: 5px;
}
.pi-folder-open {
  font-size: 17px;
}
.p-button.p-button-icon-only {
  width: 45px;
}
.p-disabled .p-dropdown-clear-icon,
.p-disabled .p-dropdown-trigger,
.p-disabled.p-datepicker-trigger {
  display: none;
}
.buttonIcon .pi {
  font-size: 1.5rem;
}
</style>
