<template>
  <div class="buttons-control">
    <div class="first-buttons-section">
      <Button
        :disabled="apartmentId === 0"
        label="תוכניות"
        @click="plans"
        icon="pi pi-file-pdf"
        class="p-button-info p-button-outlined"
      ></Button>
      <Button
        label="הוסף תמונה"
        @click="addPoto"
        icon="pi pi-camera"
        class="p-button-info p-button-outlined"
      ></Button>
    </div>
    <div class="second-buttons-section">
      <Button label="שמור וסגור" @click="saveClose" icon="pi pi-check"></Button>
      <Button
        label="בקרה חדשה"
        @click="addNewQC"
        icon="pi pi-plus-circle"
      ></Button>
    </div>
  </div>
</template>
<script>
import Button from "primevue/button";

export default {
  name: "QualityControlAdd",
  props: {
    apartmentId: {
      type: Number
    }
  },
  emits: ["saveClose", "plans", "addNewQC", "addPoto"],
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
      this.$emit("addPoto");
    }
  }
};
</script>

<style scoped lang="scss">
.buttons-control {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 0 10px;
  button {
    font-size: 14px;
    padding: 10px;
  }
  .first-buttons-section {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 0 35px;
    button {
      width: 35%;
      padding: 10px;
      margin-bottom: 10px;
    }
  }

  .second-buttons-section {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
