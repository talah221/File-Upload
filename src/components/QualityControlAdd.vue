<template>
  <div class="buttons-control">
    <div :class="['first-buttons-section', isDesktop ? 'desktop' : '']">
      <teleport to=".newQcGridDesctop" :disabled="!isDesktop">
        <Button
          :disabled="apartmentId === 0"
          label="הוסף תכניות"
          @click="plans"
          icon="pi pi-file-pdf"
          class="p-button-info p-button-outlined buttonIcon add-plans"
        ></Button>
        <Button
          label="הוסף תמונה"
          @click="addPoto"
          icon="pi pi-camera"
          class="p-button-info p-button-outlined buttonIcon add-pic"
        ></Button>
      </teleport>
    </div>

    <div class="second-buttons-section">
      <teleport to=".newQcGridDesctop" :disabled="!isDesktop">
        <Button
          label="שמור וסגור"
          @click="saveClose"
          icon="pi pi-check"
          class="buttonIcon save-exit"
        ></Button>
        <Button
          label="בקרה חדשה"
          @click="addNewQC"
          icon="pi pi-plus-circle"
          class="buttonIcon new-qc"
        ></Button>
      </teleport>
    </div>
  </div>
</template>
<script>
import Button from "primevue/button";

export default {
  name: "QualityControlAdd",
  props: {
    apartmentId: {
      type: Number,
    },
  },
  emits: ["saveClose", "plans", "addNewQC", "addPoto"],
  components: {
    Button,
  },
  created() {
    this.isDesktop = window.innerWidth > 860;
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
    },
  },
};
</script>

<style scoped lang="scss">
.add-plans {
  margin-top: 20px;
  padding: 20px;
  grid-column: 5/-1;
  grid-row-start: 4;
  grid-row-end: 5;
  justify-content: center;
}
.add-pic {
  padding: 20px;
  grid-column: 5/-1;
  grid-row-start: 6;
  grid-row-end: 7;
  margin-top: 10px;
  justify-content: center;
}

.save-exit {
  grid-row: -1;
  grid-column: 5;
  justify-content: center;
}
.new-qc {
  justify-content: center;
  grid-row: -1;
  grid-column: 3;
  width: 30%;
  justify-self: flex-end;
}
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
    &.desktop {
      grid-column: 4;
      grid-row-start: 4;
      grid-row-end: 7;
    }
    button {
      width: 35%;
      padding: 10px;
      margin: 15px 0;
    }
  }

  .second-buttons-section {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
