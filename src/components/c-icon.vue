<template>
  <svg
    :class="{
      svg: true,
      [`svg--${$props.name}`]: $props.name
    }"
  >
    <use :xlink:href="`${icons}#${$props.name}`"></use>
  </svg>
</template>

<script>
import icons from "../assets/img/icons.svg";

export default {
  props: {
    name: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      icons
    };
  }
};
</script>

<style scoped lang="scss">
.svg {
  display: inline-block;

  width: 30px;
  height: 30px;

  vertical-align: middle;

  color: inherit;
}
</style>
