<template>
  <c-header class="c-header"></c-header>
  <c-mobile-menu />
  <div class="router-view">
    <router-view />
  </div>
  <Toast position="bottom-right" :baseZIndex="2000" />

  <!-- <About /> -->
</template>

<script>
//todo להוסיף כותרת שהתוכן שלה יהיה משתנה בסטור, ובעת טעינת קומפוננטה ישנו את הערך של המשתנה
// import About from "./About";
import CMobileMenu from "../components/c-mobile-menu";
import CHeader from "../components/c-header";

// import { mapState } from "vuex";

export default {
  name: "Main",
  components: {
    CMobileMenu,
    CHeader,

    // About
  },
  mounted() {
    this.$store.dispatch("qc/loadDdlData");
    this.$store.dispatch("qc/check");
  },
  computed: {
    // ...mapState({ displaySpinner: state => state.main.displaySpinner })
  },
};
</script>

<style scoped>
.c-header {
  position: fixed;
  width: 100%;
  margin-bottom: 10px;
  top: 0;
  box-shadow: 0px 1px 20px 0px rgb(103 103 103 / 75%);
}
.router-view {
  padding-top: 100px;
}
</style>
