import { createApp} from "vue";
import App from "./RootCMP.vue";
import router from "./router";


import "./assets/scss/primevue-custom-theme.scss";
import "./assets/scss/global.scss";

const app = createApp(App)
  .use(router)

import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "primevue/resources/primevue.min.css"; //required: PrimeVue components
import "primeicons/primeicons.css"; //required: PrimeIcons
import "primeflex/primeflex.css";
import "./registerServiceWorker";


app.use(ToastService).use(PrimeVue);
app.component("Toast", Toast);

app.mount("#app");
