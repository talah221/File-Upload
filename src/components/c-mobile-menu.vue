<template>
  <c-sidebar
    position="right"
    :visible="sidebar"
    :showCloseIcon="false"
    class="sidebar"
  >
    <a
      href="#toggle-menu"
      class="sidebar-close"
      @click.prevent="$store.dispatch('main/toggleMenuShow', false)"
    >
      <c-icon name="cancel" />
    </a>
    <div class="sidebar-body">
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
    </div>
  </c-sidebar>
</template>

<script>
// import { useStore } from "vuex";
// import { computed, watch } from "vue";
// import { useRouter } from "vue-router";

import CSidebar from "primevue/sidebar";

import CIcon from "./c-icon";

export default {
  components: {
    CIcon,
    CSidebar
  },
  computed: {
    items() {
      // console.log("store-items", $store.getters["main/getMenu"]);
      return this.$store.getters["main/getMenu"];
    },
    sidebar() {
      return this.$store.getters["main/getShowMenu"];
    }
  },

  watch: {
    sidebar(newValue, value) {
      if (!value) {
        document.body.classList.remove("p-overflow-hidden");
      } else {
        const mask = document.querySelector(".p-sidebar-mask-leave");

        document.body.classList.add("p-overflow-hidden");
        if (mask) mask.classList.remove("p-sidebar-mask-leave");
      }
    }
  },
  methods: {
    logout() {
      // remove cookies
      this.$cookie.removeCookie("main-user-object", {
        path: "/",
        domain: ""
      }); // return this | false if key not found
      this.$cookie.removeCookie("main-user-remember", {
        path: "/",
        domain: ""
      }); // return this | false if key not found

      // אתחול הטוקן על מנת שיגיע למסך לוגין
      this.$store.commit("api/resetToken");
      // this.$router.push({
      //   name: "Home"
      // });
    }
  }
  //   setup() {
  //     const $store = useStore();
  //     const $router = useRouter();

  //     const items = computed(() => {
  //       console.log("store-items", $store.getters["main/getMenu"]);
  //       return $store.getters["main/getMenu"];
  //     });
  //     const sidebar = computed(() => $store.getters["main/getShowMenu"]);

  //     watch(sidebar, value => {
  //       if (!value) {
  //         document.body.classList.remove("p-overflow-hidden");
  //       } else {
  //         const mask = document.querySelector(".p-sidebar-mask-leave");

  //         document.body.classList.add("p-overflow-hidden");
  //         if (mask) mask.classList.remove("p-sidebar-mask-leave");
  //       }
  //     });

  //     $router.afterEach(() => {
  //       console.log("router-afterEach-getShowMenu");
  //       if ($store.getters["main/getShowMenu"])
  //         setTimeout(() => {
  //           $store.dispatch("main/toggleMenuShow", false);
  //           console.log("router.afterEach-in com");
  //         }, 150);
  //     });
  //     const logout = () => {
  //       console.log("logout");
  //       // $store.commit("api/resetToken");
  //       console.log(this.$cookie.getCookie("main-user-remember"));
  //     };
  //     return {
  //       items,
  //       sidebar,
  //       logout
  //     };
  //   }
};
</script>

<style scoped lang="scss">
.sidebar {
  &-close {
    top: 20px;
    position: absolute;
    right: calc(100% + 25px);

    svg {
      width: 18px;
      height: 18px;

      color: white;
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
    background-image: url("../assets/img/effects/bg-bottom.png");

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
