<template>
  <div class="single_form_buttons">
    <Button label="שמור וסגור" @click="saveClose" icon="pi pi-check"></Button>
    <Button label="הוסף תמונה" @click="addPoto" icon="pi pi-camera"></Button>
    <Button
      v-if="apartmentId !== 0"
      label="תוכניות"
      @click="plans"
      icon="pi pi-file-pdf"
    ></Button>
    <Button
      label="בקרה חדשה"
      @click="addNewQC"
      icon="pi pi-plus-circle"
    ></Button>
  </div>
</template>
<script>
import Button from "primevue/button";

export default {
  name: "QualityControlAdd",
  props: {
    modelValue: {},
    apartmentId: {
      type: Number
    }
  },
  emits: ["saveClose", "plans", "addNewQC"],
  components: {
    Button
  },

  methods: {
    saveClose() {
      this.$emit("saveClose");
    },

    addNewQC() {
      this.$emit("addNewQC");
    },
    plans() {
      this.$emit("plans");
    },
    addPoto() {
      //todo
    }
  }
};
</script>

<style scoped></style>
