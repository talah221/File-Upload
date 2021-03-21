<template>
  <div
    class="field p-d-flex p-ai-center p-m-4"
    v-for="($field, $i) of fields"
    :key="$i"
  >
    <label :for="$field.id">{{ $field.label }}</label>
    <div class="p-d-flex p-flex-column">
      <InputText
        :id="$field.id"
        type="text"
        v-model="$field.value"
        v-if="$field.type == 'text'"
        :class="$field.class"
        :disabled="$field.disable"
      />
      <Calendar
        :id="$field.id"
        v-model="$field.value"
        v-if="$field.type == 'calander'"
        :minDate="new Date(new Date().setMonth(new Date().getMonth() - 3))"
        :maxDate="new Date()"
        :class="$field.class"
        :manualInput="false"
        :disabled="$field.disable"
        @blur="blurInput($field.id, $event.target.value)"
      />
      <InputNumber
        :id="$field.id"
        v-model="$field.value"
        mode="decimal"
        :minFractionDigits="$field.id != 'SupplierBill' ? 2 : 0"
        v-if="$field.type == 'number'"
        :class="$field.class"
        :disabled="$field.disable"
        @blur="blurInput($field.id, $event.target.value)"
        :useGrouping="$field.id != 'SupplierBill'"
      />
      <Dropdown
        :id="$field.id"
        v-if="$field.type == 'dropdown'"
        v-model="$field.value"
        :options="$field.options"
        :optionLabel="$field.optionLabel"
        :optionValue="$field.optionValue"
        :showClear="true"
        @change="changeContractor"
      />
      <span class="error p-mt-1 p-mr-2" v-if="$field.check">
        * שדה חובה
      </span>
    </div>
  </div>
</template>

<script>
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

export default {
  components: {
    Calendar,
    InputNumber,
    InputText,
    Dropdown
  },
  data() {
    return {
      fields: [
        {
          id: "",
          label: "סטטוס:",
          disable: true,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "חלל 1:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "חלל 2:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "חלל 3:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "פרק:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "אחראי לביצוע:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "יעד לביצוע:",
          disable: false,
          value: null,
          type: "calander",
          class: "",
          check: null,
          required: true
        },
        {
          id: "",
          label: "סוג ליקוי:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        },
        {
          id: "",
          label: "רמת חומרה:",
          disable: false,
          value: null,
          type: "dropdown",
          class: "",
          check: null,
          required: true,
          options: null,
          optionLabel: "",
          optionValue: ""
        }
      ]
    };
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
</style>
