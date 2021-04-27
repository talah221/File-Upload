<template>
  <c-header></c-header>
  <c-mobile-menu />

  <router-view />
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
    CHeader

    // About
  },
  mounted() {
    this.$store.dispatch("qc/loadDdlData");
    this.$store.dispatch("qc/check");
  },
  computed: {
    // ...mapState({ displaySpinner: state => state.main.displaySpinner })
  }
};
</script>

<style scoped></style>
