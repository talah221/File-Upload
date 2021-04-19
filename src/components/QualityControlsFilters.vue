<template>
  <div calss="chipFilters">
    <Chip
      v-for="f of filterToShow"
      :key="f.num"
      :label="f.caption + ': ' + f.value"
      removable
      @remove="clearFilters(f.Name)"
    />
  </div>
  <div class="single_form">
    <div
      class="field p-d-flex p-ai-center p-m-2"
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
          @update:model-value="updateField(field, $event)"
          v-if="field.apointType == 'text'"
        ></a-point-textbox>
        <a-point-checkbox
          v-else-if="field.apointType == 'checkbox'"
          :field="field"
          :modelValue="field.ControlSource"
          @update:model-value="updateField(field, $event)"
        ></a-point-checkbox>

        <a-point-dropdown
          v-else-if="field.apointType == 'dropdown'"
          :field="field"
          :modelValue="field.ControlSource"
          @update:model-value="updateField(field, $event)"
        ></a-point-dropdown>

        <SelectButton
          v-else-if="field.apointType == 'selectButton'"
          v-model="field.ControlSource"
          :options="field.RowSource"
          :optionLabel="field.optionLabel"
          :optionValue="field.optionValue"
          class="ltrDir"
          @click="field.FuncOnUpdate"
        />
        <MultiSelect
          v-else-if="field.apointType == 'multiSelect'"
          v-model="field.ControlSource"
          :options="field.RowSource"
          :optionLabel="field.optionLabel"
          :optionValue="field.optionValue"
          display="chip"
          :filter="field.RowSource.length > 10"
          @change="field.FuncOnUpdate(field)"
        />

        <AutoComplete
          v-else-if="field.apointType === 'autoComplete'"
          v-model="field.ControlSource"
          :suggestions="field.suggestions"
          @complete="field.FuncOnComplete(field, $event)"
          @blur="field.FuncOnUpdate(field, $event)"
          @item-select="field.FuncOnUpdate(field, $event)"
        />
        <span class="error p-mt-1 p-mr-2" v-if="field.check">
          * שדה חובה
        </span>
      </div>
    </div>
  </div>

  <Button :label="showAllBtnLbl" @click="showAllFilters" />
  <Button label="הצג בקרות" @click="showQc" />
  <Button label="נקה" @click="clearFilters()" />
</template>

<script>
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import APointDropdown from "./APoint-dropdown.vue";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import MultiSelect from "primevue/multiselect";
import AutoComplete from "primevue/autocomplete";
import Chip from "primevue/chip";
import { mapState } from "vuex";

