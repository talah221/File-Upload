<template>
  <div class="single_form_buttons">
    <Button
      :disabled="apartmentId === 0 && !allow_edit"
      label="הוסף תכניות"
      @click="plans"
      icon="pi pi-file-pdf"
      class="p-button-info p-button-outlined"
    ></Button>
    <Button
      label="דיווח"
      @click="reporting"
      icon="pi pi-arrow-circle-up"
      class="report-btn"
      :disabled="!allow_edit"
    />
  </div>
</template>

<script>
import Button from "primevue/button";
export default {
  name: "QualityControlOpen",
  components: {
    Button
  },
  props: {
    apartmentId: {
      type: Number
    },
    allow_edit: {
      type: Boolean
    }
  },
  emits: ["plans", "reporting"],
  methods: {
    plans() {
      this.$emit("plans");
    },
    reporting() {
      this.$emit("reporting");
    }
  }
};
</script>

<style scoped>
.single_form_buttons {
  display: flex;
  justify-content: space-around;
}
</style>
<style scoped lang="scss">
.report-btn {
  background: $color--primary;
  color: white;
}
</style>
