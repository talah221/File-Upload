import store from "../store/index";
// import { apiStore } from "../store/apiStore";

// import { VueCookieNext } from "vue-cookie-next";
import router from "../router/index.js";
export default [
  // {
  //   label: "צילום תמונות ומסמכים",
  //   command: () => {
  //     router.push({
  //       name: "Options",
  //       params: { id: 1 }
  //     });
  //   }
  // },
  // {
  //   label: "דיווח נוכחות",

  //   command: () => {
  //     router.push({
  //       name: "AttendanceReporting"
  //     });
  //   }
  // },
  {
    // label: "בקרה והבטחת איכות",
    // items: [
    //   {
    label: "בקרות איכות",
    items: [
      { label: "פתיחת בקרה חדשה", to: "/QualityControl" },
      {
        label: "בקרות לטיפול שלי",
        command: () => {
          router.push({
            name: "QualityControls",
            params: { filter: "myResponsibility" }
          });
        }
      },
      {
        label: "צפייה בבקרות",
        // to: "/QualityControls",
        // params: { filter: 4 }
        command: () => {
          router.push({
            name: "QualityControls",
            params: { filter: "all" }
          });
        }
      },
      {
        label: "בקרות שפתחתי",
        command: () => {
          router.push({
            name: "QualityControls",
            params: { filter: "ICreated" }
          });
        }
      }
    ]
    // }
    // ,{ label: "סדר מלאכות בדירה" }
    // ]
  },
  // {
  //   label: "תוכניות - תיאום אדריכלי",
  //   command: () => {
  //     router.push({
  //       name: "Options",
  //       params: { id: 4 }
  //     });
  //   }
  // },
  // {
  //   label: "סיורי בטיחות",
  //   command: () => {
  //     router.push({
  //       name: "Options",
  //       params: { id: 5 }
  //     });
  //   }
  // },
  // {
  //   label: "הגדרות",
  //   command: () => {
  //     router.push({
  //       name: "Options",
  //       params: { id: 6 }
  //     });
  //   }
  // },
  // {
  //   label: "יציאה",
  //   icon: "pi pi-fw pi-power-off",
  //   command: () => {
  //     // remove cookies
  //     VueCookieNext.removeCookie("main-user-object", {
  //       path: "/",
  //       domain: ""
  //     }); // return this | false if key not found
  //     VueCookieNext.removeCookie("main-user-remember", {
  //       path: "/",
  //       domain: ""
  //     }); // return this | false if key not found

  //     // אתחול הטוקן על מנת שיגיע למסך לוגין
  //     store.commit("api/resetToken");
  //   }
  // }
  {
    label: "חזור לתפריט ראשי",
    icon: "pi pi-fw pi-power-off",
    command: () => {
      let baseHost = store.state.main.baseHost();
      baseHost = store.state.main.baseHost() + "options.aspx";
      location.replace(baseHost);
    }
  }
];
