<template>
  <div>
    <input
      type="file"
      v-show="false"
      @change="uploadImage"
      ref="evClickFile"
      accept="image/*"
    />

    <ImageEditor
      v-if="imageEditor.displayImageEditor"
      @saveImage="saveImage"
      :dataUrl="imageEditor.dataUrl"
      @cancel="imageEditor.displayImageEditor = false"
    ></ImageEditor>

    <div v-show="displayFilters">
      <QualityControlsFilters
        @showData="setFilters"
        :filters="filters"
        @updateFilters="updateFilters"
        @clearFilters="clearFilters"
      />
    </div>
    <Dialog v-model:visible="displayAttFiles" modal>
      <template #header>
        <h3 style="margin: auto">
          קבצים מצורפים
        </h3>
      </template>
      <div v-for="attFile of attached_files" :key="attFile.id">
        <img :src="attFile.fileName" :alt="attFile.SrcFile" />
      </div>
    </Dialog>
    <div
      v-if="
        (!displayQualityControl || isDesktop) && !imageEditor.displayImageEditor
      "
    >
      <div v-show="!displayFilters">
        <div class="p-d-flex p-ai-center p-jc-end" style="width: 97%">
          <Button label="סינונים" @click="showFilters" icon="pi pi-filter" />
        </div>
        <div class="controls">
          .
          <div v-if="isDesktop" class="qc-table-headers">
            <h5 @click="sortBy('id')" class="table-header">מס' בקרה</h5>
            <h5 @click="sortBy('date')" class="table-header">תאריך פתיחה</h5>
            <h5 @click="sortBy('status_name')" class="table-header">סטטוס</h5>
            <h5 @click="sortBy('chapter_name')" class="table-header">פרק</h5>
            <h5 @click="sortBy('impairment_desc')" class="table-header">
              סוג ליקוי
            </h5>
            <h5 @click="sortBy('level_desc')" class="table-header">
              רמת חומרה
            </h5>
          </div>
          <div class="qc-list">
            <div
              v-for="qc of qualityControls"
              :key="qc.quality_control_id"
              class="qc"
            >
              <div class="qc-not-desktop" v-if="!isDesktop">
                <div @click="openQC(qc)">
                  <div>
                    ב&nbsp;{{ qc.quality_control_id }} -
                    {{ qc.formattedCreate_date }}
                  </div>
                  <div>
                    {{ qc.project_zone1_name }} - {{ qc.project_zone2_name }} -
                    {{ qc.project_zone3_name }}
                  </div>
                  <div>
                    <span class="p-text-bold">תיאור:</span>
                    {{ qc.quality_control_desc }}
                  </div>
                </div>
                <div @click="openQC(qc)">
                  <div class="p-text-bold">{{ qc.chapter_name }}</div>
                  <div>{{ qc.responsible_name }}</div>
                </div>
                <div class="buttonsDiv">
                  <Button
                    icon="pi pi-folder-open"
                    class="folder-btn"
                    @click="addAttFiles(qc)"
                  ></Button>
                  <Button
                    label="דווח"
                    class="p-button-sm report-btn"
                    @click="reporting(qc)"
                    :disabled="qc.status_id === qcStatuses.e_close"
                  />
                </div>
              </div>
              <section class="qc-desktop" @click="openQC(qc)" v-if="isDesktop">
                <div class="qc-id">{{ qc.quality_control_id }}</div>
                <div class="qc-create-date">{{ qc.formattedCreate_date }}</div>
                <div class="qc-status">{{ qc.status_name }}</div>
                <div class="qc-chapter">{{ qc.chapter_name }}</div>
                <div class="qc-impairment">{{ qc.impairment_desc }}</div>
                <div class="qc-level">{{ qc.level_desc }}</div>
              </section>
            </div>
          </div>
          <Dialog v-model:visible="displayReporting" modal>
            <template #header>
              <h3 style="margin: auto">
                דיווח טיפול בבקרה מס' {{ qualityControl.quality_control_id }}
              </h3>
            </template>
            <div>
              <QCReporting
                :qualityControl="qualityControl"
                @closeReporting="closeReporting"
                @addPoto="addPoto"
              />
            </div>

            <template #footer> </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="
      displayQualityControl &&
        !displayFilters &&
        !imageEditor.displayImageEditor
    "
  >
    <QualityControl
      @close="closeQC"
      :qualityControl="qualityControl"
      @closeReportingAndAddPoto="addPoto"
    ></QualityControl>
  </div>
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import {
  callProc,
  apiParam,
  apiPType,
  Nz,
  uploadB64
} from "../services/APointAPI";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
import Dialog from "primevue/dialog";
import QCReporting from "@/components/QCReporting.vue";
import QualityControl from "./QualityControl.vue";
import ImageEditor from "@/components/ImageEditor.vue";
import { qcStatuses, fileTypes } from "../scripts/enums.js";

