<template>
  <nav
    :class="{
      items: true,
      [`items-${$props.mode}`]: $props.mode
    }"
    role="navigation"
  >
    <ul class="p-grid p-jc-center p-m-0">
      <li
        v-for="($item, $index) of items"
        :key="$index"
        class="p-col-6 p-sm-4 p-md-3 p-lg-2"
      >
        <router-link :to="`/detail/${$index}`" class="item">
          <img :alt="$item" :src="thumbnail($index)" class="item-thumbnail" />
          <img
            :alt="$item"
            :src="thumbnail($index, 'sm')"
            class="item-thumbnail item-thumbnail-sm"
          />
          <h3 class="item-name p-text-center p-m-0">{{ $item }}</h3>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

// import { useRouter } from "vue-router";

export default {
  props: {
    mode: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const $store = useStore();

    const items = computed(() => $store.getters["main/getMenu"]);

    const thumbnail = (index, pfx) => {
      const prefix = pfx ? `${pfx}-` : props.mode ? `${props.mode}-` : "";

      return require(`../assets/img/items/item-${prefix}${index}.png`);
    };

    // const $router = useRouter();

    // const navigate = () => {
    //   console.log("check");
    //   $router.push({ mane: "About", params: { id: 1 } });
    // };
    return {
      items,
      thumbnail
      // ,
      // navigate
    };
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

.items {
  overflow: hidden;

  ul {
    padding: 1.5px 1.5px 30px;

    list-style: none;

    li {
      padding: 1.5px;

      .item {
        position: relative;

        display: block;

        height: 143px;

        @include screen("lg") {
          height: 100%;
        }

        &::after {
          content: "";

          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          position: absolute;

          width: 100%;
          height: 233px;
          max-height: 100%;

          background: $effect--overlay;
        }

        &-thumbnail {
          object-fit: cover;
          object-position: center;

          display: none;

          width: 100%;
          height: 100%;

          @include screen("lg") {
            display: block;
          }
        }

        &-thumbnail-sm {
          display: block;

          @include screen("lg") {
            display: none;
          }
        }

        &-name {
          right: 0;
          z-index: 2;
          bottom: 30px;
          position: absolute;

          width: 100%;

          color: white;
          font-size: 15px;

          @include screen("md") {
            font-size: 18px;
          }

          @include screen("lg") {
            font-size: 20px;
          }

          @include screen("xl") {
            font-size: 24px;
          }
        }

        &.router-link-active {
          .item-name {
            color: $color--dark;
          }

          &::before {
            content: "";

            left: 0;
            right: 0;
            position: absolute;
            top: calc(100% + 1px);

            width: 100%;

            border-bottom: 5px solid $color--primary;
          }

          &::after {
            background: $effect--overlay-light;
          }
        }
      }
    }
  }

  &.items-menu {
    display: none;

    @include screen("lg") {
      display: block;
    }

    ul {
      li {
        .item {
          height: 100%;
          max-height: 100px;

          &-name {
            bottom: 50%;
            transform: translateY(50%);
          }
        }
      }
    }
  }
}
</style>
