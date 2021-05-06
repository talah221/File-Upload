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
        class="myBtn"
        label="שמור וסגור"
        @click="saveClose"
        icon="pi pi-check"
      />
      <Button
        class="myBtn"
        label="צרף תמונות"
        @click="addPoto($event)"
        icon="pi pi-camera"
      />
      <Button
        class="myBtn"
        label="סגור בקרה"
        @click="closeQC"
        icon="pi pi-check-circle"
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
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState, mapGetters } from "vuex";
import ConfirmPopup from "primevue/confirmpopup";
import { qcStatuses } from "../scripts/enums.js";
import { spinnerInstances } from "../scripts/enums.js";

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
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsible"
        }
      ],
      fields_enum: {
        e_status: 1,
        e_action_performed: 2,
        e_responsible: 3
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
          status.status_id !== qcStatuses.e_close
      );
      this.getField(
        this.fields_enum.e_responsible
      ).RowSource = this.getResponsibles();
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

    this.getField(
      this.fields_enum.e_status
    ).ControlSource = this.qualityControl.status_id;
    this.getField(
      this.fields_enum.e_responsible
    ).ControlSource = this.qualityControl.responsible_id;
  },
  methods: {
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    checkData() {
      let flag = false;

      this.fields.forEach(f => {
        if (f.required && (f.ControlSource == null || f.ControlSource == "")) {
          f.check = true;
          flag = true;
        } else f.check = false;
      });
      return flag;
    },
    saveData(blnCloseQc, blnAddPoto) {
      if (this.checkData() === true) return;
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam(
          "quality_control_id",
          this.qualityControl.quality_control_id,
          apiPType.Int
        ),
        apiParam(
          "status_id",
          blnCloseQc === true
            ? qcStatuses.e_close
            : this.getField(this.fields_enum.e_status).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "responsible_id",
          this.getField(this.fields_enum.e_responsible).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "action_performed",
          this.getField(this.fields_enum.e_action_performed).ControlSource,
          apiPType.NVarChar
        )
      ];
      callProc("pr_qc_reporting_ins", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.$toast.add({
              severity: "success",
              summary: "הדיווח נשמר בהצלחה",
              detail: "",
              life: 3000,
              closable: true
            });
            let updatedQC = {
              quality_control_id: this.qualityControl.quality_control_id,
              status_id:
                blnCloseQc === true
                  ? qcStatuses.e_close
                  : this.getField(this.fields_enum.e_status).ControlSource,
              responsible_id: this.getField(this.fields_enum.e_responsible)
                .ControlSource
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
      // let dataChanged = false;
      // if (
      //   this.getField(this.fields_enum.e_status).ControlSource !==
      //   this.qualityControl.status_id
      // )
      //   dataChanged = true;
      // else if (
      //   this.getField(this.fields_enum.e_responsible).ControlSource !==
      //   this.qualityControl.responsible_id
      // )
      //   dataChanged = true;
      // else if (
      //   this.getField(this.fields_enum.e_responsible).ControlSource !== null
      // )
      //   dataChanged = true;
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
      userID: state => +state.api.userID,
      isDataLoaded: state => state.qc.isDataLoaded
    }),
    ...mapGetters({
      getStatuses: "qc/getStatuses",
      getResponsibles: "qc/getResponsibles"
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
  }
}
</style>
