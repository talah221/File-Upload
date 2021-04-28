<template>
  <div></div>

  <!-- <image-editor></image-editor> -->
</template>

<script>
export default {
  components: {
    // Carousel,
    // qualityControlDetails
    // Button
  },
  mounted() {
    this.$store.dispatch("main/toggleMenuShow", true);
  },
  data() {
    return {
      visible: true
    };
  },
  methods: {}
};
</script>

<style></style>
