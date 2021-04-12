<template>
  <!-- <qualityControlDetails ></qualityControlDetails> -->
  <!-- <qaReports
    v-if="show"
    :filters="filter"
    @showData="showData($event)"
  ></qaReports>
  <Button label="הצג " @click="show = !show" />
  <div>{{ filter }}</div> -->
  <!-- <carousel :items="caruselItems"></carousel> -->
  <div></div>
</template>

<script>
// import Carousel from "../components/Carousel.vue";
// import QaReports from "@/components/qa-reports";
// import QaReports from "@/components/inputs";
// import qualityControlDetails from "@/components/qualityControlDetails";
// import Button from "primevue/button";
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
