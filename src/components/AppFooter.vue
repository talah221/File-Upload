<template>
  <div class="footer" dir="ltr">
    Powered by<img src="../assets/logo-apoint-min.png" class="footer-logo" />
    <a href="https://www.apoint.co.il" target="_blank">A Point Systems ltd</a>
  </div>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.footer-logo {
  margin: 5px;
  max-height: 14px;
}
</style>
