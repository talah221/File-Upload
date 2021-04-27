<template>
  <div>
    <FileUpload
      name="demo[]"
      @uploader="uploadFiles"
      @error="alertError"
      @progress="clearProgress"
      @select="checkAllFileExt"
      :customUpload="true"
      :multiple="AllowMultipleFiles"
      :mode="AdvancedOrBasic"
    >
      <template #empty>
        <!-- <p>Drag and drop files to here to upload.</p> -->
        <p>גרור לכאן קבצים כדי להעלות</p>
      </template>
    </FileUpload>
    <progressbar :value="uploadProgress"
      >מעלה קובץ {{ uploadFileName }}. התקדמות:
      {{ uploadProgress }}%</progressbar
    >
  </div>
  <Toast position="bottom-right" />
</template>

<script>
import UploadService from "../services/UploadFilesService";
import FileUpload from "primevue/fileupload";
import progressbar from "primevue/progressbar";
import { dbFuncVal, apiParam } from "../services/APointAPI";
import { getFileExtension, csvToObjArray } from "../services/apointUtil";

export default {
  components: {
    FileUpload,
    progressbar
  },
  emits: ["uploadSuccess", "uploadFailed"],
  props: {
    ParentType: {
      type: Number
    },
    ParentID: {
      type: Number
    },
    OrgID: {
      type: Number
    },
    Subject: {
      type: String,
      default: null
    },
    AllowMultipleFiles: {
      type: Boolean,
      default: true
    },
    AdvancedOrBasic: {
      type: String,
      default: "advanced"
    },
    FileID: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      uploadFileName: "",
      uploadProgress: 0,
      allowedFileExt: []
    };
  },
  mounted() {
    //TODO: get allowed file extentions;
    const funcParams = [apiParam("ParentType", this.ParentType)];
    dbFuncVal("apiFileUploadAllowedExts", funcParams)
      .then(result => {
        console.log(`apiFileUploadAllowedExts: ${result}`);
        const res = JSON.parse(result).funcResult;
        if (res !== "") {
          this.allowedFileExt = csvToObjArray(res, ",");
        } else {
          this.allowedFileExt = [];
        }
        console.log("allowedFileExt", this.allowedFileExt);
      })
      .catch(error => {
        console.log(error);
        this.allowedFileExt = [];
      });
    console.log("FileID", this.FileID);
  },
  methods: {
    checkAllFileExt(e) {
      let fileExt;
      console.log("event", e);
      this.clearProgress;
      e.files.forEach(file => {
        fileExt = getFileExtension(file.name);
        console.log("indexOfAllowedFileExt", this.allowedFileExt, fileExt);

        if (!this.checkFileExt(fileExt)) {
          this.alertError(
            file.name,
            "לא ניתן להעלות קובץ בסיומת זו. המערכת תדלג עליו בתהליך ההעלאה"
          );
          //TODO: remove file from FileUpload control
        }
      });
    },
    checkFileExt(fileExt) {
      if (
        this.allowedFileExt.filter(f => {
          // console.log(f.value, fileExt, f);
          if (f.value.toLowerCase() === fileExt.toLowerCase()) return f;
        }).length === 0
      ) {
        console.log("checkFileExt = false");
        return false;
      } else {
        console.log("checkFileExt = true");
        return true;
      }
    },
    uploadFiles(event) {
      console.log(event.files);
      let fileExtension = "";
      let i = 0;
      event.files.forEach(file => {
        fileExtension = getFileExtension(file.name);
        console.log("fileExtension", fileExtension);
        if (this.checkFileExt(fileExtension)) {
          this.upload(i, file);
          i++;
        }
      });
    },
    upload(idx, file) {
      this.uploadFileName = file.name;
      this.uploadProgress = 0;

      UploadService.upload(
        file,
        event => {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        },
        this.ParentType,
        this.ParentID,
        this.OrgID,
        this.Subject,
        this.FileID
      )
        .then(response => {
          console.log(response.data);
          console.log(response.data.APIResponseCode);
          if (response.data.APIResponseCode === 0) {
            this.alertSuccess();
            //TODO: Clear progress bar
          } else {
            this.alertError(
              response.data.APIResponseText + ": " + this.uploadFileName
            );
          }
        })
        .catch(() => {
          this.uploadProgress = 0;
          this.alertError();
        });
    },
    alertError(summaryText, detailText) {
      if (!summaryText) {
        summaryText = "שגיאה בעת העלאת קובץ: " + this.uploadFileName;
      }
      if (!detailText) {
        detailText = "העלאת הקובץ נכשל!";
      }
      console.log("alertError", detailText);
      this.$toast.add({
        severity: "error",
        summary: summaryText,
        detail: detailText,
        life: 3000
      });
      this.uploadProgress = 0;
      this.$emit("uploadFailed", this.uploadFileName);
    },
    alertSuccess() {
      console.log("alertSuccess");
      this.$toast.add({
        severity: "success",
        summary: this.uploadFileName,
        detail: "העלאת הקובץ הסתיים בהצלחה!",
        life: 3000
      });
      this.$emit("uploadSuccess", this.uploadFileName);
    },
    clearProgress() {
      (this.uploadFileName = ""), (this.uploadProgress = 0);
    },
    FileUploaderTest() {
      console.log("onUpload");
      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000
      });
    }
  }
};
</script>

<style scoped></style>
