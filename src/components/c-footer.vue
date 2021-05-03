<template>
  <footer id="footer" class="footer p-pb-5">
    <ul
      v-if="$props.screen == 'social'"
      class="footer-social p-grid p-ai-center p-jc-center p-m-0 p-p-0"
    >
      <li
        v-for="($social, $index) of socials"
        :key="$index"
        class="p-col-fixed"
      >
        <a
          :href="$social.href"
          target="_blank"
          class="p-d-flex p-ai-center p-jc-center"
        >
          <c-icon :name="$social.icon" />
        </a>
      </li>
    </ul>
    <div class="p-text-center p-mt-3">רם אדרת. © כל הזכויות שמורות</div>
    <div class="p-d-flex p-ai-baseline p-jc-center" style="font-size: 12px;">
      <div class="p-d-flex p-ai-center">
        <span class="p-order-3">Powered by</span>
        <img
          src="@/assets/img/logo-apoint-min.png"
          class="footer-logo p-order-2"
        />
        <a class="p-order-1" href="https://www.apoint.co.il" target="_blank"
          >A Point Systems ltd</a
        >
      </div>
    </div>
  </footer>
</template>
<script>
import CIcon from "./c-icon";

export default {
  name: "c-footer",
  props: {
    screen: {
      type: String,
      default: "default"
    }
  },
  components: {
    CIcon
  },
  setup() {
    const socials = [
      {
        icon: "instagram",
        href: "//instagram.com"
      },
      {
        icon: "facebook",
        href: "//fb.com"
      },
      {
        icon: "facebook",
        href: "//fb.com"
      }
    ];

    return {
      socials
    };
  }
};
</script>

<style scoped lang="scss">
.footer-logo {
  margin: 5px;
  max-height: 12px;
}
.footer {
  &-social {
    position: relative;

    list-style: none;

    &::before {
      content: "";

      left: 0;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);

      width: 100%;

      border-bottom: 1px solid $color--secondary;
    }

    li {
      z-index: 2;
      position: relative;

      a {
        width: 48px;
        height: 48px;

        border-radius: 48px;
        background-color: $color--dark;

        color: white;
      }
    }
  }
}
</style>
