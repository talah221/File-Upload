<template>
  <section id="login" class="section section--login p-d-flex p-ai-center p-jc-center">
    <div class="content">
      <div class="p-text-center">
        <router-link to="/">
          <img src="../assets/img/logo.png" alt="Logo" />
        </router-link>
      </div>
      <p class="p-text-center p-mt-5 p-mb-4">נא הזן את קוד האימות שנשלח אליך ב - SMS</p>
      <div class="field p-float-label">
        <c-input-text v-model="code" class="field-input" />
      </div>
      <p class="p-text-center p-mt-1 p-mb-4">
        לא קיבלת את הקוד?
        <a href="#">שלח שוב</a>
      </p>
      <div class="p-d-flex">
        <c-button label="חזרה"
                  class="p-col p-ml-2 p-button-dark"

                  @click="navigate"
                />
        <c-button label="שלח"
                  class="p-col p-mr-2 p-button-dark"

                  @click="navigate"
                />
      </div>
    </div>
  </section>
</template>

<script>

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CButton from 'primevue/button'
import CInputText from 'primevue/inputtext'

export default {
  components: {
    CButton,
    CInputText,
  },
  setup() {
    const $router = useRouter()

    const code = ref('')
    
    const navigate = () => $router.push({ path: '/home' })

    return {
      code,
      
      navigate,
    }
  }
}
</script>

<style scoped lang="scss">
  
  .content {
    width: 100%;
    max-width: 320px;
  }

  .field {
    width: 100%;

    &-input {
      padding-top: 14px;
      padding-bottom: 14px;
    }
  }

</style>