<template>
  <div class="single_form_buttons">
    <Button
      :disabled="apartmentId === 0"
      label="תוכניות"
      @click="plans"
      icon="pi pi-file-pdf"
    ></Button>
    <Button label="דיווח" @click="reporting" />
  </div>
</template>

<script>
import Button from "primevue/button";
//todo add icon to reporting
export default {
  name: "QualityControlOpen",
  components: {
    Button
  },
  props: {
    quality_control_id: {
      type: Number,
      require: true
    },
    apartmentId: {
      type: Number
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
.single_form_buttons{
  display: flex;
  justify-content: space-around;
}</style>
