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
      <!-- {{ $field.RowSource }} -->

      <span class="error p-mt-1 p-mr-2" v-if="$field.check">
        * שדה חובה
      </span>
    </div>
  </div>
  <!-- <Button label="check" @click="checkData" /> -->
</template>
//todo change $ in tempLATE
<script>
// import Button from "primevue/button";
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import APointDropdown from "./APoint-dropdown.vue";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState } from "vuex";

export default {
  components: {
    //  Button,
    APointTextbox,
    APointCheckbox,
    APointDropdown
  },
  props: {
    projectId: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: false,
      default: null
    },
    needCheckData: { type: Boolean }
  },
  emits: ["checkData"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סטטוס:",
          optionLabel: "status_name",
          optionValue: "status_id",
          showClear: false,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "status",
          DefaultValue: 1100
        },
        {
          num: 2,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 1:",
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
          num: 3,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 2:",
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
          num: 4,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 3:",
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
          num: 5,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרק:",
          optionLabel: "chapter_name",
          optionValue: "chapter_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "chapter"
        },
        {
          num: 6,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "אחראי לביצוע:",
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsibles"
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
          Name: "planedDate",
          showIcon: true
        },
        {
          num: 8,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סוג ליקוי:",
          optionLabel: "impairment_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "impairment"
        },
        {
          num: 9,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "רמת חומרה:",
          optionLabel: "level_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "severityLevel"
        }
      ],
      zone2RowSource: null,
      zone3RowSource: null
    };
  },
  methods: {
    checkData() {
      let flag = false;

      this.fields.forEach(f => {
        if (f.required && (f.ControlSource == null || f.ControlSource == "")) {
          f.check = true;
          flag = true;
        } else f.check = false;
      });
      this.$emit("checkData", flag, this.fields);
    },
    getDdlData() {
      console.log("getDdlData");
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam("project_id", this.projectId, apiPType.Int)
      ];
      callProc("pr_qc_ddl_data", procParams)
        .then(result => {
          result = JSON.parse(result);
          console.log("pr_qc_ddl_data-result", result);
          if (result.Table.length > 0) {
            this.fields.find(f => f.num === 1).RowSource = result.Table;
            //todo onInsert-change controlSource to draft
            // todo הצגת סטטוסים לבחירה לפי מוד הבקרה
          }
          if (result.Table1.length > 0) {
            this.fields.find(f => f.num === 2).RowSource = result.Table1;
            //   this.fields.find(f => f.num === 2).ControlSource =
            //     result.Table1[0].project_zones_id;
          }
          if (result.Table2.length > 0) {
            this.zone2RowSource = result.Table2;
            //todo לתת מקור רשומה לפי השדה המחושב
            // this.fields.find(f => f.num === 3).RowSource = this.filterZone2;
            this.fields.find(f => f.num === 3).RowSource = result.Table2;
          }
          if (result.Table3.length > 0) {
            //todo לתת מקור רשומה לפי השדה המחושב
            this.zone3RowSource = result.Table3;
            // this.fields.find(f => f.num === 4).RowSource = this.filterZone3;
            this.fields.find(f => f.num === 4).RowSource = result.Table3;
          }

          if (result.Table4.length > 0) {
            this.fields.find(f => f.num === 5).RowSource = result.Table4;
          }
          if (result.Table5.length > 0) {
            this.fields.find(f => f.num === 6).RowSource = result.Table5;
          }
          if (result.Table6.length > 0) {
            this.fields.find(f => f.num === 8).RowSource = result.Table6;
          }
          if (result.Table7.length > 0) {
            this.fields.find(f => f.num === 9).RowSource = result.Table7;
          }
        })
        .catch(error => {
          console.log("pr_qc_ddl_data-error", error);
        });
    }
  },
  mounted() {
    this.getDdlData();
  },
  computed: {
    filterZone2() {
      const zone1 = this.fields.find(f => f.num === 2).ControlSource;
      return this.zone2RowSource.filter(z => z.parent_id === zone1);
    },
    // filterZone3() {
    //   const zone2 = this.fields.find(f => f.num === 3).ControlSource;
    //   return this.zone2RowSource.filter(z => z.parent_id === zone2);
    // },
    ...mapState({ userID: state => +state.api.userID })
  },
  watch: {
    needCheckData(newValue) {
      console.log("needCheckData");
      if (newValue === true) {
        this.checkData();
      }
      // },
      // filterZone2() {
      //   this.fields.find(f => f.num === 3).RowSource = this.filterZone2;
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
