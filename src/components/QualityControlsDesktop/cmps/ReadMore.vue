<template>
  <div class="container">
    <p v-if="!displayAllText">{{ getTextToShow }}</p>
    <p style="display: block" v-if="displayAllText">{{ text }}</p>
    <a @click="toggleText">{{ readLessOrMore }}</a>
  </div>
</template>

<script>
export default {
  name: "ReadMore",
  props: ["text", "length"],
  data() {
    return {
      displayAllText: false,
    };
  },
  methods: {
    toggleText() {
      this.displayAllText = !this.displayAllText;
    },
  },
  computed: {
    getTextToShow() {
      let textToShow = this.text
        .split(" ")
        .splice(0, +this.length)
        .join(" ");
      return textToShow.split(" ").length <= this.length
        ? `${textToShow}...`
        : `${textToShow}`;
    },
    readLessOrMore() {
      if (this.text.split(" ").length <= this.length) {
        return;
      }
      if (this.displayAllText) return "קרא פחות";
      return "קרא יותר";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  a {
    display: flex;
    text-decoration: underline;
    cursor: pointer;
    color: #1e81d6;
    font-size: 1.05rem;
  }
  p {
    display: inline;
    font-size: 1rem;
  }
}
</style>