<!-- <div class="sidebar-body">
      <h3>תפריט</h3>
      <nav role="navigation">
        <ul>
          <li>
            <router-link to="/" class="p-d-flex p-ai-center">
              <c-icon name="arrow" />
              <span class="p-mr-2">עמוד הבית</span>
            </router-link>
          </li>
          <li v-for="($item, $index) of items" :key="$index">
            <router-link :to="`/detail/${$index}`" class="p-d-flex p-ai-center">
              <c-icon name="arrow" />
              <span class="p-mr-2">{{ $item }}</span>
            </router-link>
          </li>
          <li @click="logout">
            <router-link to="/" class="p-d-flex p-ai-center">
              <div class="p-d-flex p-ai-center">
                <c-icon name="arrow" />
                <span class="p-mr-2">יציאה</span>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </div> -->
<template>
  <c-sidebar
    position="right"
    :visible="showMenu"
    :showCloseIcon="false"
    :modal="false"
    class="sidebar p-sidebar-right"
  >
    <a
      v-if="showCancle"
      href="#toggle-menu"
      class="sidebar-close"
      @click.prevent="$store.dispatch('main/toggleMenuShow', false)"
    >
      <c-icon name="cancel" style="" />
    </a>

    <div class="sidebar-body">
      <!-- <h3>תפריט בקרות</h3> -->
      <div class="header-logo">
        <router-link to="/">
          <img src="@/assets/img/logo-small.png" alt="Logo" />
        </router-link>
      </div>
      <nav role="navigation">
        <PanelMenu :model="items" :alwaysOpen="true" />
      </nav>
    </div>
  </c-sidebar>
</template>

<script>
/*eslint-disable*/

// import menuItems from "@/scripts/menuItems.js";
import PanelMenu from "primevue/panelmenu";
import CSidebar from "primevue/sidebar";
import CIcon from "./c-icon";
import screen from "@/scripts/screen.js";
export default {
  name: "c-mobile-menu",
  components: {
    PanelMenu,
    CSidebar,
    CIcon,
  },
  data() {
    return {
      items: [
        { label: "עמוד הבית", to: "/" },
        {
          label: "בקרות איכות",
          items: [
            { label: "פתיחת בקרה חדשה", to: "/QualityControl" },
            {
              label: "צפיה בבקרות",
              to: "/QualityControls/all",
            },
            {
              label: "בקרות לטיפול שלי",
              to: "/QualityControls/myResponsibility",
            },
            {
              label: "בקרות שפתחתי",
              to: "/QualityControls/ICreated",
              icon: "active-icon",
            },
          ],
        },
        {
          label: "התנתק",
          icon: "pi pi-fw pi-power-off",

          command: () => {
            let baseHost = this.$store.state.main.baseHost();
            baseHost = this.$store.state.main.baseHost() + "options.aspx";
            location.replace(baseHost);
          },
        },
      ],
    };
  },
  computed: {
    showMenu() {
      // return true;
      if (screen.isDesktop()) return true;
      return this.$store.getters["main/getShowMenu"];
    },
    showCancle() {
      // return true;
      if (screen.isDesktop()) return false;
      return true;
    },
    showLogo() {
      return !screen.isDesktop();
    },
  },
  methods: {
    getCurrentRoute() {
      const route = this.$route;
      console.log("getCurrRoute", route);
      return route;
    },
  },
  watch: {
    showMenu(sidebar, value) {
      if (value) {
        document.body.classList.remove("p-overflow-hidden");
      } else {
        const mask = document.querySelector(".p-sidebar-mask-leave");

        document.body.classList.add("p-overflow-hidden");
        if (mask) mask.classList.remove("p-sidebar-mask-leave");
      }
    },
  },
};
</script>
<style>
</style>
<style scoped lang="scss">
.header-logo {
  margin: 0 auto;
  padding-bottom: 20px;
  width: 70px;
  height: 100px;
}
.sidebar {
  &-close {
    top: 20px;
    position: absolute;
    right: calc(100% + 25px);
    background: white;
    padding: 7px;
    border-radius: 25px;
    box-shadow: 0px 0px 20px 0px #888888;
    transition: 0.3s;
    &:hover {
      background: lightblue;
    }

    svg {
      width: 18px;
      height: 18px;

      color: #6d8dbe;
    }
  }

  &-body {
    overflow: hidden;
    overflow-y: auto;

    height: 100%;
    max-height: 100%;

    background-size: auto 50%;
    background-repeat: no-repeat;
    background-position: bottom left;
    // background-image: url("../assets/img/effects/bg-bottom.png");

    h3 {
      margin: 20px 30px 30px;

      font-size: 24px;
      color: $color--primary;
    }

    ul {
      margin: 0;
      padding: 0;

      list-style: none;

      li {
        position: relative;

        padding: 0 30px;
        margin-bottom: 35px;

        a {
          display: inline-block;

          font-size: 18px;
          text-decoration: none;

          &::before {
            content: "";

            top: 30;
            right: 0;
            position: absolute;

            width: 0px;
            height: 8px;

            background-color: $color--primary;
            clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%);

            transition: 0.3s width ease;
          }

          svg {
            width: 7px;
            height: 14px;

            color: $color--primary;
          }

          &.router-link-active {
            color: $color--primary;

            &::before {
              width: 32px;
            }
          }
        }
      }
    }
  }
}
</style>
