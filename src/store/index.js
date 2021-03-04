import { createStore } from "vuex";
import { apiStore } from "./apiStore";

const mainStore = {
  namespaced: true,
  state: {
    isDev() {
      //TODO: add window.location = localhost
      return true;
    },
    baseHost() {
      if (this.isDev()) return "https://ramaderet.apoint.co.il/";
      else return "";
    },
    menu: [
      "הדירה שלי ",
      "מצב חשבון ",
      "תיאום אדריכלי",
      "מחלקת הבדק",
      "חדשות ומבצעים",
      " צור קשר",
      "נסיון הוספת "
    ],
    showMenu: false
  },
  mutations: {
    setShowMenu: (state, payload) => (state.showMenu = payload)
  },
  actions: {
    toggleMenuShow: function({ commit, getters }, show) {
      commit("setShowMenu", show ? show : !getters.getShowMenu);
    }
  },
  modules: {},
  getters: {
    getMenu: state => state.menu,
    getShowMenu: state => state.showMenu
  }
};

export default createStore({
  modules: {
    api: apiStore,
    main: mainStore
  }
});
