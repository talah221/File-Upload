<template>
  <div class="p-d-flex p-ai-center p-jc-end" style="width: 97%">
    <Button
      class="p-m-2"
      icon="pi pi-filter"
      label="הצג בקרות"
      @click="showQc"
    />
    <Button
      class="p-m-2"
      icon="pi pi-filter-slash"
      label="נקה"
      @click="clearFilters()"
    />
  </div>
  <div class="chipFilters">
    <Chip
      v-for="f of filterToShow"
      :key="f.num"
      :label="f.caption + ': ' + f.value + ' '"
      removable
      @remove="clearFilters(f.Name)"
    />
  </div>
  <div class="p-d-flex p-ai-center p-jc-center p-mb-4 p-mt-4">
    <SelectButton
      v-model="showControls.ControlSource"
      :options="showControls.RowSource"
      :optionLabel="showControls.optionLabel"
      :optionValue="showControls.optionValue"
      class="ltrDir"
      @click="changeDates()"
    />
  </div>
  <div class="single_form">
    <div
      class="field p-d-flex p-ai-center"
      v-for="(field, i) of fields"
      :key="i"
    >
      <label :for="field.Name" v-if="field.show != false">
        {{ field.Caption }}
      </label>
      <div
        class="p-d-flex p-flex-column p-mb-2 p-mt-2"
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

        <MultiSelect
          v-else-if="field.apointType == 'multiSelect'"
          v-model="field.ControlSource"
          :options="field.RowSource"
          :optionLabel="field.optionLabel"
          :optionValue="field.optionValue"
          display="chip"
          :filter="
            field.RowSource !== null &&
              field.RowSource !== undefined &&
              field.RowSource.length > 10
          "
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
  <div class=" p-d-flex p-flex-column p-ai-center">
    <Button
      class="p-mt-4 p-button-link"
      :icon="showAllBtnIcon"
      :label="showAllBtnLbl"
      @click="showAllFilters"
    />
  </div>
</template>

