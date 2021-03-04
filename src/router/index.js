import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
// import Login from "@/components/Login.vue";
import Detail from "../views/Detail.vue";

const routes = [
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail
  },
  {
    path: "/",
    name: "Home",
    component: Home
  }
];
/*,
  {
    path: "/",
    name: "Login",
    component: Login
  }*/
const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }
});

export default router;
