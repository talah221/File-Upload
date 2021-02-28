import { createStore } from "vuex";
import { apiStore } from "./apiStore";

const mainStore = {
  namespaced: true,
  state: {
    isDev() {
      return true;
    },
    baseHost() {
      if (this.isDev()) return "https://ramaderet.apoint.co.il/";
      else return "";
    }
  },
  mutations: {},
  actions: {},
  modules: {}
};

export default createStore({
  modules: {
    api: apiStore,
    main: mainStore
  }
});
