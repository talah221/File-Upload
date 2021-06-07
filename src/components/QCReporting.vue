<template>
  <div class="report-container">
    <div>
      <div v-for="(field, i) of fields" :key="i" class="p-m-2">
        <div class="boldFont fieldLabel" :for="field.Name">
          {{ field.Caption }}
        </div>
        <div class="" ref="" :id="field.Name">
          <a-point-textbox
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
            v-if="field.apointType == 'text'"
          ></a-point-textbox>
          <a-point-checkbox
            v-else-if="field.apointType == 'checkbox'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
          ></a-point-checkbox>
          <a-point-dropdown
            v-else-if="field.apointType == 'dropdown'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
            style="width:100%"
          ></a-point-dropdown>
          <Textarea
            v-else-if="field.apointType == 'textarea'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="field.ControlSource = $event"
            style="resize: none; background-color: #f2f2f2; width: 100%"
          ></Textarea>
          <div
            v-else-if="field.apointType == 'radioButton'"
            v-for="f of field.RowSource"
            :key="f.optionValue"
            class="p-field-radiobutton"
          >
            <RadioButton
              :id="f[field.optionValue]"
              :name="field.Name"
              :value="f[field.optionValue]"
              v-model="field.ControlSource"
            />
            <label class="radioLabel" :for="f[field.optionValue]">{{
              f[field.optionLabel]
            }}</label>
          </div>
        </div>
        <span class="error p-mt-1 p-mr-2" v-if="field.check"> * שדה חובה </span>
      </div>
    </div>
    <div class="actions-btns">
      <Button
        class="myBtn buttonIcon"
        label="שמור וסגור"
        @click="saveClose"
        icon="pi pi-check"
      />
      <!-- <Button
        class="myBtn buttonIcon"
        label="צרף תמונות"
        @click="addPoto($event)"
        icon="pi pi-camera"
      /> -->
      <Button
        class="myBtn buttonIcon"
        label="סגור בקרה"
        @click="closeQC"
        icon="pi pi-check-circle"
        :disabled="!qualityControl.allow_close_qc"
      />
    </div>
  </div>
  <ConfirmPopup class="max-z-index" />
</template>

