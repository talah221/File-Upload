<template>
  <div class="single_form_buttons">
    <Button label="תוכניות" @click="plans" icon="pi pi-file-pdf"></Button>
    <Button label="הוסף תמונה" @click="addPoto" icon="pi pi-camera"></Button>
    <Button label="שמור וסגור" @click="saveClose" icon="pi pi-check"></Button>
    <Button label="בקרה חדשה" @click="addQC" icon="pi pi-plus-circle"></Button>
  </div>
  {{ apartmentId }}
  <Dialog v-model:visible="displayPlans" modal>
    <div>
      <SelectPlan :apartmentId="apartmentId"></SelectPlan>
    </div>
  </Dialog>
  <Toast position="bottom-right" />
</template>
<script>
//todo לשנות את קומפוננטת בחירת תוכנית לאבא
//todo לאחר שבחרו תוכנית יש לפתוח את קומפוננטת עיכת תוכנית גם כן בדיילוג
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import SelectPlan from "./SelectPlan.vue";

export default {
  name: "QualityControlAdd",
  props: {
    modelValue: {},
    apartmentId: {
      type: Number
    }
  },
  emits: ["saveClose"],
  components: {
    Button,
    Dialog,
    SelectPlan
  },
  data() {
    return {
      displayPlans: false
    };
  },
  methods: {
    saveClose() {
      this.$emit("saveClose");
    },

    addQC() {
      //todo
    },
    plans() {
      //todo
      this.displayPlans = true;
    },
    addPoto() {
      //todo
    }
  }
};
</script>

<style scoped></style>
