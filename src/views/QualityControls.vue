<template>
  <div>
    <div v-show="displayFilters">
      <QualityControlsFilters
        @showData="setFilters"
        :filters="filters"
        @updateFilters="updateFilters"
        @clearFilters="clearFilters"
      />
    </div>
    <div v-show="!displayFilters">
      <div class="p-d-flex p-ai-center p-jc-end" style="width: 97%">
        <Button label="סינונים" @click="showFilters" icon="pi pi-filter" />
      </div>
      <div class="controls">
        <div
          v-for="qc of qualityControls"
          :key="qc.quality_control_id"
          class="qc"
        >
          <div>
            <div>
              ב&nbsp;{{ qc.quality_control_id }} - {{ qc.formattedCreate_date }}
            </div>
            <div>
              {{ qc.project_zone1_name }} - {{ qc.project_zone2_name }} -
              {{ qc.project_zone3_name }}
            </div>
            <div>
              <span class="p-text-bold">תיאור:</span>
              {{ qc.quality_control_desc }}
            </div>
          </div>
          <div>
            <div class="p-text-bold">{{ qc.chapter_name }}</div>
            <div>{{ qc.responsible_name }}</div>
          </div>
          <div class="buttonsDiv">
            <Button icon="pi pi-folder-open" style="padding: 3px"></Button>
            <Button label="דווח" class="p-button-sm" @click="reporting(qc)" />
          </div>
        </div>
      </div>
      <Dialog v-model:visible="displayReporting" modal>
        <div>
          <QCReporting
            :qualityControl="qualityControl"
            @closeReporting="closeReporting"
          />
        </div>
        <template #footer> </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import { callProc, apiParam, apiPType, Nz } from "../services/APointAPI";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
import Dialog from "primevue/dialog";
import QCReporting from "@/components/QCReporting.vue";
//todo לחצנים : הצגת קבצים מצורפים
export default {
  components: {
    Button,
    QualityControlsFilters,
    Dialog,
    QCReporting
  },
  data() {
    return {
      qualityControls: [],
      displayFilters: false,
      filters: {},
      displayReporting: false,
      qualityControl: null
    };
  },

  methods: {
    showFilters() {
      this.displayFilters = true;
    },
    filterQualityControl() {
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      Object.keys(this.filters).forEach(key => {
        procParams.push(
          apiParam(key, this.filters[key].value, this.filters[key].type)
        );
      });
      callProc("pr_qc_select", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.qualityControls = result.Table;
            this.displayFilters = false;
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בהצגת בקרות - פנה לתמיכה",
              detail: "",
              life: null,
              closable: true
            });
          }
        })
        .catch(error => {
          console.log("pr_qc_select-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: null,
            closable: true
          });
        });
    },
    setFilters() {
      this.filterQualityControl();
    },
    clearFilters(fieldName) {
      if (fieldName === undefined) this.filters = {};
      else {
        delete this.filters[fieldName];
      }
    },
    updateFilters(field) {
      if (
        Nz(field.ControlSource, "") === "" ||
        (field.apointType === "multiSelect" && field.ControlSource.length === 0)
      ) {
        delete this.filters[field.Name];
      } else {
        this.filters[field.Name] = {
          value:
            field.apointType === "multiSelect"
              ? field.ControlSource.toString()
              : field.ControlSource,
          type: field.type
        };
      }
    },
    reporting(qc) {
      this.qualityControl = qc;
      this.displayReporting = true;
    },
    closeReporting(qualityControl) {
      console.log("closeReporting", qualityControl);
      let qc = this.qualityControls.find(
        qc => qc.quality_control_id === qualityControl.quality_control_id
      );
      qc.status_id = qualityControl.status_id;
      qc.responsible_id = qualityControl.responsible_id;
      this.displayReporting = false;
    }
  },
  computed: {
    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped>
.qc {
  border: 1px solid black;
  display: grid;
  grid-template-columns: 56% 31% 13%;
  padding: 2px;
  width: 99%;
  max-width: 455px;
  margin: 2px;
}
.buttonsDiv {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
