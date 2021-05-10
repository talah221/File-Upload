import { createStore } from "vuex";
import { apiStore } from "./apiStore";
import { qualityControl } from "./qualityControlStore";
import { spinnerInstances } from "../scripts/enums.js";
const mainStore = {
  namespaced: true,
  state: {
    isDev() {
      return window.location.host.substring(0, 9) === "localhost" ||
        window.location.host.substring(0, 22) === "ramaderet.apoint.co.il"
        ? true
        : false;
    },
    baseHost() {
      if (this.isDev()) return "https://ramaderet.apoint.co.il/";
      else return "https://apoint.ram-aderet.co.il/";
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
    showMenu: false,
    appHeader: "",
    displaySpinner: false,
    displaySpinnerObj: {
      [spinnerInstances.e_testLogin]: false,
      [spinnerInstances.e_QCReporting_loadDdl]: false,
      [spinnerInstances.e_QualityControlsFilters_loadDdl]: false,
      [spinnerInstances.e_QualityControl_loadDdl]: false,
      [spinnerInstances.e_QualityControls_loadAttFiles]: false
    }
  },
  mutations: {
    setShowMenu: (state, payload) => (state.showMenu = payload),
    setSpinner: (state, payload) => {
      state.displaySpinnerObj[payload.id] = payload.flag;

      let displaySpinner = false;
      if (!payload.flag) {
        Object.values(state.displaySpinnerObj).every(val => {
          if (val) {
            displaySpinner = true;
            return false;
          }
          return true;
        });
      } else {
        displaySpinner = true;
      }

      state.displaySpinner = displaySpinner;
    },
    setAppHeader(state, payload) {
      // console.log("setAppHeader", "from", state.appHeader, "to", payload);
      if (state.appHeader === payload) return;
      state.appHeader = payload;
    }
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
    main: mainStore,
    qc: qualityControl
  }
});
