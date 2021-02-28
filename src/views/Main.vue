<template>
  <!-- <div class="container p-p-3" dir="rtl">
    <div class="menuBtn">
      <Button
        type="button"
        v-if="showMenuBtn"
        icon=" pi pi-bars"
        class="p-button-outlined"
        @click="showMenu"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      />
      <Menu id="overlay_menu" ref="menu" :model="menuItems" :popup="true" />
    </div>
    <div class="LogoImg">
      <img :src="logoImgSrc" :alt="compName" class="logo-style" />
    </div>
    <div class="headerTitle">
      <h1 style="color: #97664A;">
        <b v-if="showMenuBtn">{{ clientName }}</b>
      </h1>
    </div>
    <IFrameOA url="/Account/Lgino.aspx"></IFrameOA>
    <div class="footer"><AppFooter /></div>
    <div class="content">
      <router-view />
    </div>
  </div> -->
  <c-mobile-menu />
  <router-view />
</template>

<script>
// import AppFooter from "../components/AppFooter";
// import { mapState } from "vuex";
// import Button from "primevue/button";
// import Menu from "primevue/menu";
// import menuItemsArray from "../components/menuItems";
// import IFrameOA from "../components/iFrameOA.vue";
import CMobileMenu from "./components/c-mobile-menu";
export default {
  name: "Main",
  components: {
    // AppFooter,
    // Menu,
    // Button,
    // IFrameOA
    CMobileMenu
  },
  // props: {
  //   compName: {
  //     type: String,
  //     default: "A Point Systems"
  //   },
  //   logoImgSrc: {
  //     type: String,
  //     default: "/assets/logo-apoint.png/?v=2"
  //   }
  // },
  data() {
    return {
      // //PrimeVue Roma settings
      // layoutMode: "overlay", //slim || static || overlay || horizontal
      // //menu settings
      // menuItems: menuItemsArray
    };
  },
  methods: {
    // showMenu(event) {
    //   this.$refs.menu.toggle(event);
    // }
  }
  //,
  // computed: {
  //   ...mapState({
  //     clientName: state => state.main.clientName,
  //     clientID: state => state.main.clientID
  //   }),
  //   showMenuBtn() {
  //     return this.clientID !== 0;
  //   }
  // }
};
</script>

<style scoped>
/* .container {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 1fr;
  grid-template-rows: 120px 30px 1fr 22px;
  grid-gap: 1em 1em;
  width: 100vw;
  height: 100vh;
}

.menuBtn {
  grid-area: 1 / 1 / 2 / 2;
}

.LogoImg {
  grid-area: 1 / 4 / 2 / 5;
  text-align: end;
}
.logo-style {
  max-height: 110px;
}
.headerTitle {
  grid-area: 2 / 1 / 3 / 5;
  text-align: center;
  align-self: center;
}

.footer {
  grid-area: 4 / 1 / 5 / 5;
}

.content {
  grid-area: 3 / 1 / 4 / 5;
  place-self: stretch stretch;
  height: 80vh;
  overflow: scroll;
}
@media screen and (max-height: 1030px) {
  .content {
    height: 75vh;
  }
}
@media screen and (max-height: 900px) {
  .content {
    height: 73vh;
  }
}
@media screen and (max-height: 700px) {
  .content {
    height: 61vh;
  }
}
</style>
<style>
.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr.p-highlight {
  background-color: #97664a !important;
  color: white !important;
}
.p-datatable .p-datatable-tbody > tr > td,
.p-datatable .p-datatable-tbody > tr {
  background-color: transparent !important;
} */
</style>
