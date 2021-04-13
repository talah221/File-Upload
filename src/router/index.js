import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
// import Login from "@/components/Login.vue";
import Detail from "../views/Detail.vue";
import Options from "../views/Options.vue";
import AttendanceReporting from "../views/AttendanceReporting.vue";
import QualityControl from "../views/QualityControl.vue";
import QualityControls from "../views/QualityControls.vue";
import Plan from "../views/Plan.vue";

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
  },
  {
    path: "/options/:id",
    name: "Options",
    component: Options
  },
  {
    path: "/AttendanceReporting",
    name: "AttendanceReporting",
    component: AttendanceReporting
  },
  {
    path: "/QualityControl",
    name: "QualityControl",
    component: QualityControl
  },
  {
    path: "/Plan/:id",
    name: "Plan",
    component: Plan
  },
  {
    path: "/QualityControls", //todo להוסיף פרמטר
    name: "QualityControls",
    component: QualityControls
  }
];
// ,
// {
//   path: "/",
//   name: "Login",
//   component: Login
// }
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
