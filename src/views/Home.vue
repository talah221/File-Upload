<template>
  <QCReporting :qc_id="25026" />
  <div></div>
</template>

<script>
import QCReporting from "@/components/QCReporting.vue";

export default {
  components: {
    QCReporting
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
      show: false
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
