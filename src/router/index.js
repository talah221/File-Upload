import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../views/Homepage";
const routes = [
  {
    path: "/",
    name: "Homepage",
    component: Homepage,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  },
});

export default router;
