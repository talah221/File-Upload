<template>
  <InputText
    type="text"
    v-if="field.Format == ''"
    :disabled="!field.Enabled || field.Locked"
    @input="emitInputs($event.target.value)"
    :value="modelValue"
  />
  <Calendar
    v-if="date"
    :dateFormat="date.primeVue"
    :minDate="field.minDate"
    :maxDate="field.maxDate"
    :manualInput="field.manualInput"
    :disabled="!field.Enabled || field.Locked"
    :showButtonBar="field.showButtonBar"
    @date-select="emitInputs($event)"
    @change="emitInputs($event.target.value)"
    @clear-click="emitInputs($event.target.value)"
    :value="modelValue"
    v-model="value"
    :showIcon="field.showIcon"
  />
  <InputNumber
    v-if="number"
    :mode="number.primeVue"
    :useGrouping="field.useGrouping"
    :disabled="!field.Enabled || field.Locked"
    @input="emitInputs($event.value)"
    :value="modelValue"
    :minFractionDigits="field.minFractionDigits"
    :maxFractionDigits="field.maxFractionDigits"
    :min="field.min"
    :max="field.max"
    :currency="field.currency"
    :locale="field.locale"
    :currencyDisplay="field.currencyDisplay"
    :suffix="field.suffix"
    :prefix="field.prefix"
  />
</template>

<script>
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import formats from "@/scripts/accsessAndPrimevueFormats";

export default {
  components: {
    Calendar,
    InputNumber,
    InputText
  },
  props: {
    field: {},
    modelValue: String
  },
  emits: ["update:modelValue"],
  computed: {
    date() {
      return formats.dateFormats.find(f => this.field.Format == f.access);
    },
    number() {
      return formats.numberFormats.find(f => this.field.Format == f.access);
    },
    value() {
      return this.modelValue;
    }
  },
  methods: {
    emitInputs(value) {
      this.$emit("update:modelValue", value);
    }
  }
};
// 1.	Format
// 2.	Text align
// 3.	Is hyperlink
// 4.	Display as hyperlink
// 5.	Hyperlink target
// 6.	Reading order
// 7.	Control source
// 8.	Text format
// 9.	Input mask
// 10.	Default value
// 11.	Validation rule
// 12.	Validation text
// 13.	Enabled
// 14.	Locked
// 15.	Name
// 16.	Control Tip text
// 17.	Tag
</script>

<style scoped></style>
