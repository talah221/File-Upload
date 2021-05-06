<template>
  <Galleria
    :value="images"
    v-model:activeIndex="activeIndex"
    :responsiveOptions="responsiveOptions"
    :numVisible="7"
    containerStyle="max-width: 850px"
    :circular="true"
    :fullScreen="true"
    :showItemNavigators="true"
    :showThumbnails="false"
    v-model:visible="displayBasic"
  >
    <template #item="slotProps">
      <img
        :src="slotProps.item.itemImageSrc"
        :alt="slotProps.item.alt"
        style="width: 100%; display: block;"
      />
    </template>
    <template #thumbnail="slotProps">
      <img
        :src="slotProps.item.thumbnailImageSrc"
        :alt="slotProps.item.alt"
        style="display: block;"
      />
    </template>
  </Galleria>

  <div v-if="images" class="p-grid" style="max-width: 400px;">
    <div v-for="(image, index) of images" class="p-col-3" :key="index">
      <img
        :src="image.thumbnailImageSrc"
        :alt="image.alt"
        style="cursor: pointer"
        @click="imageClick(index)"
      />
    </div>
  </div>
</template>

<script>
import Galleria from "primevue/galleria";
export default {
  components: {
    Galleria
  },
  props: {
    images: {
      type: Object,
      require: true
    },
    displayFullScreen: {
      type: Boolean,
      default: false
    }
  },
  emits: ["closeGalleria"],
  data() {
    return {
      activeIndex: 0,
      responsiveOptions: [
        {
          breakpoint: "1024px",
          numVisible: 5
        },
        {
          breakpoint: "768px",
          numVisible: 3
        },
        {
          breakpoint: "560px",
          numVisible: 1
        }
      ],
      responsiveOptions2: [
        {
          breakpoint: "1500px",
          numVisible: 5
        },
        {
          breakpoint: "1024px",
          numVisible: 3
        },
        {
          breakpoint: "768px",
          numVisible: 2
        },
        {
          breakpoint: "560px",
          numVisible: 1
        }
      ],

      displayBasic: false
    };
  },
  mounted() {
    if (this.displayFullScreen) this.imageClick(0);
  },

  methods: {
    imageClick(index) {
      this.activeIndex = index;
      this.displayBasic = true;
    }
  },
  watch: {
    displayBasic(newValue) {
      if (this.displayFullScreen && !newValue) this.$emit("closeGalleria");
    }
  }
};
</script>

<style scoped></style>
