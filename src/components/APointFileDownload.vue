<template>
  <div v-show="showElems">
    <Button
      @click="downloadFile"
      :label="DownloadLinkCaption"
      :class="btnClass"
    />
  </div>
  <progressbar v-show="showElems" :value="downloadProgress"
    >מוריד קובץ {{ downloadFileName }}. התקדמות:
    {{ downloadProgress }}%</progressbar
  >
  <Toast position="bottom-right" />
</template>

<script>
import Button from "primevue/button";
import progressbar from "primevue/progressbar";
import axios from "axios";
import { apiParam, API_HOST } from "../services/APointAPI";

//TODO: limit file size to be downloaded (because the page can reach an "out of memory" error)
//TODO: if I add catch to the axios, the app display both success & error toasts
//TODO: retrieving a Hebrew file name from the Headers, results in Gebrish

//Using this componenet requires you yo have the following functions in your Database
//Sacalar-Value function - AttachedFileName => returns the phisical path + file name to the file to be downloaded
//Sacalar-Value function - AttachedFileNameOrig => returns the original file name (file name only) that this file had when it was uploaded
//Development was done against DC\Dev14 - DevERP. You can see there how the functions were implemented (for a sample)

export default {
  components: { Button, progressbar },
  emits: ["downloadSuccess", "downloadFailed"],
  props: {
    FileID: {
      type: Number,
      default: 0
    },
    HyperlinkOrButton: {
      type: String,
      default: "Button"
    },
    DownloadLinkCaption: {
      type: String,
      default: "לחץ להורדה"
    },
    showElems: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      downloadProgress: 0,
      downloadFileName: ""
    };
  },
  watch: {
    FileID(newValue) {
      if (newValue != 0) this.downloadFile();
    }
  },
  methods: {
    alertError(summaryText, detailText) {
      if (!summaryText) {
        summaryText = "שגיאה בעת הורדת הקובץ";
      }
      if (!detailText) {
        detailText = "אנא פנה למנהל המערכת";
      }
      console.log("alertError", detailText);
      this.$toast.add({
        severity: "error",
        summary: summaryText,
        detail: detailText,
        life: 3000
      });
      this.clearProgress;
      this.$emit("downloadFailed", this.FileID);
    },
    alertSuccess() {
      console.log("alertSuccess");
      this.$toast.add({
        severity: "success",
        summary: "הסתיים",
        detail: "הורדת הקובץ הסתיים בהצלחה!",
        life: 3000
      });
      this.$emit("downloadSuccess", this.downloadFileName);
    },
    saveToFile(data, filename, mime) {
      //original Func Name: downloadFile
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const blob = new Blob([data], {
        type: mime || "application/octet-stream"
      });
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        // IE doesn't allow using a blob object directly as link href.
        // Workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
        return;
      }
      // Other browsers
      // Create a link pointing to the ObjectURL containing the blob
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);
      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
      }, 100);
    },
    downloadFile() {
      this.clearProgress;
      let url = API_HOST + "/files/download";
      // console.log("url", url);
      let params = [
        apiParam("sessionToken", this.sessionToken, 16),
        apiParam("fileID", this.FileID)
      ];
      axios
        .post(url, params, {
          responseType: "blob",
          onDownloadProgress: event => {
            this.downloadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          }
        })
        .then(response => {
          // console.log("response: ", response);
          // console.log("response.headers: ", response.headers);
          // console.log(
          //   "FileProps",
          //   response.request.getResponseHeader("FileProps")
          // );
          let fileProps = JSON.parse(
            response.request.getResponseHeader("FileProps")
          );
          this.downloadFileName = fileProps.fileName;
          //console.log("response.data.size", response.data.size);
          if (response.data.size > 0) {
            // if response.content
            this.saveToFile(response.data, fileProps.fileName);
            // console.log("response.data.length: ", response.data.length);
            this.alertSuccess();
          } else {
            this.alertError("הורדת הקובץ נכשל!", "לא התקבל קובץ מהשרת");
          }
        });
      //.catch(this.alertError());
    },
    clearProgress() {
      (this.downloadFileName = ""), (this.downloadProgress = 0);
    }
  },
  computed: {
    btnClass() {
      return this.HyperlinkOrButton === "Hyperlink" ? "p-button-link" : null;
    },
    sessionToken() {
      return this.$store.state.api.sessionToken;
    }
  }
};
</script>

<style scoped></style>
