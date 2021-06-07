<template>
  <div class="dashboard-items">
    <dashboard-preview-item
      bgColor="blue"
      type="open"
      :data="previewData.open"
    />
    <dashboard-preview-item
      bgColor="red"
      type="delayed"
      :data="previewData.delayed"
    />
    <dashboard-preview-item
      bgColor="green"
      type="closed"
      :data="previewData.closed"
    />
    <dashboard-preview-item
      bgColor="#ffd400"
      type="more"
      :data="previewData.more"
    />
  </div>
</template>

<script>
import DashboardPreviewItem from "./DashboardPreviewItem.vue";

export default {
  components: { DashboardPreviewItem },
  name: "DashboardPreview",
  props: ["previewData"],
  created() {},
};
</script>

<style lang="scss" scoped>
.dashboard-items {
  display: grid;
  width: 100%;
  // grid-template-columns: repeat(autofit, minmax(100px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(24%, 350px));
  gap: 15px;
  justify-content: center;
}
</style>