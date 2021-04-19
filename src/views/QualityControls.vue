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
      <Button label="סינונים" @click="showFilters" />
      <div
        v-for="qc of qualityControls"
        :key="qc.quality_control_id"
        class="qc"
      >
        <div>ב{{ qc.quality_control_id }} - {{ qc.create_date }}</div>
        <div>
          {{ qc.project_zone1_name }} - {{ qc.project_zone2_name }} -
          {{ qc.project_zone3_name }}
        </div>
        <div>
          <span class="p-text-bold">תיאור:</span> {{ qc.quality_control_desc }}
        </div>
        <div class="p-text-bold">{{ qc.chapter_name }}</div>
        <div>{{ qc.responsible_name }}</div>
        <Button label="דווח" />
        <Button label="תוכניות/קבצים מצורפים" />
      </div>
    </div>
  </div>
  <Toast />
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import { callProc, apiParam, apiPType, Nz } from "../services/APointAPI";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
//todo לחצנים : דיווח,הצגת קבצים מצורפים
export default {
  components: {
    Button,
    QualityControlsFilters
  },
  data() {
    return {
      qualityControls: [],
      displayFilters: false,
      filters: {}
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
        delete this.filters[this.filters[fieldName]];
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
}
</style>