<script>
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import APointDropdown from "./APoint-dropdown.vue";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";
import { apiPType } from "../services/APointAPI";
import MultiSelect from "primevue/multiselect";
import AutoComplete from "primevue/autocomplete";
import Chip from "primevue/chip";
import { mapState, mapGetters } from "vuex";

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
    // todo בדיקות תקינות על תאריכים
    return {
      showControls: {
        optionLabel: "lbl",
        optionValue: "val",
        ControlSource: null,
        RowSource: [
          { val: 7, lbl: "בקרות מהשבוע האחרון" },
          { val: 0, lbl: "בקרות מהיום" }
        ]
      },
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
        // {
        //   num: 3,
        //   apointType: "selectButton",
        //   check: false,
        //   required: false,
        //   Caption: "הצג בקרות",
        // optionLabel: "lbl",
        // optionValue: "val",
        // showClear: false,
        // ControlSource: null,
        // RowSource: [
        //   { val: 7, lbl: "7 ימים אחרונים" },
        //   { val: 0, lbl: "מהיום" }
        // ],
        //   Enabled: true,
        //   Locked: false,
        //   Name: "showControls",
        //   FuncOnUpdate: () => this.changeDates()
        // },
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
      showAllBtnIcon: "pi pi-chevron-down",
      displaySpinner: false,
      fields_enum: {
        e_projectId: 1,
        e_status: 2,
        e_showControls: 3,
        e_fromDate: 4,
        e_toDate: 5,
        e_notDone: 6,
        e_chapter: 7,
        e_zone1: 8,
        e_zone2: 9,
        e_zone3: 10,
        e_planed_date: 11,
        e_impairment: 12,
        e_hardware_level: 13,
        e_createBy: 14,
        e_userClosed: 15,
        e_responsible: 16,
        e_zoneType1: 17,
        e_zoneType2: 18
      }
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
        this.showAllBtnIcon = "pi pi-chevron-up";
      } else {
        this.showAllBtn = false;
        this.fields.forEach(f => {
          if (f.isHide) f.show = false;
        });
        this.showAllBtnLbl = "הצג מסננים נוספים";
        this.showAllBtnIcon = "pi pi-chevron-down";
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
      this.getField(this.fields_enum.e_toDate).ControlSource = ToDate;
      this.setFilters(this.getField(this.fields_enum.e_toDate));

      fromDate.setDate(
        fromDate.getDate() + this.showControls.ControlSource * -1
      );

      this.getField(this.fields_enum.e_fromDate).ControlSource = new Date(
        fromDate
      );
      this.setFilters(this.getField(this.fields_enum.e_fromDate));

      this.showControls.ControlSource = null;
    },

    getDdlData() {
      this.$store.commit("main/setSpinner", true);
      let loadData = () => {
        //todo get projects list by userLogin - callproc
        this.getField(this.fields_enum.e_projectId).RowSource = [
          { ProjectId: 146, ProjectName: "אדרת הכרמל" },
          { ProjectId: 102, ProjectName: "אדרת הכפר" },
          { ProjectId: 91, ProjectName: "וולפסון" }
        ];

        this.getField(this.fields_enum.e_status).RowSource = this.getStatuses();
        this.getField(this.fields_enum.e_zone1).allRowSource = this.getZone1();
        this.getField(
          this.fields_enum.e_zoneType1
        ).allRowSource = this.getZone1().map(f => ({
          zone_type_name: f.zone_type_name,
          project_id: f.project_id
        }));
        this.getField(this.fields_enum.e_zone2).allRowSource = this.getZone2();
        this.getField(
          this.fields_enum.e_zoneType2
        ).allRowSource = this.getZone2().map(f => ({
          zone_type_name: f.zone_type_name,
          project_id: f.project_id
        }));
        this.getField(
          this.fields_enum.e_chapter
        ).RowSource = this.getChapters();
        this.getField(this.fields_enum.e_zone3).allRowSource = this.getZone3();

        this.getField(
          this.fields_enum.e_responsible
        ).RowSource = this.getResponsibles();
        this.getField(
          this.fields_enum.e_impairment
        ).RowSource = this.getImpairment();
        this.getField(
          this.fields_enum.e_hardware_level
        ).RowSource = this.getHardwareLevel();
        this.getField(
          this.fields_enum.e_createBy
        ).RowSource = this.getAllUsers();
        this.getField(
          this.fields_enum.e_userClosed
        ).RowSource = this.getAllUsers();
        this.getField(this.fields_enum.e_notDone).RowSource = this.getNotDone();
        this.filterZonesAndZoneTypes();
      };
      let i = 0;
      let interval = setInterval(() => {
        i++;
        // console.log("interval", i);
        if (this.isDataLoaded === false && i < 30000) return;
        clearInterval(interval);
        loadData();
        this.$store.commit("main/setSpinner", false);
      }, 1);
    },
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    filterZonesAndZoneTypes() {
      let projectIds;
      projectIds = this.getField(this.fields_enum.e_projectId).ControlSource;
      //הבאת כל הנתונים
      this.getField(this.fields_enum.e_zone1).RowSource = this.getField(
        this.fields_enum.e_zone1
      ).allRowSource;
      this.getField(this.fields_enum.e_zone2).RowSource = this.getField(
        this.fields_enum.e_zone2
      ).allRowSource;
      this.getField(this.fields_enum.e_zone3).RowSource = this.getField(
        this.fields_enum.e_zone3
      ).allRowSource;
      this.getField(this.fields_enum.e_zoneType1).RowSource = this.getField(
        this.fields_enum.e_zoneType1
      ).allRowSource;
      this.getField(this.fields_enum.e_zoneType2).RowSource = this.getField(
        this.fields_enum.e_zoneType2
      ).allRowSource;
      //סינון לפי פרויקט
      if (projectIds !== null && projectIds.length > 0) {
        this.getField(this.fields_enum.e_zone1).RowSource = this.getField(
          this.fields_enum.e_zone1
        ).RowSource.filter(z => projectIds.indexOf(z.project_id) >= 0);
        this.getField(this.fields_enum.e_zone2).RowSource = this.getField(
          this.fields_enum.e_zone2
        ).RowSource.filter(z => projectIds.indexOf(z.project_id) >= 0);
        this.getField(this.fields_enum.e_zone3).RowSource = this.getField(
          this.fields_enum.e_zone3
        ).RowSource.filter(z => projectIds.indexOf(z.project_id) >= 0);
        this.getField(this.fields_enum.e_zoneType1).RowSource = this.getField(
          this.fields_enum.e_zoneType1
        ).RowSource.filter(z => projectIds.indexOf(z.project_id) >= 0);
        this.getField(this.fields_enum.e_zoneType2).RowSource = this.getField(
          this.fields_enum.e_zoneType2
        ).RowSource.filter(z => projectIds.indexOf(z.project_id) >= 0);
      }
      //הבאת שם החלל בלבד בדיסטינקט ממוין
      this.getField(this.fields_enum.e_zone1).RowSource = this.getField(
        this.fields_enum.e_zone1
      )
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();

      this.getField(this.fields_enum.e_zone2).RowSource = this.getField(
        this.fields_enum.e_zone2
      )
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      this.getField(this.fields_enum.e_zone3).RowSource = this.getField(
        this.fields_enum.e_zone3
      )
        .RowSource.map(z => z.project_zone_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      //הבאת סוגי חללים בדיסטינקט ממוין
      this.getField(this.fields_enum.e_zoneType1).RowSource = this.getField(
        this.fields_enum.e_zoneType1
      )
        .RowSource.map(z => z.zone_type_name)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        })
        .sort();
      this.getField(this.fields_enum.e_zoneType2).RowSource = this.getField(
        this.fields_enum.e_zoneType2
      )
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
          this.getField(
            this.fields_enum.e_responsible
          ).ControlSource = JSON.parse("[" + this.userID + "]");
          this.setFilters(this.getField(this.fields_enum.e_responsible));
          break;
        case "ICreated":
          this.getField(this.fields_enum.e_createBy).ControlSource = JSON.parse(
            "[" + this.userID + "]"
          );
          this.setFilters(this.getField(this.fields_enum.e_createBy));

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
    ...mapState({
      userID: state => +state.api.userID,
      isDataLoaded: state => state.qc.isDataLoaded
    }),
    ...mapGetters({
      getStatuses: "qc/getStatuses",
      getZone1: "qc/getZone1",
      getZone2: "qc/getZone2",
      getZone3: "qc/getZone3",
      getChapters: "qc/getChapters",
      getResponsibles: "qc/getResponsibles",
      getImpairment: "qc/getImpairment",
      getHardwareLevel: "qc/getHardwareLevel",
      getAllUsers: "qc/getAllUsers",
      getNotDone: "qc/getNotDone"
    })
  },
  watch: {
    "$route.params.filter"() {
      this.setBasicFilter();
    }
  }
};
</script>

<style>
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
