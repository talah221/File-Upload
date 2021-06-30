<template>
  <main class="container">
    <FileUpload
      name="demo[]"
      url="./upload.php"
      @upload="onUpload"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template>
    </FileUpload>
  </main>
</template>

<script>
import FileUpload from "primevue/fileupload";

export default {
  name: "Homepage",
  directives: {},
  components: { FileUpload },
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    initializeComponentData() {},
  },
  updated() {},
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.container {
}
</style>