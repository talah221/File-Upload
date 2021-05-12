<template>
  <header id="header" class="header">
    <div class="header-top">
      <div class="p-d-flex p-ai-center space-evenly">
        <div>
          <a
            href="#toggle-menu"
            class="toggle-menu"
            @click.prevent="toggleMenu"
          >
            <c-icon name="menu" />
          </a>
        </div>
        <h1>{{ appHeader }}</h1>
        <div>
          <div class="header-logo" v-if="showLogo">
            <router-link to="/">
              <img src="@/assets/img/logo-small.png" alt="Logo" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import CIcon from "./c-icon";
import { mapState } from "vuex";
import screen from "@/scripts/screen.js";

export default {
  name: "c-header",
  props: {
    icon: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CIcon
  },
  data() {
    return {};
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch("main/toggleMenuShow", true);
    }
  },
  computed: {
    showLogo() {
      return screen.isDesktop();
    },
    ...mapState({
      appHeader: state => state.main.appHeader
    })
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

.header {
  z-index: 50;
  background: white;
  .toggle-menu {
    position: absolute;
    top: 25px;
    right: 15px;
    display: block;

    svg {
      width: 16px;
      height: 14px;

      color: $color--secondary;
    }

    @include screen("sm") {
      svg {
        width: 30px;
        height: 30px;
      }
    }

    @include screen("lg") {
      display: none;
    }
  }

  &-top {
    position: relative;

    // padding: 10px 15px 5px;

    @include screen("md") {
      // padding: 40px 35px 10px;
    }

    h1 {
      font-size: 35px;
      color: $color--primary;
    }

    p {
      font-size: 12px;

      @include screen("md") {
        font-size: 19px;
      }
    }
  }

  &-logo {
    top: 0;
    left: 0;
    position: absolute;

    width: 40px;
    height: 40px;

    @include screen("md") {
      width: 85px;
      height: 85px;
    }
  }

  &-icon {
    top: 0;
    right: 0;
    position: absolute;

    display: none;

    @include screen("lg") {
      display: block;
    }

    svg {
      width: 51px;
      height: 51px;

      color: $color--secondary;
    }
  }

  &-bottom {
    position: relative;

    background-color: $color--dark;

    @include screen("lg") {
      border-bottom: 1px solid $color--default;
    }

    ul {
      list-style: none;

      height: 42px;
      min-width: 320px;

      padding: 10px 30px;
      margin: -22px 0 -4px;

      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url("../assets/img/effects/bg-cliped.png");

      @include screen("md") {
        height: 56px;
        min-width: 453px;

        margin: -22px 0 -2px;
      }

      li {
        position: relative;

        font-size: 14px;

        @include screen("md") {
          font-size: 19px;
        }

        &:not(:last-child)::after {
          content: "";

          display: inline-block;

          height: 11px;

          margin: 0 5px;

          border-left: 1px dotted $color--secondary;

          vertical-align: middle;

          @include screen("md") {
            margin: 0 10px;
          }
        }
      }
    }
  }
}
.header-logo,
.toggle-menu {
  position: static;
  img {
    width: 80px;
    padding: 3px;
  }
}
.space-evenly {
  justify-content: space-evenly;
}

@media (max-width: 500px) {
  .header {
    background-color: #f7f7f7;
    .toggle-menu {
      position: absolute;
      top: 25px;
      right: 15px;
    }
  }
}
</style>
