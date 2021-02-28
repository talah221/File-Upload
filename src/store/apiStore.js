export const apiStore = {
  namespaced: true,
  state: {
    userName: "",
    pswd: "",
    userID: 0,
    compGUID: "",
    compID: 0,
    sessionToken: "",
    tokenCreated: null,
    webPswd: ""
  },
  mutations: {
    setSessionData(state, payload) {
      //  console.log('state: setSessionData')
      for (let key of Object.keys(payload)) {
        // console.log(`key: ${key}: ${payload[key]}`)
        state[key] = payload[key];
      }
    },
    setCompGuid(state, payload) {
      state.compGUID = payload;
    },
    resetToken(state) {
      //  console.log('api/resetToken')
      state.sessionToken = "";
      state.tokenCreated = null;
    },
    setToken(state, payload) {
      state.sessionToken = payload;
      state.tokenCreated = new Date();
    }
  },
  actions: {
    getCompGuidFromSecureCookie({ commit }, payload) {
      //TODO: get from secure cookie (only in vue component)
      commit("setCompGuid", payload);
    }
  },
  modules: {},
  getters: {
    isLoggedIn: state => {
      return state.sessionToken !== "" && state.compGUID !== "";
    }
  }
};