//todo עיצוב קבצים מצורפים בדיילוג
export default {
  name: "QualityControls",
  components: {
    Button,
    QualityControlsFilters,
    Dialog,
    QCReporting,
    QualityControl,
    ImageEditor
  },
  data() {
    return {
      isIdSortUp: false,
      isDateSortUp: false,
      isStatusSortUp: false,
      isChapterSortUp: false,
      isImpairmentSortUp: false,
      isLevelSortUp: false,
      qualityControls: [],
      displayFilters: false,
      filters: {},
      displayReporting: false,
      qualityControl: null,
      displayQualityControl: false,
      isDesktop: true,
      imageEditor: {
        displayImageEditor: false,
        dataUrl: "",
        fileName: ""
      },
      displayAttFiles: false,
      attached_files: []
    };
  },
  mounted() {
    console.log("qcStatuses", qcStatuses);
  },
  created() {
    this.isDesktop = window.innerWidth > 896;
  },
  watch: {
    qualityControls: function() {
      console.log("QC", this.qualityControls[0]);
    }
  },
  methods: {
    sortBy(sort) {
      let qualityControlsToShow = JSON.parse(
        JSON.stringify(this.qualityControls)
      );
      switch (sort) {
        case "date":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isDateSortUp
              ? new Date(a.create_date) - new Date(b.create_date)
              : new Date(b.create_date) - new Date(a.create_date);
          });
          this.isDateSortUp = !this.isDateSortUp;
          break;
        case "id":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isIdSortUp
              ? b.quality_control_id - a.quality_control_id
              : a.quality_control_id - b.quality_control_id;
          });
          this.isIdSortUp = !this.isIdSortUp;
          break;
        case "status_name":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isStatusSortUp
              ? a[sort].localeCompare(b[sort])
              : b[sort].localeCompare(a[sort]);
          });
          this.isStatusSortUp = !this.isStatusSortUp;
          break;
        case "chapter_name":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isChapterSortUp
              ? a[sort].localeCompare(b[sort])
              : b[sort].localeCompare(a[sort]);
          });
          this.isChapterSortUp = !this.isChapterSortUp;
          break;
        case "impairment_desc":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isImpairmentSortUp
              ? b[sort].localeCompare(a[sort])
              : a[sort].localeCompare(b[sort]);
          });
          this.isImpairmentSortUp = !this.isImpairmentSortUp;
          break;
        case "level_desc":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return this.isLevelSortUp
              ? b[sort].localeCompare(a[sort])
              : a[sort].localeCompare(b[sort]);
          });
          this.isLevelSortUp = !this.isLevelSortUp;
          break;
      }
      this.qualityControls = qualityControlsToShow;
    },
    showFilters() {
      this.displayFilters = true;
      this.$store.commit("main/setAppHeader", "סינון בקרות");
    },
    filterQualityControl() {
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      Object.keys(this.filters).forEach(key => {
        procParams.push(
          apiParam(key, this.filters[key].value, this.filters[key].type)
        );
      });
      callProc("pr_qc_select", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.qualityControls = result.Table;
            this.displayFilters = false;
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בהצגת בקרות - פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true
            });
          }
        })
        .catch(error => {
          console.log("pr_qc_select-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
        });
    },
    setFilters() {
      this.$store.commit("main/setAppHeader", "ריכוז בקרות");

      this.filterQualityControl();
    },
    clearFilters(fieldName) {
      if (fieldName === undefined) this.filters = {};
      else {
        delete this.filters[fieldName];
      }
    },
    updateFilters(field) {
      if (
        Nz(field.ControlSource, "") === "" ||
        (field.apointType === "multiSelect" && field.ControlSource.length === 0)
      ) {
        delete this.filters[field.Name];
      } else {
        this.filters[field.Name] = {
          value:
            field.apointType === "multiSelect"
              ? field.ControlSource.toString()
              : field.ControlSource,
          type: field.type
        };
      }
    },
    reporting(qc) {
      this.qualityControl = qc;
      this.displayReporting = true;
    },
    closeReporting(qualityControl, fromAddPoto) {
      //?הנתונים לא מתרעננים בתצוגה
      console.log("closeReporting", qualityControl);
      let qc = this.qualityControls.find(
        qc => qc.quality_control_id === qualityControl.quality_control_id
      );
      qc.status_id = qualityControl.status_id;
      qc.status_name = "דודי";
      qc.responsible_id = qualityControl.responsible_id;
      if (!fromAddPoto) this.qualityControl = null;
      this.displayReporting = false;
    },
    openQC(qc) {
      this.qualityControl = qc;
      this.displayQualityControl = true;
    },
    clickFile() {
      this.$refs.evClickFile.click();
    },
    addPoto(qualityControl) {
      if (qualityControl !== undefined) {
        this.closeReporting(qualityControl, true);
      } else {
        this.displayReporting = false;
      }
      this.clickFile();
    },
    uploadImage(e) {
      let reader = new FileReader();
      reader.onload = event => {
        console.log(event.target.result);
        this.imageEditor.dataUrl = event.target.result;
        this.imageEditor.displayImageEditor = true;
      };
      this.imageEditor.fileName = e.target.files[0].name;
      reader.readAsDataURL(e.target.files[0]);
    },
    saveImage(imageUrl) {
      let parentType, parentID, createdBy, srcFileName, base64String;
      parentType = fileTypes.e_qualityControl;
      parentID = this.qualityControl.quality_control_id;
      createdBy = this.userID;
      srcFileName = this.imageEditor.fileName;
      base64String = imageUrl;
      uploadB64(parentType, parentID, createdBy, srcFileName, base64String)
        .then(result => {
          if (result === true) {
            this.$toast.add({
              severity: "success",
              summary: "הקובץ צורף בהצלחה",
              detail: "",
              life: 10000,
              closable: true
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בצירוף קובץ",
              detail: "",
              life: 10000,
              closable: true
            });
          }

          // result = JSON.parse(result);
          console.log("uploadB64-result", result); //1/1 uploaded successfully
        })
        .catch(error => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בצירוף קבצים",
            detail: error,
            life: 10000,
            closable: true
          });
          console.log("uploadB64-error", error);
        })
        .then(() => {
          this.imageEditor.displayImageEditor = false;
          this.imageEditor.dataUrl = "";
          this.imageEditor.fileName = "";
        });
    },
    addAttFiles(qc) {
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam("quality_control_id", qc.quality_control_id, apiPType.Int)
      ];
      callProc("pr_qc_get_attached_files", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.Table.length > 0) {
            this.attached_files = result.Table;
            this.displayAttFiles = true;
          } else {
            this.$toast.add({
              severity: "warn",
              summary: "קבצים מצורפים",
              detail: "אין נתונים להצגה",
              life: 10000,
              closable: true
            });
          }
        })
        .catch(error => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
          console.log("pr_qc_reporting_ins-error", error);
        });
    },
    closeQC() {
      this.displayQualityControl = false;
      this.$store.commit("main/setAppHeader", "ריכוז בקרות");
    }
  },
  computed: {
    qcStatuses() {
      return qcStatuses;
    },
    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped lang="scss">
@media (min-width: 880px) {
  // DESKTOP STYLING
  .qc-table-container-desktop {
    display: flex;
    width: 100%;
  }
  .qc {
  }
  .controls {
    border-radius: 15px;
    .qc-table-headers {
      width: 80%;
      margin: 0 auto;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
      cursor: pointer;
      .table-header {
        background: white;
        margin: 0;
        text-align: center;
        font-weight: 600;
        font-size: 18px;
        padding: 10px 0;
      }
    }
    .qc-list {
      max-height: 350px;
      overflow-y: scroll;
      width: 80%;
      margin: 0 auto;
      .qc:nth-of-type(even) {
        background: white;
      }
      .qc {
        cursor: pointer;
        width: 100%;
        &:hover {
          background: lightgray;
          transition: 0.4s;
        }

        .qc-desktop {
          padding: 8px 0;
          text-align: center;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }
      }
    }
  }
}
@media (max-width: 800px) {
  .qc {
    padding: 1px 3px;
    .qc-not-desktop {
      box-shadow: 0px 1px 10px 0px rgb(179 179 179 / 75%);
      border-radius: 5px;
      display: grid;
      grid-template-columns: 56% 31% 13%;
      padding: 4px;
      width: 99%;
      max-width: 455px;
      margin: 6px;
      cursor: pointer;
    }
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
.buttonsDiv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

.report-btn {
  background: $color--primary;
  color: white;
}
.folder-btn {
  padding: 3px;
  background: $color--folder;
  color: white;
}
</style>
