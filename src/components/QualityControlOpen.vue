<template>
  <div>
    <Button
      :disabled="apartmentId === 0 && !allow_edit"
      label="הוסף תכניות"
      @click="plans"
      icon="pi pi-file-pdf"
      class="p-button-info p-button-outlined p-button-sm p-ml-2"
    ></Button>
    <Button
      label="הוסף דיווח"
      @click="reporting"
      class="p-button-sm report-btn"
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

<style scoped></style>
<style scoped lang="scss">
.report-btn {
  background: $color--primary;
  color: white;
}
</style>
