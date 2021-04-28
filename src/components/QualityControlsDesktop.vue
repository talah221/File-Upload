<template>
  <section class="main-container"></section>
  <h1>Test</h1>
</template>

<script>
export default {
  props: {
    qualityControls: {
      type: Array,
      required: true,
    },
  },

  mounted(){
      console.log("Mounted");
      console.log(this.qualityControls);
  }
};
</script>

<style lang="scss" scoped>
</style>