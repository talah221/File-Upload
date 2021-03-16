<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("main/toggleMenuShow", true);
  }
};
</script>

<style></style>
