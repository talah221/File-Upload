<template>
  <div></div>

  <!-- <image-editor></image-editor> -->
</template>

<script>
export default {
  name: "Home",
  components: {
    // Carousel,
    // qualityControlDetails
    // Button
  },
  mounted() {
    this.$store.dispatch("main/toggleMenuShow", true);
    this.$store.commit("main/setAppHeader", "");
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
