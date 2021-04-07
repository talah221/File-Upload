<template>
  <c-carousel
    :numScroll="1"
    :numVisible="1"
    :value="items"
    :autoplayInterval="3000"
    :circular="true"
    class="effect--shadow"
  >
    <template #item="slotProps">
      <img :src="slotProps.data" :alt="slotProps.data" class="thumbnail" />
    </template>
  </c-carousel>
</template>

<script>
import CCarousel from "primevue/carousel";

export default {
  components: {
    CCarousel
  },
  props: { items: [] }
};
</script>

<style lang="scss">
@import "../assets/scss/mixins";

.item {
  max-width: 1140px;
  padding-top: 0;

  @include screen("lg") {
    padding-top: 45px;
  }

  ::v-deep(.p-carousel-prev),
  ::v-deep(.p-carousel-next) {
    display: none;
  }
}

.thumbnail {
  width: 100%;
  height: auto;
}

.p-carousel .p-carousel-indicators .p-carousel-indicator button {
  background-color: transparent;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 50%;
}
.p-carousel .p-carousel-indicators {
  padding: 0;
}
.p-carousel .p-carousel-indicators .p-carousel-indicator {
  margin: 0 3px;
}
</style>
