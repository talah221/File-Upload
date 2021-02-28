<template>
  <div class="item p-mx-auto p-overflow-hidden">
    <c-carousel
      :numScroll="1"
      :numVisible="1"
      :value="carousel"
      :page="carousel.length - 1"
      class="effect--shadow"
    >
      <template #item="slotProps">
        <img :src="slotProps.data" :alt="slotProps.data" class="thumbnail" />
      </template>
    </c-carousel>
    <div class="p-grid p-jc-between additional-data p-pt-1">
      <div
        v-for="($datum, $index) of additional"
        :key="$index"
        :class="{
          'p-col-fixed': $datum.list.length < 2,
          'p-col': !($datum.list.length < 2)
        }"
      >
        <h4
          :class="{
            'p-m-0': true,
            'no-heading': !$datum.heading
          }"
        >
          {{ $datum.heading || "-" }}
        </h4>
        <div v-if="$datum.list" class="p-d-flex p-flex-wrap">
          <ul
            v-for="($items, $datum__index) of $datum.list"
            :key="$datum__index"
            :class="{
              'p-p-0': true,
              'p-m-0': true,
              'p-col-12': true,
              'p-sm-6': !($datum.list.length < 2),
              'p-md-4': !($datum.list.length < 2)
            }"
          >
            <li
              v-for="($item, $i) of $items"
              :key="$i"
              class="p-d-flex p-ai-center p-mt-3"
            >
              <c-icon v-if="$item.icon" :name="$item.icon" class="p-ml-2" />
              <a v-if="$item.href" :href="$item.href">{{ $item.label }}</a>
              <label v-else-if="$item.label" class="p-d-flex p-ai-center">{{
                $item.label
              }}</label>
              <span v-if="$item.value">{{ $item.value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="contacts p-text-center p-pt-6">
      <h3 class="p-m-0">מתאם/ת אדריכלי</h3>
      <ul class="p-d-inline-flex p-pt-2 p-mb-0 p-mt-3 p-px-0">
        <li v-for="($item, $index) of contacts" :key="$index">
          <label class="p-d-inline-flex p-ai-center">{{ $item.label }}</label>
          <span>{{ $item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CCarousel from "primevue/carousel";

import CIcon from "./c-icon";

export default {
  components: {
    CIcon,
    CCarousel
  },
  setup() {
    const carousel = [
      require("../assets/img/items/item-detail.png"),
      require("../assets/img/items/item-detail.png"),
      require("../assets/img/items/item-detail.png"),
      require("../assets/img/items/item-detail.png"),
      require("../assets/img/items/item-detail.png")
    ];
    const additional = [
      {
        heading: "פרטי הדירה",
        list: [
          [
            {
              value: 7,
              label: "קומה"
            },
            {
              value: 5,
              label: "חדרים"
            },
            {
              label: 'מ"ר',
              value: 124.8
            },
            {
              label: "כיוונים",
              value: "צפון, מזרח"
            }
          ],
          [
            {
              value: "אמבטיה",
              label: "אמבטיה/מקלחת"
            },
            {
              value: 2,
              label: "חדרי שירותים"
            },
            {
              value: 24,
              label: "גודל מרפסת"
            },
            {
              value: 22,
              label: "מס' מחסן"
            }
          ],
          [
            {
              label: "חניות",
              value: 2
            },
            {
              label: "שטח גינה",
              value: "אין"
            }
          ]
        ]
      },
      {
        heading: "מסמכים",
        list: [
          [
            {
              href: "#",
              label: "חוזה מכר",
              icon: "file"
            },
            {
              href: "#",
              icon: "file",
              label: "תוכנית מכר"
            },
            {
              href: "#",
              icon: "file",
              label: "מפרטים"
            }
          ]
        ]
      }
    ];
    const contacts = [
      {
        label: "שם",
        value: "אביחי כהן"
      },
      {
        label: "טלפון להתקשרות",
        value: "03-9017710 שלוחה 126"
      },
      {
        label: "פקס",
        value: "03-9015177"
      },
      {
        label: 'דוא"ל',
        value: "avichiy.c@ram-aderet.co.il"
      }
    ];

    return {
      carousel,
      contacts,
      additional
    };
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";

.item {
  max-width: 1140px;

  padding-top: 0;

  @include screen("lg") {
    padding-top: 45px;
  }

  ::v-deep(.p-carousel-prev),
  ::v-deep(.p-carousel-next) {
    display: none;
  }
}

.thumbnail {
  width: 100%;
  height: auto;
}

.additional-data {
  font-size: 14px;

  padding-left: 20px;
  padding-right: 20px;

  @include screen("sm") {
    font-size: 18px;
  }

  @include screen("xl") {
    padding-left: 0;
    padding-right: 0;
  }

  h4 {
    font-size: 16px;
    color: $color--dark;

    @include screen("sm") {
      font-size: 24px;
    }

    &.no-heading {
      color: transparent;
    }
  }

  ul {
    list-style: none;

    li {
      svg {
        width: 15px;
        height: 20px;

        color: $color--primary;
      }

      label {
        &::after {
          content: ":";

          margin-left: 5px;
        }
      }
    }
  }
}

.contacts {
  h4 {
    font-size: 16px;
  }

  ul {
    flex-direction: column;

    border-top: 1px solid $color--secondary;

    list-style: none;

    @include screen("lg") {
      flex-direction: row;
    }

    li {
      @include screen("lg") {
        padding: 0 15px;
      }

      &:last-child {
        padding-left: 0;
      }

      &:first-child {
        padding-right: 0;
      }

      label {
        &::after {
          content: ":";

          margin-left: 5px;
        }
      }

      span {
      }
    }
  }
}
</style>
