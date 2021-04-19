<template>
  <div>
    <div class="single_form">
      <div
        v-for="(field, i) of fields"
        :key="i"
        class="field p-d-flex p-ai-center p-m-2"
      >
        <label :for="field.Name">{{ field.Caption }}</label>
        <div class="p-d-flex p-flex-column" ref="" :id="field.Name">
          <a-point-dropdown
            v-if="field.apointType == 'dropdown'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="updateField(field, $event)"
          ></a-point-dropdown>
          <Textarea
            v-else-if="field.apointType == 'textarea'"
            :field="field"
            :model-value="field.ControlSource"
            @update:model-value="updateField(field, $event)"
            style="resize:none"
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
            <label :for="f[field.optionValue]">{{
              f[field.optionLabel]
            }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";
import APointDropdown from "@/components/APoint-dropdown.vue";
import Textarea from "primevue/textarea";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState } from "vuex";

export default {
  components: {
    APointDropdown,
    Textarea,
    RadioButton
  },
  props: {
    qc_id: { type: Number, required: true }
  },
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "radioButton",
          check: false,
          required: true,
          Caption: "סטטוס:",
          optionLabel: "status_name",
          optionValue: "status_id",
          ControlSource: null,
          RowSource: [
            {
              status_id: 1100,
              status_name: "טיוטה"
            },
            {
              status_id: 1101,
              status_name: "פתוח"
            }
          ],
          Enabled: true,
          Name: "status"
        },
        {
          num: 2,
          apointType: "textarea",
          check: false,
          required: true,
          Caption: "מה בוצע",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "remarks"
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
          Name: "responsibles"
        }
      ],
      fields_enum: {
        e_status: 1,
        e_remarks: 2,
        e_responsibles: 3
      }
    };
  },
  mounted() {
    let procParams = [
      apiParam("user_exec", this.userID, apiPType.Int),
      apiParam("quality_control_id", this.qc_id, apiPType.Int)
    ];
    callProc("pr_qc_select", procParams)
      .then(result => {
        result = JSON.parse(result);
        if (result.procReturnValue === 0) {
          this.getField(this.fields_enum.e_status).ControlSource =
            result.Table[0].status_id;
          this.getField(this.fields_enum.e_remarks).ControlSource =
            result.Table[0].quality_control_remarks;
          this.getField(this.fields_enum.e_responsibles).ControlSource =
            result.Table[0].responsible_id;
        } else {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בהבאת נתונים- פנה לתמיכה",
            detail: "",
            life: null,
            closable: true
          });
          console.log(
            "pr_qc_select-error-procReturnValue",
            result.procReturnValue
          );
        }
      })
      .catch(error => {
        this.$toast.add({
          severity: "error",
          summary: "שגיאה - פנה לתמיכה",
          detail: error,
          life: null,
          closable: true
        });
        console.log("pr_qc_select-error", error);
      });
  },
  methods: {
    getField(num) {
      return this.fields.find(f => f.num === num);
    }
  },
  computed: {
    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped></style>
