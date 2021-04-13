<template>
  <div>
    <div v-if="showProjectList" class="field p-d-flex p-ai-center p-m-4">
      <label :for="projects.Name">{{ projects.Caption }}</label>
      <div class="p-d-flex p-flex-column" ref="" :id="projects.Name">
        <a-point-dropdown
          :field="projects"
          :model-value="projects.ControlSource"
          @update:model-value="projects.ControlSource = $event"
        ></a-point-dropdown>
      </div>
      <span class="error p-mt-1 p-mr-2" v-if="projects.check">
        * שדה חובה
      </span>
      <Button label="המשך" @click="chekProject"></Button>
    </div>
    <div v-else class="single_form">
      <div
        class="field p-d-flex p-ai-center p-m-4"
        v-for="(field, i) of detailsFields"
        :key="i"
      >
        <label :for="field.Name">{{ field.Caption }}</label>
        <div class="p-d-flex p-flex-column" ref="" :id="field.Name">
          <a-point-textbox
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
            v-if="field.apointType == 'text'"
          ></a-point-textbox>
          <a-point-checkbox
            v-if="field.apointType == 'checkbox'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
          ></a-point-checkbox>
          <a-point-dropdown
            v-if="field.apointType == 'dropdown'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="updateField(field, $event)"
          ></a-point-dropdown>
          <!-- {{ field.RowSource }} -->
          <span class="error p-mt-1 p-mr-2" v-if="field.check">
            * שדה חובה
          </span>
        </div>
      </div>

      <div v-if="qcMode === 'new'">
        <QualityControlAdd
          :qcDesc="description"
          :model-value="description.ControlSource"
          @updateDescription="description.ControlSource = $event"
          @saveClose="saveClose"
          :apartmentId="727"
        />
      </div>
    </div>
  </div>
</template>

<script>
//todo לשנות בקומפוונטה QualityControlAdd את הפרופס של מספר דירה
import APointTextbox from "@/components/APoint-textbox.vue";
import APointCheckbox from "@/components/APoint-checkbox.vue";
import APointDropdown from "@/components/APoint-dropdown.vue";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState } from "vuex";
import QualityControlAdd from "@/components/QualityControlAdd.vue";
import { Nz } from "../services/APointAPI";
import Button from "primevue/button";

