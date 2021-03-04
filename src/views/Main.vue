<template>
  <c-mobile-menu />
  <router-view />
</template>

<script>
import CMobileMenu from "../components/c-mobile-menu";
export default {
  name: "Main",
  components: {
    CMobileMenu
  }
};
</script>

<style scoped></style>
