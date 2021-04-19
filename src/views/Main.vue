<template>
  <c-header></c-header>
  <c-mobile-menu />
  <ProgressSpinner v-if="displaySpinner" class="spinner" />
  <BlockUI :blocked="displaySpinner" :fullScreen="true"> </BlockUI>
  <router-view />
  <!-- <About /> -->
</template>

<script>
// import About from "./About";
import CMobileMenu from "../components/c-mobile-menu";
import CHeader from "../components/c-header";
import ProgressSpinner from "primevue/progressspinner";
import { mapState } from "vuex";
import BlockUI from "primevue/blockui";

export default {
  name: "Main",
  components: {
    CMobileMenu,
    CHeader,
    ProgressSpinner,
    BlockUI

    // About
  },
  computed: {
    ...mapState({ displaySpinner: state => state.main.displaySpinner })
  }
};
</script>

<style scoped>
.spinner {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