export default {
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    Button,
    QualityControlAdd
    // Textarea
  },
  data() {
    return {
      showProjectList: true,
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
          DefaultValue: 1100,
          AllRowSource: null
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
          Name: "zone1",
          funcOnUpdate: "this.filterZone2()"
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
          Name: "zone2",
          AllRowSource: null,
          funcOnUpdate: "this.filterZone3()"
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
          Name: "zone3",
          AllRowSource: null
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
          minDate: null,
          maxDate: null,
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
        },
        {
          num: 10,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרויקט",
          optionLabel: "ProjectName",
          optionValue: "ProjectId",
          showClear: false,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "projectId"
        },
        {
          num: 11,
          apointType: "textarea",
          check: false,
          required: true,
          Caption: "תיאור",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "description"
        },
        {
          num: 12,
          apointType: "text",
          check: false,
          required: false,
          Caption: "מספר בקרה",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "quality_control_id"
        }
      ],
      qcMode: null
    };
  },
  mounted() {
    //todo get projects list by userLogin - callproc
    this.getField(10).RowSource = [
      { ProjectId: 146, ProjectName: "אדרת הכרמל" },
      { ProjectId: 102, ProjectName: "אדרת הכפר" },
      { ProjectId: 91, ProjectName: "וולפסון" }
    ];

    if (this.$route.params.id === undefined) {
      this.qcMode = "new";
      this.getField(12).ControlSource = null;
      //הצגת בחירת פרויקט רק אם למשתמש יש הרשאה על יותר מפרויקט אחד
      if (this.projects.RowSource.length === 1) {
        this.projects.ControlSource = this.projects.RowSource[0].ProjectId;
        this.showProjectList = false;
        this.getDdlData();
      } else {
        this.showProjectList = true;
      }
    } else {
      this.getDdlData();
      //todo שינוי מוד הבקרה + הבאת נתונים אם קיימת משימה
    }
  },
  methods: {
    updateField(field, value) {
      field.ControlSource = value;
      eval(field.funcOnUpdate);
    },
    checkData() {
      let flag = false;

      this.fields.forEach(f => {
        if (f.required && (f.ControlSource == null || f.ControlSource == "")) {
          f.check = true;
          flag = true;
        } else f.check = false;
      });
      //   this.$emit("checkData", flag, this.fields);
      return flag;
    },
    chekProject() {
      if (this.projects.required && Nz(this.projects.ControlSource) === 0)
        this.projects.check = true;
      else {
        this.projects.check = false;
        this.showProjectList = false;
        this.getDdlData();
      }
    },
    getDdlData() {
      // console.log("getDdlData");
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam("project_id", this.projects.ControlSource, apiPType.Int)
      ];
      callProc("pr_qc_ddl_data", procParams)
        .then(result => {
          result = JSON.parse(result);
          // console.log("pr_qc_ddl_data-result", result);
          if (result.Table.length > 0) {
            this.getField(1).AllRowSource = result.Table;
            this.getField(1).RowSource = this.getStatus();
          }
          if (result.Table1.length > 0) {
            this.getField(2).RowSource = result.Table1;
            //   this.getField(2).ControlSource =
            //     result.Table1[0].project_zones_id;
          }
          if (result.Table2.length > 0) {
            // this.getField(3).RowSource = this.filterZone2;
            this.getField(3).AllRowSource = result.Table2;
            this.filterZone2();
          }
          if (result.Table3.length > 0) {
            // this.getField(4).RowSource = this.filterZone3;
            this.getField(4).AllRowSource = result.Table3;
            // this.filterZone3();
          }

          if (result.Table4.length > 0) {
            this.getField(5).RowSource = result.Table4;
          }
          if (result.Table5.length > 0) {
            this.getField(6).RowSource = result.Table5;
          }
          if (result.Table6.length > 0) {
            this.getField(8).RowSource = result.Table6;
          }
          if (result.Table7.length > 0) {
            this.getField(9).RowSource = result.Table7;
          }
        })
        .catch(error => {
          console.log("pr_qc_ddl_data-error", error);
        });
    },
    saveClose() {
      if (this.checkData() === true) return;

      //todo במידה ונשאר סטטוס טיוטה, הוא יתחלף ל"פתוחה" בלחיצה על "שמור וסגור".
      // todo change status in vue or in sql?

      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam(
          "quality_control_id",
          this.getField(12).ControlSource,
          apiPType.Int
        ),
        apiParam("project_id", this.projects.ControlSource, apiPType.Int),
        apiParam("status_id", this.getField(1).ControlSource, apiPType.Int),
        apiParam("zone_1_id", this.getField(2).ControlSource, apiPType.Int),
        apiParam("zone_2_id ", this.getField(3).ControlSource, apiPType.Int),
        apiParam("zone_3_id ", this.getField(4).ControlSource, apiPType.Int),
        apiParam("chapter_id", this.getField(5).ControlSource, apiPType.Int),
        apiParam(
          "quality_control_desc",
          this.getField(11).ControlSource,
          apiPType.NVarChar
        ),
        apiParam(
          "responsible_id",
          this.getField(6).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "planed_date",
          this.getField(7).ControlSource,
          apiPType.SmallDateTime
        ),
        apiParam("impairment_id", this.getField(8).ControlSource, apiPType.Int),
        apiParam(
          "hardware_level_id",
          this.getField(9).ControlSource,
          apiPType.Int
        )
      ];
      console.log("pr_qc_ins_upd-procParams", procParams);
      callProc("pr_qc_ins_upd", procParams)
        .then(result => {
          result = JSON.parse(result);
          console.log("pr_qc_ins_upd-result", result);
          if (result.procReturnValue === 0) {
            this.$toast.add({
              severity: "success",
              summary: "הבקרה נוספה בהצלחה",
              detail: "",
              life: null,
              closable: true
            });

            this.$router.push({ name: "Home" });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה ביצירת בקרה - פנה לתמיכה",
              detail: "",
              life: null,
              closable: true
            });
          }
        })
        .catch(error => {
          console.log("pr_qc_ins_upd-error", error);
        });
    },
    filterZone2() {
      const zone1 = this.getField(2).ControlSource;
      let zone2 = this.getField(3);
      zone2.ControlSource = null;
      if (zone1 !== null) {
        zone2.RowSource = zone2.AllRowSource.filter(
          zone => zone.parent_id === zone1
        );
      } else {
        zone2.RowSource = null;
      }
      this.filterZone3();
    },
    filterZone3() {
      const zone2 = this.getField(3).ControlSource;
      let zone3 = this.getField(4);
      zone3.ControlSource = null;
      if (zone2 !== null) {
        zone3.RowSource = zone3.AllRowSource.filter(
          zone => zone.parent_id === zone2
        );
      } else {
        zone3.RowSource = null;
      }
    },
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    getStatus() {
      if (this.qcMode === "new") {
        return this.getField(1).AllRowSource.filter(
          status => [1100, 1107, 1108].indexOf(status.status_id) >= 0
        );
      }
      // todo הצגת סטטוסים לבחירה לפי מוד הבקרה-> עדכון ובקרה סגורה

      return this.getField(1).AllRowSource;
    }
  },
  computed: {
    detailsFields() {
      return this.fields.filter(field => field.num < 10);
    },
    description() {
      return this.getField(11);
    },
    projects() {
      return this.getField(10);
    },

    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped>
@media screen and (min-width: 896px) {
  .single_form .field {
    width: 30%;
  }
}
@media screen and (max-width: 896px) {
  .single_form .field {
    width: 49%;
  }
}
@media screen and (max-width: 600px) {
  .single_form .field {
    width: 95%;
  }
}
.single_form {
  display: flex;
  flex-wrap: wrap;
}
.single_form .field {
  margin-left: auto !important;
  margin-right: auto !important;
}
.single_form .field label {
  width: 30%;
}
.single_form .field > div {
  width: 69%;
}
.error {
  color: red;
  font-size: 11px;
}

.textarea {
  resize: none;
}
</style>
