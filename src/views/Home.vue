<template>
  <div></div>
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
      caruselItems: [
        require("../assets/img/items/item-detail.png"),
        require("../assets/img/items/item-detail.png"),
        require("../assets/img/items/item-detail.png"),
        require("../assets/img/items/item-detail.png"),
        require("../assets/img/items/item-detail.png")
      ],
      filter: {},
      show: false,
      displaySelectPlan: false
    };
  },
  methods: {
    showData(event) {
      this.filter = event;
    }
  }
};
</script>

<style></style>
