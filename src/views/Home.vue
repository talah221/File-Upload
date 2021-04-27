<template>
  <div></div>
  <ImageEditor @saveImage="saveImage" />
</template>

<script>
import ImageEditor from "@/components/ImageEditor.vue";
export default {
  components: {
    ImageEditor
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
    },
    saveImage(image) {
      this.saveTest(image);
      // console.log("image return", image);
    },
    saveTest(image) {
      // let image =
      // "data:image/png;base64,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";
      // let image =
      //   "";
      console.log(image);

      // uploadB64(253, 1, 1, 7, "image-markup (6).png", image)
      //   .then(result => {
      //     // result = JSON.parse(result);
      //     console.log("uploadB64-result", result);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    }
  }
};
</script>

<style></style>
