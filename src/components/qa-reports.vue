<template>
  <div
    class="field p-d-flex p-ai-center p-m-4"
    v-for="($field, $i) of fields"
    :key="$i"
  >
    <label :for="$field.Name">{{ $field.Caption }}</label>
    <div class="p-d-flex p-flex-column" ref="" :id="$field.Name">
      <a-point-textbox
        :field="$field"
        :model-value="$field.ControlSource"
        @update:model-value="$field.ControlSource = $event"
        v-if="$field.apointType == 'text'"
      ></a-point-textbox>

      <a-point-checkbox
        v-if="$field.apointType == 'checkbox'"
        :field="$field"
        :model-value="$field.ControlSource"
        @update:model-value="$field.ControlSource = $event"
      ></a-point-checkbox>

      <a-point-dropdown
        v-if="$field.apointType == 'dropdown'"
        :field="$field"
        :model-value="$field.ControlSource"
        @update:model-value="$field.ControlSource = $event"
      ></a-point-dropdown>

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
  components: { Button, APointTextbox, APointCheckbox, APointDropdown },
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סטטוס:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: false,
          Format: "",
          ControlSource: 6,
          RowSource: [
            { val: 1, lbl: "פתיחה" },
            { val: 2, lbl: "פתוחה" },
            { val: 3, lbl: "בטיפול" },
            { val: 4, lbl: "טופלה" },
            { val: 5, lbl: "סגורה" },
            { val: 6, lbl: "בוטלה" },
            { val: 7, lbl: "תזכורת" },
            { val: 8, lbl: "מצב קיים" }
          ],
          Enabled: false,
          Name: "dropdown"
        },
        {
          num: 2,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 1:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 2,
          RowSource: [
            { val: 1, lbl: "חלל 1: 1" },
            { val: 2, lbl: "חלל 1: 2" },
            { val: 3, lbl: "חלל 1: 3" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 3,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 2:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 1,
          RowSource: [
            { val: 1, lbl: "חלל 2: 1" },
            { val: 2, lbl: "חלל 2: 2" },
            { val: 3, lbl: "חלל 2: 3" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 4,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 3:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 2,
          RowSource: [
            { val: 1, lbl: "חלל 3: 1" },
            { val: 2, lbl: "חלל 3: 2" },
            { val: 3, lbl: "חלל 3: 3" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 5,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרק:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 3,
          RowSource: [
            { val: 1, lbl: "פרק 1" },
            { val: 2, lbl: "פרק 2" },
            { val: 3, lbl: "פרק 3" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 6,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "אחראי לביצוע:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 1,
          RowSource: [
            { val: 1, lbl: "אחראי לביצוע 1" },
            { val: 2, lbl: "אחראי לביצוע 2" },
            { val: 3, lbl: "אחראי לביצוע 3" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 7,
          apointType: "text",
          check: false,
          required: true,
          Caption: "יעד לביצוע:",
          minDate: "",
          maxDate: "",
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: "",
          Enabled: true,
          Name: "Long Date"
        },
        {
          num: 8,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סוג ליקוי:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 2,
          RowSource: [
            { val: 1, lbl: "ביצוע ליקוי" },
            { val: 2, lbl: "תאום תכנון" },
            { val: 3, lbl: "ביצוע בחומר לא תקין" }
          ],
          Enabled: true,
          Name: "dropdown"
        },
        {
          num: 9,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "רמת חומרה:",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: true,
          Format: "",
          ControlSource: 1,
          RowSource: [
            { val: 1, lbl: "ויזואלי" },
            { val: 2, lbl: "מהותי" },
            { val: 3, lbl: "אינו תואם מפרט" },
            { val: 4, lbl: "אינו תואם תכניות" }
          ],
          Enabled: true,
          Name: "dropdown"
        }
      ]
    };
  },
  methods: {
    checkData() {
      this.fields.forEach(f => {
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
