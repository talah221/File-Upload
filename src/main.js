import { createApp, reactive } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import { VueCookieNext } from "vue-cookie-next";

import "./assets/scss/primevue-custom-theme.scss";
import "./assets/scss/global.scss";

const app = createApp(App)
  .use(router)
  .use(store)
  .use(VueCookieNext);

//PrimeVue settings start
import { primeVueLocale } from "./locale.js";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Ripple from "primevue/ripple";
import Tooltip from "primevue/tooltip";
// import CodeHighlight from './AppCodeHighlight'

import "primevue/resources/primevue.min.css"; //required: PrimeVue components
import "primeicons/primeicons.css"; //required: PrimeIcons

//import './App.scss'; 	                            //your styles and overrides
import "primeflex/primeflex.css";

import "./registerServiceWorker";

router.beforeEach(function(to, from, next) {
  //window.scrollTo(0, 0); //גלילה של החלון להתחלה
  // console.log("router.beforeEach");
  next();
});
router.afterEach(() => {
  if (store.getters["main/getShowMenu"])
    setTimeout(() => {
      store.dispatch("main/toggleMenuShow", false);
    }, 150);
});
app.use(ToastService).use(PrimeVue, {
  locale: primeVueLocale,
  ripple: true
});

app.config.globalProperties.$appState = reactive({ inputStyle: "outlined" });
// app.config.globalProperties.$primevue.ripple = true;

app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);
// app.directive("code", CodeHighlight);

app.component("Toast", Toast);
//PrimeVue settings end

app.mount("#app");
