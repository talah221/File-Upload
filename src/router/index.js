import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Detail from "../views/Detail.vue";
import About from "../views/About.vue";

const routes = [
  {
    name: "Detail",
    component: Detail,
    path: "/detail/:id"
  },
  {
    name: "Home",
    path: "/home",
    component: Home
  },
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/About/:id",
    name: "About",
    component: About
  }
];

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
