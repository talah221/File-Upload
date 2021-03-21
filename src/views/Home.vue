<template>
  <div></div>
  <qaReports></qaReports>
</template>

<script>
import QaReports from "../components/qa-reports.vue";
// import QaReports from "@/components/inputs";
export default {
  components: {
    QaReports
  },
  mounted() {
    this.$store.dispatch("main/toggleMenuShow", true);
  }
};
</script>

<style></style>
