<template>
  <qaReports
    v-if="show"
    :filters="filter"
    @showData="showData($event)"
  ></qaReports>
  <Button label="הצג " @click="show = !show" />
  <div>{{ filter }}</div>
  <!-- <carousel :items="caruselItems"></carousel> -->
</template>

<script>
// import Carousel from "../components/Carousel.vue";
// import QaReports from "@/components/qa-reports";
// import QaReports from "@/components/inputs";
import QaReports from "@/components/qa-reports-filters";
import Button from "primevue/button";
export default {
  components: {
    // Carousel,
    QaReports,
    Button
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
