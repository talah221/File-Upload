<template>
  <div
    class="field p-d-flex p-ai-center p-m-4"
    v-for="($field, $i) of res.fields"
    :key="$i"
  >
    <label :for="$field.Name">{{ $field.Caption }}</label>
    <div class="p-d-flex p-flex-column" ref="" :id="$field.Name">
      <a-point-textbox
        :field="$field"
        :model-value="$field.Control_source"
        @update:model-value="$field.Control_source = $event"
        v-if="$field.apointType == 'text'"
      ></a-point-textbox>
      <a-point-checkbox
        v-if="$field.apointType == 'checkbox'"
        :field="$field"
        :model-value="$field.Control_source"
        @update:model-value="$field.Control_source = $event"
      ></a-point-checkbox>
      <a-point-dropdown
        v-if="$field.apointType == 'dropdown'"
        :field="$field"
        :model-value="$field.Control_source"
        @update:model-value="$field.Control_source = $event"
      ></a-point-dropdown>

      {{ $field.Control_source }}
      <!-- <span v-if="$field.Format == 'Long Date'">
        {{ Intl.DateTimeFormat("en-GB").format($field.Control_source) }}</span
      > -->

      <span class="error p-mt-1 p-mr-2" v-if="$field.check">
        * שדה חובה
      </span>
    </div>
  </div>
  <Button label="check" @click="checkData" />
</template>

<script>
import Button from "primevue/button";
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import APointDropdown from "./APoint-dropdown.vue";

export default {
  components: {
    Button,
    APointTextbox,
    APointCheckbox,
    APointDropdown
  },
  data() {
    return {
      res: {
        fields: [
          {
            num: 1,
            apointType: "text",
            required: true,
            Caption: "text",
            Format: "",
            ControlSource: "text value",
            Enabled: true,
            Name: "text"
          },
          {
            num: 2,
            apointType: "text",
            required: true,
            Caption: "General Date and min, max date",
            minDate: new Date(new Date().setDate(new Date().getDate() - 13)),
            maxDate: new Date(),
            manualInput: true,
            showButtonBar: true,
            Format: "General Date",
            ControlSource: "",
            Enabled: true,
            Name: "General Date"
          },
          {
            num: 3,
            apointType: "text",
            required: true,
            Caption: "Long Date",
            manualInput: true,
            showButtonBar: true,
            Format: "Long Date",
            ControlSource: "",
            Enabled: true,
            Name: "Long Date"
          },
          {
            num: 4,
            apointType: "text",
            required: true,
            Caption: "General Number",
            useGrouping: true,
            minFractionDigits: 2,
            maxFractionDigits: 3,
            min: 50,
            max: 100,
            currency: "USD", // USD, EUR, INR, JPY
            locale: "en-US", // en-US, de-DE, en-IN, jp-JP
            currencyDisplay: "symbol", // symbol, code
            Format: "General Number",
            ControlSource: 55,
            Enabled: true,
            Name: "General Number"
          },
          {
            num: 5,
            apointType: "text",
            required: true,
            Caption: "Currency",
            useGrouping: false,
            minFractionDigits: 0,
            currency: "USD", // USD, EUR, INR, JPY
            locale: "en-US", // en-US, de-DE, en-IN, jp-JP
            currencyDisplay: "symbol", // symbol, code
            Format: "Currency",
            ControlSource: "",
            Enabled: true,
            Name: "Currency"
          },
          {
            num: 6,
            apointType: "checkbox",
            required: true,
            Caption: "checkbox",
            ControlSource: true,
            Enabled: true,
            Name: "checkbox"
          },
          {
            num: 7,
            apointType: "dropdown",
            required: true,
            Caption: "dropdown",
            optionLabel: "lbl",
            optionValue: "val",
            showClear: true,
            ControlSource: 2,
            RowRource: [
              { val: 1, lbl: "option 1" },
              { val: 2, lbl: "option 2" },
              { val: 3, lbl: "option 3" }
            ],
            Enabled: true,
            Name: "dropdown"
          }
        ]
      }
    };
  },
  methods: {
    checkData() {
      this.res.fields.forEach(f => {
        if (f.required && (f.ControlSource == null || f.ControlSource == ""))
          f.check = true;
        else f.check = false;
      });
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
</style>
