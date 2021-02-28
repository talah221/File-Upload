<template>
  <div>
    <h3 class="question">{{ qText }}</h3>
    <div class="p-grid p-jc-center">
      <Rating
        class="p-rating rating1"
        name="qs"
        :stars="starsFx"
        :cancel="false"
        @change="setAnswer"
        v-model="qAnswer"
      />
    </div>

    <div class="p-grid p-jc-between">
      <div>{{ lowRatingText }}</div>
      <div>{{ highRatingText }}</div>
    </div>
  </div>
</template>

<script>
import Rating from "primevue/rating";
import { Nz } from "../services/APointAPI";
export default {
  name: "SekerQueRating",
  components: { Rating },
  props: {
    qText: {
      type: String,
      required: true
    },
    ratingStars: {
      required: true
    },
    lowRatingText: {
      type: String
    },
    highRatingText: {
      type: String
    },
    value: {}
  },
  emits: ["qAnswer"],
  data() {
    return {
      qAnswer: null,
      starsFx: 0
    };
  },
  mounted() {
    this.setQueValues();
  },
  watch: {
    qText() {
      this.setQueValues();
    }
  },
  methods: {
    setQueValues() {
      this.starsFx = parseInt(Nz(this.ratingStars, 1));
      if (this.value) this.qAnswer = parseInt(this.value);
      else this.qAnswer = null;
    },
    setAnswer() {
      this.$emit("qAnswer", this.qAnswer);
    }
  }
};
</script>

<style scoped>
.rating1 {
  margin-left: 10px;
  margin-right: 10px;
  zoom: 150%;
  padding: 10px;
}
</style>
