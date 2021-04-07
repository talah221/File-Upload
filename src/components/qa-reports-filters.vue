<template>
  <div class="field p-d-flex p-ai-center p-m-4 p-flex-wrap">
    <div
      class="field p-d-flex p-ai-center p-m-4"
      v-for="($field, $i) of fields"
      :key="$i"
    >
      <label :for="$field.Name" v-if="$field.show != false">
        {{ $field.Caption }}
      </label>
      <div
        class="p-d-flex p-flex-column"
        ref=""
        :id="$field.Name"
        v-if="$field.show != false"
      >
        <a-point-textbox
          :field="$field"
          :modelValue="$field.ControlSource"
          @update:model-value="$field.ControlSource = $event"
          v-if="$field.apointType == 'text'"
        ></a-point-textbox>

        <a-point-checkbox
          v-if="$field.apointType == 'checkbox'"
          :field="$field"
          :modelValue="$field.ControlSource"
          @update:model-value="$field.ControlSource = $event"
        ></a-point-checkbox>

        <a-point-dropdown
          v-if="$field.apointType == 'dropdown'"
          :field="$field"
          :modelValue="$field.ControlSource"
          @update:model-value="$field.ControlSource = $event"
        ></a-point-dropdown>

        <SelectButton
          v-if="$field.apointType == 'selectButton'"
          v-model="$field.ControlSource"
          :options="$field.RowSource"
          :optionLabel="$field.optionLabel"
          class="ltrDir"
        />
        <span class="error p-mt-1 p-mr-2" v-if="$field.check">
          * שדה חובה
        </span>
      </div>
    </div>
  </div>
  <Button :label="showAllBtnLbl" @click="showAllFilters" />
  <Button label="הצג בקרות" @click="filterReport" />
  <Button label="נקה" @click="clearFilters" />
</template>

<script>
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import APointDropdown from "./APoint-dropdown.vue";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";

