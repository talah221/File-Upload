<template>
  <iframe :src="baseHost + url"></iframe>
</template>

<script>
import { mapState } from "vuex";
export default {
  setup() {
    return {};
  },
  props: {
    url: {
      type: String,
      default: "addPicther.aspx"
    }
  },
  computed: {
    ...mapState({
      baseHost: state => state.main.baseHost()
    })
  }
};
</script>

<style>
iframe {
  width: 100%;
  height: 100%;
}
</style>
