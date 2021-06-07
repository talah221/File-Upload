<template>
  <div class="p-m-2">
    <label for="reports" class="p-text-bold">מה בוצע:</label>
    <div id="reports" class="qcReports ">
      <div
        v-for="report of QCreports"
        :key="report.quality_control_reporting_id"
        class="single_report p-m-2"
      >
        <div style="display: flex; justify-content: space-between">
          <div>{{ report.create_user_name }}</div>
          <div>{{ report.format_create_date }}</div>
        </div>
        <div class="p-text-bold">
          {{ report.new_status_name }} - {{ report.action_performed }}
        </div>
        <div v-show="report.old_responsible_id !== report.new_responsible_id">
          הועבר לטיפול : {{ report.user_rank_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QCreports",
  props: {
    QCreports: { type: Object, required: true }
  },
  methods: {}
};
</script>

<style scoped>
.single_report {
  border-bottom: 1px #dee2e6 solid;

  /* margin-bottom: 10px; */
  /* border-bottom-width: 1px; */
  /* border-bottom: black; */
  /* border-bottom-style: dotted; */
  /* border-bottom-width: 1px; */
}
.qcReports {
  background-color: white;
  opacity: 0.6;
  border-radius: 3px;
}
</style>
