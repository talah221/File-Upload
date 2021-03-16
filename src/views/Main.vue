<template>
  <c-header></c-header>
  <c-mobile-menu />
  <router-view />
  <!-- <About /> -->
</template>

<script>
// import About from "./About";
import CMobileMenu from "../components/c-mobile-menu";
import CHeader from "../components/c-header";
export default {
  name: "Main",
  components: {
    CMobileMenu,
    CHeader
    // About
  }
};
</script>

<style scoped></style>
