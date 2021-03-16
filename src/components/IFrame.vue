<template>
  <iframe :src="src" name="iframe1"> </iframe>
</template>

<script>
export default {
  props: {
    src: {
      type: String
    }
    // ,
    // title: {
    //   type: String
    // }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/mixins";
iframe {
  border: 0;
  width: 100vw;
  height: 89vh;

  @include screen("md") {
    width: 86vw;
    height: 85vh;
  }
}
</style>
