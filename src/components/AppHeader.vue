<template>
  <div class="p-grid " dir="rtl">
    <div class="p-col-fixed p-as-center" v-show="needShowMenu">
      <Button
        icon=" pi pi-bars"
        class="p-button-outlined"
        @click="showMenu"
      ></Button>
    </div>

    <div class="p-col p-as-center">
      <h1 class="box">{{ clientName }}</h1>
    </div>
    <div class="p-col-fixed ">
      <img :src="logoImgSrc" :alt="compName" class="logo-style" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Button from "primevue/button";

export default {
  name: "AppHeader",
  components: {
    Button
  },
  emits: ["showMenu"],
  props: {
    compName: {
      type: String,
      default: "A Point Systems"
    },
    logoImgSrc: {
      type: String,
      default: "/assets/logo-apoint.png"
    }
  },
  computed: {
    ...mapState({
      clientName: state => state.main.clientName,
      clientID: state => state.main.clientID
    }),
    needShowMenu() {
      return this.clientID !== 0;
    }
  },
  methods: {
    showMenu() {
      this.$emit("showMenu");
    }
  }
};
</script>

<style scoped>
.logo-style {
  max-width: 130px;
  max-height: 80px;
}
</style>
