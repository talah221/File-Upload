<template>
  <div v-for="report of QCreports" :key="report.quality_control_reporting_id">
    {{ report.action_performed }}
    {{ report.format_create_date }}
    {{ report.user_full_name }}
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

<style scoped></style>
