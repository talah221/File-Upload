<template>
  <header></header>
  <main class="router-view">
    <router-view />
  </main>
  <footer></footer>
</template>

<script>
export default {
  name: "RootCMP",
  components: {},
  directives: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.router-view {
}
</style>