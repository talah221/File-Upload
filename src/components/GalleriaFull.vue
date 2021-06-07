<template>
  <div style="direction: ltr" class="container">
    <Galleria
      :value="images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      :showThumbnails="true"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      v-model:visible="displayCustom"
      v-model:activeIndex="activeIndex"
      :showItemNavigatorsOnHover="true"
    >
      <template #item="slotProps">
        <img
          :src="getFullImageSrc(slotProps.item.itemImageSrc)"
          :alt="slotProps.item.alt"
        />
      </template>
      <template #thumbnail="slotProps">
        <img
          :src="getFullImageSrc(slotProps.item.thumbnailImageSrc)"
          :alt="slotProps.item.alt"
          style="display: block; height: 30px"
        />
      </template>
    </Galleria>
    <div v-if="images && !displayFullScreen" class="images-container">
      <img
        v-for="(image, index) of images"
        class="image-wrapper"
        :key="index"
        :src="getFullImageSrc(image.thumbnailImageSrc)"
        :alt="image.alt"
        style="cursor: pointer; border-radius: 5px"
        @click="imageClick(index)"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script>
import Galleria from "primevue/galleria";
import { mapState } from "vuex";
import { API_HOST } from "../services/APointAPI.js";
export default {
  components: {
    Galleria,
  },
  props: {
    images: {
      type: Object,
      require: true,
    },
    displayFullScreen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["closeGalleria"],
  data() {
    return {
      activeIndex: 1,

      responsiveOptions: [
        {
          breakpoint: "1500px",
          numVisible: 5,
        },
        {
          breakpoint: "1024px",
          numVisible: 4,
        },

        {
          breakpoint: "460px",
          numVisible: 2,
        },
        {
          breakpoint: "560px",
          numVisible: 3,
        },
      ],

      displayCustom: false,
    };
  },
  mounted() {
    if (this.displayFullScreen) this.imageClick(0);
  },

  methods: {
    imageClick(index) {
      this.activeIndex = index;
      this.displayCustom = true;
    },
    getFullImageSrc(src) {
      return (
        API_HOST +
        "/files/getImg?src=" +
        src +
        "&sessionToken=" +
        this.sessionToken
      );
    },
  },
  computed: {
    ...mapState({
      sessionToken: (state) => state.api.sessionToken,
    }),
  },
  watch: {
    displayCustom(newValue) {
      if (this.displayFullScreen && !newValue) this.$emit("closeGalleria");
    },
  },
};
</script>

<style lang="scss">
.container {
  .images-container {
    margin: 10px 0;
    display: flex;
    width: 100%;
    height: 250px;
    gap: 10px;

    overflow: auto;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
}
.p-galleria-item-container {
  img {
    height: 90vh;
    width: 95%;
    object-fit: contain;
  }
}
</style>