export default {
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    SelectButton,
    Button
  },
  props: {
    filters: { p: "fgdf" }
  },
  emits: ["showData"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "שם פרוייקט",
          optionLabel: "lbl",
          showClear: false,
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "פרוייקט 1" },
            { val: 2, lbl: "פרוייקט 2" },
            { val: 3, lbl: "פרוייקט 3" },
            { val: 4, lbl: "פרוייקט 4" }
          ],
          Enabled: true,
          Locked: false,
          Name: "project"
        },
        {
          num: 2,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סטטוס",
          optionLabel: "lbl",
          showClear: false,
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "סטטוס 1" },
            { val: 2, lbl: "סטטוס 2" },
            { val: 3, lbl: "סטטוס 3" },
            { val: 4, lbl: "סטטוס 4" }
          ],
          Enabled: true,
          Locked: false,
          Name: "status"
        },
        {
          num: 3,
          apointType: "selectButton",
          check: false,
          required: true,
          Caption: "הצג בקרות",
          optionLabel: "lbl",
          showClear: false,
          ControlSource: { val: 1, lbl: "מהיום" },
          RowSource: [
            { val: 2, lbl: "7 ימים אחרונים" },
            { val: 1, lbl: "מהיום" }
          ],
          Enabled: true,
          Locked: false,
          Name: "showReports"
        },
        {
          num: 4,
          apointType: "text",
          check: false,
          required: true,
          Caption: "מתאריך",
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: null,
          Enabled: true,
          Name: "fromDate"
        },
        {
          num: 5,
          apointType: "text",
          check: false,
          required: true,
          Caption: "עד תאריך",
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: null,
          Enabled: true,
          Name: "toDate"
        },
        {
          num: 6,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "בקרות בפיגור מעל",
          optionLabel: "lbl",
          showClear: false,
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "5 ימים" },
            { val: 2, lbl: "15 ימים" },
            { val: 3, lbl: "25 ימים" }
          ],
          Enabled: true,
          Locked: false,
          Name: "days"
        },
        {
          num: 7,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרק",
          optionLabel: "lbl",
          showClear: false,
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "פרק 1" },
            { val: 2, lbl: "פרק 2" },
            { val: 3, lbl: "פרק 3" }
          ],
          Enabled: true,
          Locked: false,
          Name: "chapter"
        },
        {
          num: 8,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 1",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "חלל 1: 1" },
            { val: 2, lbl: "חלל 1: 2" },
            { val: 3, lbl: "חלל 1: 3" }
          ],
          Enabled: true,
          Name: "space1"
        },
        {
          num: 9,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 2",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "חלל 2: 1" },
            { val: 2, lbl: "חלל 2: 2" },
            { val: 3, lbl: "חלל 2: 3" }
          ],
          Enabled: true,
          Name: "space2"
        },
        {
          num: 10,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 3",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "חלל 3: 1" },
            { val: 2, lbl: "חלל 3: 2" },
            { val: 3, lbl: "חלל 3: 3" }
          ],
          Enabled: true,
          Name: "space3"
        },
        {
          num: 11,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "יעד לביצוע",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "יעד לביצוע 1" },
            { val: 2, lbl: "יעד לביצוע 2" },
            { val: 3, lbl: "יעד לביצוע 3" }
          ],
          Enabled: true,
          Name: "performTarget",
          show: false,
          isHide: true
        },
        {
          num: 12,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סוג ליקוי",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "סוג ליקוי 1" },
            { val: 2, lbl: "סוג ליקוי 2" },
            { val: 3, lbl: "סוג ליקוי 3" }
          ],
          Enabled: true,
          Name: "eclipseType",
          show: false,
          isHide: true
        },
        {
          num: 13,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "רמת חומרה",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "רמת חומרה 1" },
            { val: 2, lbl: "רמת חומרה 2" },
            { val: 3, lbl: "רמת חומרה 3" }
          ],
          Enabled: true,
          Name: "stringencyLevel",
          show: false,
          isHide: true
        },
        {
          num: 14,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פותח הבקרה",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "פותח הבקרה 1" },
            { val: 2, lbl: "פותח הבקרה 2" },
            { val: 3, lbl: "פותח הבקרה 3" }
          ],
          Enabled: true,
          Name: "reportOpen",
          show: false,
          isHide: true
        },
        {
          num: 15,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סוגר הבקרה",
          optionLabel: "lbl",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [
            { val: 1, lbl: "סוגר הבקרה 1" },
            { val: 2, lbl: "סוגר הבקרה 2" },
            { val: 3, lbl: "סוגר הבקרה 3" }
          ],
          Enabled: true,
          Name: "reportClose",
          show: false,
          isHide: true
        }
      ],
      filter: {},
      showAllBtn: false,
      showAllBtnLbl: "הצג מסננים נוספים"
    };
  },
  mounted() {
    if (this.filters != undefined)
      this.fields.forEach(f => {
        if (this.filters[f.Name]) f.ControlSource = this.filters[f.Name];
      });
  },
  methods: {
    filterReport() {
      this.fields.forEach(f => {
        if (f.ControlSource != null && f.ControlSource != "")
          this.filter[f.Name] = f.ControlSource;
      });
      this.$emit("showData", this.filter);
    },
    showAllFilters() {
      if (!this.showAllBtn) {
        this.showAllBtn = true;
        this.fields.forEach(f => {
          if (!f.show) f.show = true;
        });
        this.showAllBtnLbl = "הסתר מסננים נוספים";
      } else {
        this.showAllBtn = false;
        this.fields.forEach(f => {
          if (f.isHide) f.show = false;
        });
        this.showAllBtnLbl = "הצג מסננים נוספים";
      }
    },
    clearFilters() {
      this.fields.forEach(f => {
        f.ControlSource = null;
      });
      this.filterReport();
    }
  }
};
</script>

<style lang="scss">
.error {
  color: red;
  font-size: 11px;
}
.field label {
  width: 125px;
}
.ltrDir {
  direction: ltr;
}
</style>