<script>
import RadioButton from "primevue/radiobutton";
import APointDropdown from "@/components/APoint-dropdown.vue";
import APointTextbox from "./APoint-textbox.vue";
import APointCheckbox from "./APoint-checkbox.vue";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { mapState, mapGetters } from "vuex";
import ConfirmPopup from "primevue/confirmpopup";
import { spinnerInstances, qcStatuses } from "../scripts/enums.js";
import { pr_qc_reporting_ins } from "../scripts/db.js";
export default {
  name: "QCReporting",
  components: {
    APointDropdown,
    APointTextbox,
    APointCheckbox,
    Textarea,
    RadioButton,
    Button,
    ConfirmPopup
  },
  props: {
    qualityControl: { type: Object, required: true }
  },
  emits: ["closeReporting", "addPoto"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "radioButton",
          check: false,
          required: true,
          Caption: "סטטוס חדש:",
          optionLabel: "status_name",
          optionValue: "status_id",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "status"
        },
        {
          num: 2,
          apointType: "textarea",
          check: false,
          required: true,
          Caption: "מה בוצע:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "action_performed"
        },
        {
          num: 3,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "עובר לטיפול:",
          optionLabel: "user_rank_name",
          optionValue: "rank_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsible"
        },
        {
          num: 4,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "קבלן:",
          optionLabel: "contractor_name",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "contractor_id"
        }
      ],
      fields_enum: {
        e_status: 1,
        e_action_performed: 2,
        e_responsible: 3,
        e_contractor: 4
      }
    };
  },
  mounted() {
    this.$store.commit("main/setSpinner", {
      id: spinnerInstances.e_QCReporting_loadDdl,
      flag: true
    });
    let loadData = () => {
      this.getField(
        this.fields_enum.e_status
      ).RowSource = this.getStatuses().filter(
        status =>
          status.status_id !== qcStatuses.e_draft &&
          status.status_id !== qcStatuses.e_open &&
          status.status_id !== qcStatuses.e_reminder &&
          status.status_id !== qcStatuses.e_close
      );
      this.getField(
        this.fields_enum.e_responsible
      ).RowSource = this.getResponsibles(this.qualityControl.project_id);
      this.getField(
        this.fields_enum.e_contractor
      ).RowSource = this.getContractors(this.qualityControl.project_id);
    };
    let i = 0;
    let interval = setInterval(() => {
      i++;
      // console.log("interval", i);
      if (this.isDataLoaded === false && i < 30000) return;
      clearInterval(interval);
      loadData();
      this.$store.commit("main/setSpinner", {
        id: spinnerInstances.e_QCReporting_loadDdl,
        flag: false
      });
    }, 1);

    let status;
    if (
      this.qualityControl.status_id == qcStatuses.e_open ||
      this.qualityControl.status_id === qcStatuses.e_reminder
    )
      status = qcStatuses.e_in_progress;
    else status = this.qualityControl.status_id;

    this.getField(this.fields_enum.e_status).ControlSource = status;

    this.getField(
      this.fields_enum.e_responsible
    ).ControlSource = this.qualityControl.responsible_id;
    this.getField(
      this.fields_enum.e_contractor
    ).ControlSource = this.qualityControl.contractor_id;
  },
  methods: {
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    checkData(blnCloseQc) {
      let flag = false;
      let curr_status = this.getField(this.fields_enum.e_status).ControlSource;
      this.fields.forEach(f => {
        if (
          f.required &&
          (f.ControlSource == null || f.ControlSource == "") &&
          !(
            // בסגירת בקרה שדה 'מה בוצע' אינו שדה חובה כאשר הסטטוס הוא טופל
            (
              f.num === this.fields_enum.e_action_performed &&
              blnCloseQc === true &&
              curr_status === qcStatuses.e_completed
            )
          )
        ) {
          f.check = true;
          flag = true;
        } else f.check = false;
      });
      return flag;
    },
    saveData(blnCloseQc, blnAddPoto) {
      if (this.checkData(blnCloseQc) === true) return;

      pr_qc_reporting_ins(
        this.qualityControl.quality_control_id,
        blnCloseQc === true
          ? qcStatuses.e_close
          : this.getField(this.fields_enum.e_status).ControlSource,
        this.getField(this.fields_enum.e_responsible).ControlSource,
        this.getField(this.fields_enum.e_action_performed).ControlSource,
        this.getField(this.fields_enum.e_contractor).ControlSource
      )
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            console.log("new-reporting", result);
            this.$toast.add({
              severity: "success",
              summary: "הדיווח נשמר בהצלחה",
              detail: "",
              life: 3000,
              closable: true
            });
            let updatedQC = {
              qualityControl: result.Table2[0],
              // quality_control_id: result.Table1[0].quality_control_id,
              // status_id: result.Table1[0].new_status_id,
              // responsible_id: result.Table1[0].new_responsible_id,
              // contractor_id: result.Table1[0].new_contractor_id,
              qcReport: result.Table1[0]
            };
            if (blnAddPoto) {
              this.$emit("addPoto", updatedQC);
            } else {
              this.$emit("closeReporting", updatedQC);
            }
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בעדכון דיווח- פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true
            });
            console.log(
              "pr_qc_reporting_ins-error-procReturnValue",
              result.procReturnValue
            );
          }
        })
        .catch(error => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
          console.log("pr_qc_reporting_ins-error", error);
        });
    },
    saveClose() {
      this.saveData(false);
    },
    closeQC() {
      this.saveData(true);
    },
    addPoto(event) {
      if (this.checkData() === true)
        this.$confirm.require({
          target: event.currentTarget,
          message: "לא ניתן לשמור האם לצאת ללא שמירה?",
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.$emit("addPoto");
          },
          reject: () => {
            return;
          }
        });
      else this.saveData(false, true);
    }
  },
  computed: {
    ...mapState({
      isDataLoaded: state => state.qc.isDataLoaded
    }),
    ...mapGetters({
      getStatuses: "qc/getStatuses",
      getResponsibles: "qc/getResponsibles",
      getContractors: "qc/getContractors"
    })
  },
  unmounted() {
    this.$store.commit("main/setSpinner", {
      id: spinnerInstances.e_QCReporting_loadDdl,
      flag: false
    });
  }
};
</script>

<style scoped lang="scss">
.max-z-index {
  z-index: 1200;
}
.radioLabel {
  margin-right: 5px;
}
.fieldLabel {
  margin-bottom: 5px;
}
#status {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  font-size: 16px;
}
.myBtn {
  margin-left: 10px;
}

.actions-btns {
  display: flex;
  justify-content: center;
  button {
    margin-top: 5px;
    padding: 10px;
    width: 50%;
  }
}
</style>
