<template>
  <Dropdown
    v-model="value"
    :value="modelValue"
    :options="field.RowSource"
    :optionLabel="field.optionLabel"
    :optionValue="field.optionValue"
    :showClear="field.showClear"
    :disabled="!field.Enabled || field.Locked"
    @change="emitInputs($event.value)"
  />
</template>

<script>
import Dropdown from "primevue/dropdown";
//todo לטפל באזהרות שיש לאחר שינוי נתונן

export default {
  components: {
    Dropdown
  },
  props: {
    field: {},
    modelValue: String
  },
  emits: ["update:modelValue"],
  computed: {
    value() {
      return this.modelValue;
    }
  },
  methods: {
    emitInputs(event) {
      this.$emit("update:modelValue", event);
    }
  },
  mounted() {
    //TODO לוודא שעובד
    if (
      this.field.DefaultValue !== undefined &&
      (this.modelValue !== undefined || this.modelValue !== null)
    )
      this.value = this.field.DefaultValue;
    // console.log("mounted dropdown", this.value, this.field.DefaultValue);
  }
};
// 1.	Format
// 2.	Column count
// 3.	Text align
// 4.	Is hyperlink
// 5.	Display as hyperlink
// 6.	Reading order
// 7.	Control source
// 8.	Row source
// 9.	Row source type
// 10.	Bound column
// 11.	Limit to list
// 12.	Auto expand (השלמה אוטומטית)
// 13.	Input mask
// 14.	Default value
// 15.	Validation rule
// 16.	Validation text
// 17.	Enabled
// 18.	Locked
// 19.	Name
// 20.	Control Tip text
// 21.	Tag
</script>

<style scoped></style>
