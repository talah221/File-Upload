<template>
  <footer id="footer" class="footer p-pb-5">
    <ul v-if="$props.screen == 'social'"
        
        class="footer-social p-grid p-ai-center p-jc-center p-m-0 p-p-0">
      <li v-for="($social, $index) of socials"
          
          :key="$index"
          class="p-col-fixed">
        <a  :href="$social.href"
            
            target="_blank"
            class="p-d-flex p-ai-center p-jc-center">
          <c-icon :name="$social.icon" />
        </a>
      </li>
    </ul>
    <div class="p-text-center p-mt-3">רם אדרת. © כל הזכויות שמורות</div>
  </footer>
</template>
<script>

import CIcon from './c-icon'

export default {
  props: {
    screen: {
      type: String,
      default: 'default'
    }
  },
  components: {
    CIcon,
  },
  setup() {
    const socials = [
      {
        icon: 'instagram',
        href: '//instagram.com',
      },
      {
        icon: 'facebook',
        href: '//fb.com',
      }
    ]

    return {
      socials
    }
  }
}

</script>

<style scoped lang="scss">

  .footer {

    &-social {
      position: relative;

      list-style: none;

      &::before {
        content: '';
        
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
