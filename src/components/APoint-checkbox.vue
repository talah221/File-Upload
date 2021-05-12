<template>
  <Checkbox
    :binary="true"
    v-model="value"
    :value="modelValue"
    :disabled="!field.Enabled || field.Locked"
    @change="emitInputs()"
  />
</template>

<script>
import Checkbox from "primevue/checkbox";

export default {
  name: "APoint-checkbox",
  components: {
    Checkbox
  },
  props: {
    field: { type: Object },
    modelValue: Boolean
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: null
    };
  },
  mounted() {
    this.value = this.modelValue;
  },

  methods: {
    emitInputs() {
      this.$emit("update:modelValue", this.value);
    }
  },

  watch: {
    modelValue(newValue) {
      this.value = newValue;
    }
  }
};
// 1.	Reading order
// 2.	Control source
// 3.	Default value
// 4.	Validation rule
// 5.	Validation text
// 6.	Enabled
// 7.	Locked
// 8.	Name
// 9.	Control Tip text
// 10.	Tag
</script>

<style scoped></style>
