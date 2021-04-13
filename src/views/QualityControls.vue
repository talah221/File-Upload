<template>
  <div>
    <Button label="סינונים" />
    <div v-for="qc of qualityControls" :key="qc.quality_control_id" class="qc">
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
  <Toast />
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
// import QualityControlsFilters from "@/QualityControlsFilters"
//todo לחצנים : סינון,דיווח,הצגת קבצים מצורפים
export default {
  components: {
    Button
  },
  data() {
    return {
      qualityControls: []
    };
  },
  mounted() {
    let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
    callProc("pr_qc_select", procParams)
      .then(result => {
        result = JSON.parse(result);
        // console.log(result);
        if (result.procReturnValue === 0) {
          this.qualityControls = result.Table;
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
