<template>
  <div>
    <!-- <div v-else> -->
    <label :for="qcDesc.Name">{{ qcDesc.Caption }}</label>
    <Textarea
      v-model="value"
      :name="qcDesc.Name"
      class="textarea"
      @input="emitValue($event.target.value)"
    />
    <span class="error p-mt-1 p-mr-2" v-if="qcDesc.check">
      * שדה חובה
    </span>
    <Button label="שמור וסגור" @click="saveClose"></Button>
    <Button label="בקרה חדשה" @click="addQC"></Button>
    <Button label="תוכניות" @click="plans"></Button>
    <Button label="" @click="addPoto" icon="pi pi-camera"></Button>
    <!-- </div> -->
  </div>
  {{ apartmentId }}
  <Dialog v-model:visible="displayPlans" modal>
    <div>
      <SelectPlan :apartmentId="apartmentId"></SelectPlan>
    </div>
    //todo לשנות גובה של הדיילוג
  </Dialog>
  <Toast position="bottom-right" />
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import SelectPlan from "./SelectPlan.vue";

export default {
  name: "QualityControlAdd",
  props: {
    qcDesc: {
      type: Object,
      required: true
    },
    modelValue: {},
    apartmentId: {
      type: Number
    }
  },
  emits: ["updateDescription", "saveClose"],
  components: {
    Button,
    Textarea,
    Dialog,
    SelectPlan
  },
  data() {
    return {
      value: null,
      displayPlans: false
    };
  },
  methods: {
    emitValue(value) {
      this.value = value;
      this.$emit("updateDescription", value);
    },

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
  },
  mounted() {
    this.value = this.modelValue;
  },
  computed: {
    ...mapState({ userID: state => +state.api.userID })
  },
  watch: {
    modelValue(newValue) {
      this.value = newValue;
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 11px;
}
.field label {
  width: 125px;
}
.textarea {
  resize: none;
}
</style>