export default {
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    SelectButton,
    Button,
    MultiSelect,
    AutoComplete,
    Chip
  },
  props: {
    filters: { type: Object }
  },
  emits: ["showData", "updateFilters", "clearFilters"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "multiSelect",
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
          Name: "project_id",
          FuncOnUpdate: field => {
            this.filterZonesAndZoneTypes();
            this.setFilters(field);
          },
          type: apiPType.NVarChar
        },
        {
          num: 2,
          apointType: "multiSelect",
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
          Name: "status_id",
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },

        {
          num: 3,
          apointType: "selectButton",
          check: false,
          required: false,
          Caption: "הצג בקרות",
          optionLabel: "lbl",
          optionValue: "val",
          showClear: false,
          ControlSource: null,
          RowSource: [
            { val: 7, lbl: "7 ימים אחרונים" },
            { val: 0, lbl: "מהיום" }
          ],
          Enabled: true,
          Locked: false,
          Name: "showControls",
          FuncOnUpdate: () => this.changeDates()
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
          Name: "btwn_open_start",
          type: apiPType.SmallDateTime,
          FuncOnUpdate: field => this.setFilters(field)
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
          Name: "btwn_open_end",
          type: apiPType.SmallDateTime,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 6,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "בקרות בפיגור מעל",
          optionLabel: "Name",
          optionValue: "ID",
          showClear: true,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Locked: false,
          Name: "NotDone",
          type: apiPType.Int,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 7,
          apointType: "multiSelect",
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
          Name: "chapter_id",
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 17,
          apointType: "autoComplete",
          check: false,
          required: false,
          Caption: "סוג חלל 1",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zoneType1",
          allRowSource: [],
          suggestions: [],
          FuncOnComplete: (field, event) => {
            this.searchSuggestions(field, event);
          },
          FuncOnUpdate: (field, event) => {
            if (event.target !== undefined)
              field.ControlSource = event.target.value;
            this.setFilters(field, event);
          },
          type: apiPType.NVarChar
        },
        {
          num: 8,
          apointType: "autoComplete",
          check: false,
          required: false,
          Caption: "חלל 1",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone_1_id",
          allRowSource: [],
          suggestions: [],
          FuncOnComplete: (field, event) => {
            this.searchSuggestions(field, event);
          },
          FuncOnUpdate: (field, event) => {
            if (event.target !== undefined)
              field.ControlSource = event.target.value;
            this.setFilters(field, event);
          },
          type: apiPType.NVarChar
        },
        {
          num: 18,
          apointType: "autoComplete",
          check: false,
          required: false,
          Caption: "סוג חלל 2",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zoneType2",
          allRowSource: [],
          suggestions: [],
          FuncOnComplete: (field, event) => {
            this.searchSuggestions(field, event);
          },
          FuncOnUpdate: (field, event) => {
            if (event.target !== undefined)
              field.ControlSource = event.target.value;
            this.setFilters(field, event);
          },
          type: apiPType.NVarChar
        },
        {
          num: 9,
          apointType: "autoComplete",
          check: false,
          required: false,
          Caption: "חלל 2",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone_2_id",
          allRowSource: [],
          suggestions: [],
          FuncOnComplete: (field, event) => {
            this.searchSuggestions(field, event);
          },
          FuncOnUpdate: (field, event) => {
            if (event.target !== undefined)
              field.ControlSource = event.target.value;
            this.setFilters(field, event);
          },
          type: apiPType.NVarChar
        },
        {
          num: 10,
          apointType: "autoComplete",
          check: false,
          required: false,
          Caption: "חלל 3",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone_3_id",
          allRowSource: [],
          suggestions: [],
          FuncOnComplete: (field, event) => {
            this.searchSuggestions(field, event);
          },
          FuncOnUpdate: (field, event) => {
            if (event.target !== undefined)
              field.ControlSource = event.target.value;
            this.setFilters(field, event);
          },
          type: apiPType.NVarChar
        },
        {
          num: 11,
          apointType: "text",
          check: false,
          required: false,
          Caption: "יעד לביצוע",
          minDate: null,
          maxDate: null,
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: "",
          Enabled: true,
          Name: "planed_date",
          showIcon: true,
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 12,
          apointType: "multiSelect",
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
          Name: "impairment_id",
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 13,
          apointType: "multiSelect",
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
          Name: "hardware_level_id",
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 14,
          apointType: "multiSelect",
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
          Name: "create_by",
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 15,
          apointType: "multiSelect",
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
          Name: "user_closed",
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        },
        {
          num: 16,
          apointType: "multiSelect",
          check: false,
          required: false,
          Caption: "אחראי לביצוע",
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsible_id",
          show: false,
          isHide: true,
          type: apiPType.NVarChar,
          FuncOnUpdate: field => this.setFilters(field)
        }
      ],
      filter: {},
      showAllBtn: false,
      showAllBtnLbl: "הצג מסננים נוספים",
      displaySpinner: false
    };
  },
  mounted() {
    // this.setBasicFilters();
    this.getDdlData();
    this.setBasicFilter();
  },
  methods: {
    updateField(field, event) {
      field.ControlSource = event;
      if (field.FuncOnUpdate !== undefined)
        eval(field.FuncOnUpdate(field, event));
    },
    setFilters(field) {
      // console.log("setFilters", field);
      this.$emit("updateFilters", field);
    },
    showQc() {
      this.$emit("showData");
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
    clearFilters(fieldName) {
      // console.log("clearFilters", fieldName);
      if (fieldName === undefined) {
        this.fields.forEach(f => {
          f.ControlSource = null;
        });
      } else {
        this.fields.find(f => f.Name === fieldName).ControlSource = null;
      }
      this.$emit("clearFilters", fieldName);
    },
    changeDates() {
      const fromDate = new Date();
      const ToDate = new Date();
      this.getField(5).ControlSource = ToDate;
      this.setFilters(this.getField(5));

      fromDate.setDate(
        fromDate.getDate() + this.getField(3).ControlSource * -1
      );

      this.getField(4).ControlSource = new Date(fromDate);
      this.setFilters(this.getField(4));

      this.getField(3).ControlSource = null;
    },
    getDdlData() {
      this.$store.commit("main/setSpinner", true);

      //todo get projects list by userLogin - callproc
      this.getField(1).RowSource = [
        { ProjectId: 146, ProjectName: "אדרת הכרמל" },
        { ProjectId: 102, ProjectName: "אדרת הכפר" },
        { ProjectId: 91, ProjectName: "וולפסון" }
      ];
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      callProc("pr_qc_ddl_data", procParams)
        .then(result => {
          result = JSON.parse(result);
          // console.log("pr_qc_ddl_data-result", result);
          if (result.Table.length > 0) {
            this.getField(2).RowSource = result.Table;
          }
          if (result.Table1.length > 0) {
            this.getField(8).allRowSource = result.Table1;
            this.getField(17).allRowSource = result.Table1.map(f => ({
              zone_type_name: f.zone_type_name,
              project_id: f.project_id
            }));
          }
          if (result.Table2.length > 0) {
            this.getField(9).allRowSource = result.Table2;
            this.getField(18).allRowSource = result.Table2.map(f => ({
              zone_type_name: f.zone_type_name,
              project_id: f.project_id
            }));
          }
          if (result.Table3.length > 0) {
            this.getField(10).allRowSource = result.Table3;
          }
          if (result.Table4.length > 0) {
            this.getField(7).RowSource = result.Table4;
          }
          if (result.Table5.length > 0) {
            this.getField(16).RowSource = result.Table5;
          }
          if (result.Table6.length > 0) {
            this.getField(12).RowSource = result.Table6;
          }
          if (result.Table7.length > 0) {
            this.getField(13).RowSource = result.Table7;
          }
          if (result.Table8.length > 0) {
            this.getField(14).RowSource = result.Table8;
            this.getField(15).RowSource = result.Table8;
          }
          if (result.Table9.length > 0) {
            this.getField(6).RowSource = result.Table9;
          }
          this.filterZonesAndZoneTypes();
        })
        .catch(error => {
          console.log("pr_qc_ddl_data-error", error);
        })
        .then(() => {
          this.$store.commit("main/setSpinner", false);
        });
    },
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    filterZonesAndZoneTypes() {
      let projectIds;
      projectIds = this.getField(1).ControlSource;
      //הבאת כל הנתונים
      this.getField(8).RowSource = this.getField(8).allRowSource;
      this.getField(9).RowSource = this.getField(9).allRowSource;
      this.getField(10).RowSource = this.getField(10).allRowSource;
      this.getField(17).RowSource = this.getField(17).allRowSource;
      this.getField(18).RowSource = this.getField(18).allRowSource;
      //סינון לפי פרויקט
      if (projectIds !== null && projectIds.length > 0) {
        this.getField(8).RowSource = this.getField(8).RowSource.filter(
          z => projectIds.indexOf(z.project_id) >= 0
        );
        this.getField(9).RowSource = this.getField(9).RowSource.filter(
          z => projectIds.indexOf(z.project_id) >= 0
        );
        this.getField(10).RowSource = this.getField(10).RowSource.filter(
          z => projectIds.indexOf(z.project_id) >= 0
        );
        this.getField(17).RowSource = this.getField(17).RowSource.filter(
          z => projectIds.indexOf(z.project_id) >= 0
        );
        this.getField(18).RowSource = this.getField(18).RowSource.filter(
          z => projectIds.indexOf(z.project_id) >= 0
        );
      }
      //הבאת שם החלל בלבד בדיסטינקט ממוין
      this.getField(8).RowSource = this.getField(8)
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();

      this.getField(9).RowSource = this.getField(9)
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      this.getField(10).RowSource = this.getField(10)
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      //הבאת סוגי חללים בדיסטינקט ממוין
      this.getField(17).RowSource = this.getField(17)
        .RowSource.map(z => z.zone_type_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      this.getField(18).RowSource = this.getField(18)
        .RowSource.map(z => z.zone_type_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
    },
    searchSuggestions(field, event) {
      if (!event.query.trim().length) {
        field.suggestions = field.RowSource;
      } else {
        field.suggestions = field.RowSource.filter(elemnt => {
          return elemnt.toLowerCase().includes(event.query.toLowerCase());
        });
      }
    },

    setBasicFilter() {
      let param = this.$route.params.filter;
      this.clearFilters();
      switch (param) {
        case "myResponsibility":
          this.getField(16).ControlSource = JSON.parse("[" + this.userID + "]");
          this.setFilters(this.getField(16));
          break;
        case "ICreated":
          this.getField(14).ControlSource = JSON.parse("[" + this.userID + "]");
          this.setFilters(this.getField(14));

          break;
        default:
        // code block
      }
      this.$emit("showData");
    }
  },
  computed: {
    filterToShow() {
      return this.fields
        .filter(f => this.filters[f.Name] !== undefined)
        .map(f => {
          return {
            num: f.num,
            Name: f.Name,
            caption: f.Caption,
            value:
              f.apointType === "multiSelect"
                ? f.RowSource.filter(field => {
                    return f.ControlSource.indexOf(field[f.optionValue]) >= 0;
                  })
                    .map(fieldMap => fieldMap[f.optionLabel])
                    .toString()
                : f.apointType === "text" &&
                  f.Format === "Long Date" &&
                  Date.parse(f.ControlSource) === Date.parse(f.ControlSource)
                ? Intl.DateTimeFormat("en-GB").format(f.ControlSource)
                : f.ControlSource
          };
        });
    },
    ...mapState({ userID: state => +state.api.userID })
  },
  watch: {
    "$route.params.filter"() {
      this.setBasicFilter();
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
