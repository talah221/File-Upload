<template>
  <section id="home" class="section section--auth">
    <c-header />
    <c-all-items />
    <c-footer screen="social" />
  </section>
</template>

<script>
import CHeader from "../components/c-header";
import CFooter from "../components/c-footer";
import CAllItems from "../components/c-all-items";

export default {
  components: {
    CHeader,
    CFooter,
    CAllItems
  }
};
</script>
