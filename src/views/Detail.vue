<template>
  <section id="detail" class="section section--auth">
    <c-header :icon="true" />
    <c-all-items mode="menu" />
    <c-detail-item />
    <c-footer />
  </section>
</template>

<script>
import CHeader from "../components/c-header";
import CFooter from "../components/c-footer";
import CAllItems from "../components/c-all-items";
import CDetailItem from "../components/c-detail-item";

export default {
  components: {
    CHeader,
    CFooter,
    CAllItems,
    CDetailItem
  }
};
</script>
