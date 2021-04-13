<template>
  <div class="field p-d-flex p-ai-center p-m-4 p-flex-wrap">
    <div
      class="field p-d-flex p-ai-center p-m-4"
      v-for="(field, i) of fields"
      :key="i"
    >
      <label :for="field.Name" v-if="field.show != false">
        {{ field.Caption }}
      </label>
      <div
        class="p-d-flex p-flex-column"
        ref=""
        :id="field.Name"
        v-if="field.show != false"
      >
        <a-point-textbox
          :field="field"
          :modelValue="field.ControlSource"
          @update:model-value="field.ControlSource = $event"
          v-if="field.apointType == 'text'"
        ></a-point-textbox>

        <a-point-checkbox
          v-if="field.apointType == 'checkbox'"
          :field="field"
          :modelValue="field.ControlSource"
          @update:model-value="field.ControlSource = $event"
        ></a-point-checkbox>

        <a-point-dropdown
          v-if="field.apointType == 'dropdown'"
          :field="field"
          :modelValue="field.ControlSource"
          @update:model-value="field.ControlSource = $event"
        ></a-point-dropdown>

        <SelectButton
          v-if="field.apointType == 'selectButton'"
          v-model="field.ControlSource"
          :options="field.RowSource"
          :optionLabel="field.optionLabel"
          class="ltrDir"
        />
        <span class="error p-mt-1 p-mr-2" v-if="field.check">
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
// import { callProc, apiParam, apiPType } from "../services/APointAPI";

export default {
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    SelectButton,
    Button
  },
  props: {
    filters: { type: Object }
  },
  emits: ["showData"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "שם פרוייקט",
          optionLabel: "ProjectName",
          optionValue: "ProjectId",
          showClear: true,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Locked: false,
          Name: "projectId"
        },
        {
          num: 2,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "סטטוס",
          optionLabel: "status_name",
          optionValue: "status_id",
          showClear: true,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Locked: false,
          Name: "status"
        },
        {
          num: 3,
          apointType: "selectButton",
          check: false,
          required: false,
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
          Name: "showControls"
        },
        {
          num: 4,
          apointType: "text",
          check: false,
          required: false,
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
          required: false,
          Caption: "עד תאריך",
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: null,
          Enabled: true,
          Name: "toDate"
        },
        {
          //todo change optionLabel,optionValue and delete rowSource values
          num: 6,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "בקרות בפיגור מעל",
          optionLabel: "lbl",
          optionValue: "",
          showClear: true,
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
          required: false,
          Caption: "פרק",
          optionLabel: "chapter_name",
          optionValue: "chapter_id",
          showClear: true,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Locked: false,
          Name: "chapter"
        },
        {
          num: 8,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "חלל 1",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone1"
        },
        {
          num: 9,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "חלל 2",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone2"
        },
        {
          num: 10,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "חלל 3",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone3"
        },
        {
          //todo change
          num: 11,
          apointType: "dropdown",
          check: false,
          required: false,
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
          Name: "planedDate",
          show: false,
          isHide: true
        },
        {
          num: 12,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "סוג ליקוי",
          optionLabel: "impairment_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "impairment",
          show: false,
          isHide: true
        },
        {
          num: 13,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "רמת חומרה",
          optionLabel: "level_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "severityLevel",
          show: false,
          isHide: true
        },
        {
          //todo change optionLabel and optionValue
          num: 14,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "פותח הבקרה",
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "createBy",
          show: false,
          isHide: true
        },
        {
          //todo change optionLabel and optionValue
          num: 15,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "סוגר הבקרה",
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "closedBy",
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
    this.getDdlData();
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
    },
    getDdlData() {
      // let procParams = [
      //   apiParam("user_exec", this.userID, apiPType.Int),
      //   apiParam("project_id", this.projectId, apiPType.Int)
      // ];
      // callProc("pr_qc_ddl_data", procParams)
      //   .then(result => {
      //     result = JSON.parse(result);
      //     // console.log("pr_qc_ddl_data-result", result);
      //     if (result.Table.length > 0) {
      //       this.fields.find(f => f.num === 1).RowSource = result.Table;
      //       // todo הצגת סטטוסים לבחירה לפי מוד הבקרה
      //     }
      //     if (result.Table1.length > 0) {
      //       this.fields.find(f => f.num === 2).RowSource = result.Table1;
      //       //   this.fields.find(f => f.num === 2).ControlSource =
      //       //     result.Table1[0].project_zones_id;
      //     }
      //     if (result.Table2.length > 0) {
      //       this.zone2RowSource = result.Table2;
      //       //todo לתת מקור רשומה לפי השדה המחושב
      //       // this.fields.find(f => f.num === 3).RowSource = this.filterZone2;
      //       this.fields.find(f => f.num === 3).RowSource = result.Table2;
      //     }
      //     if (result.Table3.length > 0) {
      //       //todo לתת מקור רשומה לפי השדה המחושב
      //       this.zone3RowSource = result.Table3;
      //       // this.fields.find(f => f.num === 4).RowSource = this.filterZone3;
      //       this.fields.find(f => f.num === 4).RowSource = result.Table3;
      //     }
      //     if (result.Table4.length > 0) {
      //       this.fields.find(f => f.num === 5).RowSource = result.Table4;
      //     }
      //     if (result.Table5.length > 0) {
      //       this.fields.find(f => f.num === 6).RowSource = result.Table5;
      //     }
      //     if (result.Table6.length > 0) {
      //       this.fields.find(f => f.num === 8).RowSource = result.Table6;
      //     }
      //     if (result.Table7.length > 0) {
      //       this.fields.find(f => f.num === 9).RowSource = result.Table7;
      //     }
      //   })
      //   .catch(error => {
      //     console.log("pr_qc_ddl_data-error", error);
      //   });
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
