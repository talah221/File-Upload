<template>
  <header id="header" class="header">
    <div class="header-top">
      <div class="p-p-relative p-d-flex p-ai-center p-jc-between">
        <div>
          <a
            href="#toggle-menu"
            class="toggle-menu"
            @click.prevent="toggleMenu"
          >
            <c-icon name="menu" />
          </a>
        </div>
        <div class="header-logo">
          <router-link to="/">
            <img src="@/assets/img/logo-small.png" alt="Logo" />
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import CIcon from "./c-icon";

export default {
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
    return {
      username: "אברהם לשבסקי"
    };
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch("main/toggleMenuShow", true);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

.header {
  .toggle-menu {
    top: 0;
    right: 0;
    position: absolute;

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

    padding: 10px 15px 5px;

    @include screen("md") {
      padding: 40px 35px 10px;
    }

    h1 {
      font-size: 16px;

      @include screen("md") {
        font-size: 25px;
      }
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
  position: static !important;
}
</style>
