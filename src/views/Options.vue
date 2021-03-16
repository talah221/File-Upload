<template>
  <div class="options">
    <IFrame :src="srcFullPath" :title="currentPage.description"> </IFrame>
  </div>
</template>

<script>
import IFrame from "../components/IFrame";

export default {
  name: "Options",
  components: {
    IFrame
  },
  data() {
    return {
      appDetails: {
        mainPath: "http://localhost:1900/",
        pages: [
          {
            id: 1,
            name: "AddPicture.aspx",
            description: "הוסף תמוניות ומסמכים"
          },
          {
            id: 2,
            name: "AttendanceReporting.aspx",
            description: "דיווח נוכחות"
          },
          { id: 3, name: "", description: "" },
          { id: 4, name: "", description: "" },
          {
            id: 5,
            name: "SafetySurveysDaily.aspx",
            description: "סיורי בטיחות"
          },
          { id: 6, name: "", description: "" }
        ],
        queryString: "?appUserId=227"
      },
      currentPage: {}
    };
  },
  computed: {
    srcFullPath() {
      return (
        this.appDetails.mainPath +
        this.currentPage.name +
        this.appDetails.queryString
      );
    }
  },
  mounted() {
    this.changePage();
  },
  methods: {
    changePage() {
      this.currentPage = this.appDetails.pages.find(
        page => page.id === +this.$route.params.id
      );
    }
  },
  watch: {
    "$route.params.id": function() {
      this.changePage();
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/mixins";
.options {
  margin-top: 45px;

  @include screen("md") {
    margin-top: 90px;
  }
}
</style>
