<template>
  <div
    v-show="
      !isDesktop &&
        displayQualityControl &&
        !displayFilters &&
        !imageEditor.displayImageEditor
    "
  >
    <Button @click="backToParent" icon="pi pi-angle-right"></Button>
  </div>
  <div
    class="ProjectFilter"
    v-show="
      !isDesktop &&
        !displayFilters &&
        !imageEditor.displayImageEditor &&
        !displayQualityControl
    "
  >
    <MultiSelect
      id="ddlProjects"
      v-model="projects.ControlSource"
      :options="projects.RowSource"
      :optionLabel="projects.optionLabel"
      :optionValue="projects.optionValue"
      :filter="
        projects.RowSource !== null &&
          projects.RowSource !== undefined &&
          projects.RowSource.length > 10
      "
      :placeholder="projects.placeholder"
      @change="projects.FuncOnUpdate()"
    />
  </div>
  <div
    class="chipFilters"
    v-show="!imageEditor.displayImageEditor && !displayQualityControl"
  >
    <Chip
      v-for="f of filterToShow"
      :key="f.num"
      :label="f.caption + (f.value !== '' ? ': ' + f.value : '') + ' '"
      removable
      @remove="clearFilters(f.num)"
    />
  </div>
  <div>
    <input
      type="file"
      v-show="false"
      @change="uploadImage"
      ref="evClickFile"
      accept=".JPEG,.JPG,.PNG ,.GIF"
    />

    <ImageEditor
      v-if="imageEditor.displayImageEditor"
      @saveImage="saveImage"
      :dataUrl="imageEditor.dataUrl"
      @cancel="imageEditor.displayImageEditor = false"
    ></ImageEditor>

    <div v-show="displayFilters">
      <QualityControlsFilters
        :removeFilter="removeFilter"
        @showData="setFilters"
        @updateFilters="updateFilters"
        @clearFilters="clearFilters"
        @filterRemoved="removeFilter = null"
        :projects="projects.ControlSource"
      />
    </div>
    <galleria-full
      v-if="displayAttFiles"
      :images="images"
      :displayFullScreen="true"
      @closeGalleria="displayAttFiles = false"
    ></galleria-full>

    <div
      v-if="
        (!displayQualityControl || isDesktop) && !imageEditor.displayImageEditor
      "
    >
      <div v-show="!displayFilters">
        <div class="p-d-flex p-ai-center p-jc-between" style="width: 97%; ">
          <Button
            label="בקרה חדשה"
            @click="openNewQC"
            icon="pi pi-plus-circle"
            style="height: 30px;"
          />
          <Button
            label="סינונים"
            @click="showFilters"
            icon="pi pi-filter"
            style="height: 30px;"
          />
        </div>
        <div class="controls">
          <div v-if="isDesktop" class="qc-table-headers">
            <h5 @click="sortBy('id', true)" class="table-header">מס' בקרה</h5>
            <h5 @click="sortBy('date', true)" class="table-header">
              תאריך פתיחה
            </h5>
            <h5 @click="sortBy('status_name', true)" class="table-header">
              סטטוס
            </h5>
            <h5 @click="sortBy('chapter_name', true)" class="table-header">
              פרק
            </h5>
            <h5 @click="sortBy('impairment_desc', true)" class="table-header">
              סוג ליקוי
            </h5>
            <h5 @click="sortBy('level_desc')" class="table-header">
              רמת חומרה
            </h5>
          </div>
          <div class="qc-list">
            <div class="" v-if="!isDesktop">
              <label :for="sortByList.Name">{{ sortByList.Caption }}</label>
              <a-point-dropdown
                :id="sortByList.Name"
                :field="sortByList"
                :model-value="sortByList.ControlSource"
                @update:model-value="updateField(sortByList, $event)"
              ></a-point-dropdown>

              <ToggleButton
                class="p-button-plain"
                v-model="sortUp.ControlSource"
                :onLabel="sortUp.onLabel"
                :offLabel="sortUp.offLabel"
                :onIcon="sortUp.onIcon"
                :offIcon="sortUp.offIcon"
                @change="sortUp.FuncOnUpdate()"
              ></ToggleButton>
              <label :for="groupBy.Name">{{ groupBy.Caption }}</label>
              <a-point-dropdown
                :id="groupBy.Name"
                :field="groupBy"
                :model-value="groupBy.ControlSource"
                @update:model-value="updateField(groupBy, $event)"
              ></a-point-dropdown>
            </div>
            <div v-if="!isDesktop">
              <div v-for="group of arrActiveGroup" :key="group.name" class="qc">
                <span
                  @click="group.show = !group.show"
                  style="font-size:1.5rem"
                >
                  <i
                    :class="
                      group.show ? 'pi pi-angle-down' : 'pi pi-angle-left'
                    "
                  ></i>
                  {{ group.name }} ({{ filetrByGroup(group.name).length }})
                </span>
                <transition
                  name="slide-fade-group"
                  v-for="qc of filetrByGroup(group.name)"
                  :key="qc.quality_control_id"
                >
                  <div v-show="group.show">
                    <div class="qc-not-desktop" v-if="!isDesktop">
                      <div class="title" @click="openQC(qc)">
                        ב&nbsp;{{ qc.quality_control_id }} -
                        {{ qc.formattedCreate_date }}
                      </div>
                      <div class="content">
                        <div @click="openQC(qc)">
                          <div>
                            {{ qc.project_zone1_name }} -
                            {{ qc.project_zone2_name }} -
                            {{ qc.project_zone3_name }}
                          </div>
                          <div class="p-text-bold">{{ qc.chapter_name }}</div>
                          <div>{{ qc.responsible_name }}</div>
                          <div>{{ qc.contractor_name }}</div>
                        </div>
                        <div class="buttonsDiv">
                          <Button
                            icon="pi pi-images"
                            class="folder-btn buttonIcon"
                            @click="addAttFiles(qc)"
                          ></Button>
                          <Button
                            label="הוסף דיווח"
                            class="p-button-sm report-btn"
                            @click="reporting(qc)"
                            :disabled="
                              qc.status_id === qcStatuses.e_close ||
                                !qc.allow_edit_open_qc
                            "
                            :style="
                              qc.status_id === qcStatuses.e_close
                                ? 'background: #a5a5a5;'
                                : ''
                            "
                          />
                          <Button
                            icon="pi pi-camera"
                            class="buttonIcon"
                            @click="addExternalPoto(qc)"
                            :disabled="
                              qc.status_id === qcStatuses.e_close ||
                                !qc.allow_edit_open_qc
                            "
                          ></Button>
                        </div>
                      </div>
                      <div class="description" @click="openQC(qc)">
                        <!-- <span class="p-text-bold">תיאור:</span> -->
                        {{ qc.quality_control_desc }}
                        <!-- {{ reportTest(qc.quality_control_id) }} -->
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div v-if="isDesktop">
              <div
                v-for="qc of qualityControls"
                :key="qc.quality_control_id"
                class="qc"
              >
                <section class="qc-desktop" @click="openQC(qc)">
                  <div class="qc-id">{{ qc.quality_control_id }}</div>
                  <div class="qc-create-date">
                    {{ qc.formattedCreate_date }}
                  </div>
                  <div class="qc-status">{{ qc.status_name }}</div>
                  <div class="qc-chapter">{{ qc.chapter_name }}</div>
                  <div class="qc-impairment">{{ qc.impairment_desc }}</div>
                  <div class="qc-level">{{ qc.level_desc }}</div>
                </section>
              </div>
            </div>
          </div>
          <Dialog v-model:visible="displayReporting" modal>
            <template #header>
              <h4 style="margin: auto">
                דיווח טיפול בבקרה מס' {{ qualityControl.quality_control_id }}
              </h4>
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
  <transition name="slide-fade">
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
        :qcReports="getReports(qualityControl.quality_control_id)"
        @closeReportingAndAddPoto="addPoto"
        @updateStatus="updateStatus"
        @updateQCReporting="updateQCReporting"
      ></QualityControl>
    </div>
  </transition>
</template>

<script>
import Button from "primevue/button";
import { mapState, mapGetters } from "vuex";
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
import { qcStatuses, fileTypes, spinnerInstances } from "../scripts/enums.js";
import Chip from "primevue/chip";
import GalleriaFull from "@/components/GalleriaFull.vue";
import APointDropdown from "@/components/APoint-dropdown.vue";
import ToggleButton from "primevue/togglebutton";
import MultiSelect from "primevue/multiselect";

export default {
  name: "QualityControls",
  components: {
    Button,
    QualityControlsFilters,
    Dialog,
    QCReporting,
    QualityControl,
    ImageEditor,
    Chip,
    GalleriaFull,
    APointDropdown,
    ToggleButton,
    MultiSelect
  },
  data() {
    return {
      qualityControls: [],
      displayFilters: false,
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
      attached_files: [],
      chipFilters: [],
      removeFilter: null,
      qualityControlsReports: [],

      sortByList: {
        num: 1,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "מיין לפי:",
        optionLabel: "desc",
        optionValue: "field",
        showClear: false,
        ControlSource: null,
        RowSource: [
          { field: "id", desc: "תאריך פתיחה" },
          { field: "project_zone1_name", desc: "חללים" },
          { field: "chapter_name", desc: "פרק" },
          { field: "responsible_name", desc: "אחראי לביצוע" },
          { field: "status_name", desc: "סטטוס" }
        ],
        Enabled: true,
        Name: "sortBy",
        FuncOnUpdate: () => {
          this.sortBy();
        },
        DefaultValue: "id"
      },
      sortUp: {
        num: 2,
        apointType: "toggleButton",
        check: false,
        required: true,
        Caption: "",
        onIcon: "pi pi-sort-amount-down-alt",
        offIcon: "pi pi-sort-amount-up",
        onLabel: "",
        offLabel: "",
        iconPos: null,
        ControlSource: null,
        Enabled: true,
        Name: "sortBy",
        FuncOnUpdate: () => {
          this.sortBy();
        }
      },
      groupBy: {
        num: 3,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "קבץ לפי:",
        optionLabel: "desc",
        optionValue: "column_name",
        showClear: false,
        ControlSource: null,
        RowSource: [
          { column_name: "chapter_name", desc: "פרקים", array: [] },
          { column_name: "status_name", desc: "סטטוס", array: [] }
        ],
        Enabled: true,
        Name: "groupBy",
        FuncOnUpdate: () => {},
        DefaultValue: "chapter_name"
      },
      projects: {
        num: 4,
        apointType: "multiSelect",
        check: false,
        required: false,
        Caption: "שם פרוייקט",
        optionLabel: "ProjectName",
        optionValue: "ProjectId",
        showClear: true,
        ControlSource: null,
        RowSource: [],
        Enabled: true,
        Locked: false,
        Name: "project_id",
        type: apiPType.NVarChar,
        placeholder: "בחר פרויקט",
        FuncOnUpdate: () => {
          this.filterQualityControl();
          this.$store.commit(
            "qc/setSelectedProjectId",
            this.projects.ControlSource
          );
        }
      }
    };
  },
  mounted() {
    let loadData = () => {
      this.projects.RowSource = this.getProjectsUser();
      if (this.$store.state.qc.selectedProjectId) {
        this.projects.ControlSource = JSON.parse(
          "[" + this.$store.state.qc.selectedProjectId + "]"
        );
        this.projects.FuncOnUpdate();
      } else if (this.projects.RowSource.length === 1) {
        this.projects.ControlSource = JSON.parse(
          "[" + this.projects.RowSource[0].ProjectId + "]"
        );
        this.projects.FuncOnUpdate();
      }
    };
    let i = 0;
    let interval = setInterval(() => {
      i++;
      // console.log("interval", i);
      if (this.isDataLoaded === false && i < 30000) return;
      clearInterval(interval);
      loadData();
    }, 1);
  },
  created() {
    this.isDesktop = false; //todo change window.innerWidth > 896; //false; //todo change
  },
  methods: {
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate(value));
    },
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    sortBy(sortName, changeSortUp) {
      let sort, sortUp;
      if (sortName) {
        sort = sortName;
        this.sortByList.ControlSource = sortName;
      } else sort = this.sortByList.ControlSource;

      sortUp = this.sortUp.ControlSource;
      if (changeSortUp) {
        this.sortUp.ControlSource = !sortUp;
        sortUp = !sortUp;
      }
      let qualityControlsToShow = JSON.parse(
        JSON.stringify(this.qualityControls)
      );
      if (!sort) return;
      switch (sort) {
        case "date":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return sortUp
              ? new Date(a.create_date) - new Date(b.create_date)
              : new Date(b.create_date) - new Date(a.create_date);
          });
          break;
        case "id":
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return sortUp
              ? a.quality_control_id - b.quality_control_id
              : b.quality_control_id - a.quality_control_id;
          });
          break;
        default:
          //for strung sort
          qualityControlsToShow = qualityControlsToShow.sort((a, b) => {
            return sortUp
              ? a[sort].localeCompare(b[sort])
              : b[sort].localeCompare(a[sort]);
          });
          break;
      }

      this.qualityControls = qualityControlsToShow;
    },
    filetrByGroup(filterStr) {
      return this.qualityControls.filter(
        e => e[this.groupBy.ControlSource] === filterStr
      );
    },
    showFilters() {
      this.displayFilters = true;
      this.$store.commit("main/setAppHeader", "סינון בקרות");
    },
    filterQualityControl() {
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      if (this.projects.ControlSource?.length > 0) {
        procParams.push(
          apiParam(
            this.projects.Name,
            this.projects.ControlSource.toString(),
            this.projects.type
          )
        );
      }
      this.chipFilters.forEach(filter => {
        procParams.push(
          apiParam(
            filter.Name,
            filter.apointType === "multiSelect"
              ? filter.ControlSource.toString()
              : filter.ControlSource,
            filter.type
          )
        );
      });
      callProc("pr_qc_select", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.qualityControls = result.Table;
            this.qualityControlsReports = result.Table1;
            this.displayFilters = false;
            this.sortBy();
            //grouping
            this.groupBy.RowSource.forEach(group => {
              group.array = this.qualityControls
                .map(item => item[group.column_name])
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort()
                .map(item => ({ name: item, show: true }));
            });
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
    clearFilters(fieldNum) {
      if (fieldNum === undefined) {
        this.chipFilters = [];
      } else {
        let index = this.chipFilters.findIndex(f => f.num === fieldNum);
        if (index >= 0) this.chipFilters.splice(index, 1);
        this.removeFilter = fieldNum;
        this.filterQualityControl();
      }
    },
    updateFilters(field) {
      if (
        Nz(field.ControlSource, "") === "" ||
        (field.apointType === "multiSelect" &&
          field.ControlSource.length === 0) ||
        (field.apointType === "checkbox" && !field.ControlSource)
      ) {
        let index = this.chipFilters.findIndex(f => f.num === field.num);
        if (index >= 0) this.chipFilters.splice(index, 1);
      } else {
        if (this.chipFilters.find(f => f.num === field.num) !== undefined) {
          this.chipFilters.find(f => f.num === field.num).ControlSource =
            field.ControlSource;
        } else {
          this.chipFilters.push(field);
        }
      }
    },
    reporting(qc) {
      this.qualityControl = qc;
      this.displayReporting = true;
    },
    closeReporting(qualityControl, fromAddPoto) {
      //?הנתונים לא מתרעננים בתצוגה
      // console.log("closeReporting", qualityControl);

      this.updateQCReporting(qualityControl);
      if (!fromAddPoto) this.qualityControl = null;
      this.displayReporting = false;
    },
    updateQCReporting(qualityControl) {
      let qc = this.qualityControls.find(
        qc => qc.quality_control_id === qualityControl.quality_control_id
      );
      qc.status_id = qualityControl.status_id;
      qc.status_name = this.getAllStatuses().find(
        s => s.status_id === qualityControl.status_id
      ).status_name;
      qc.responsible_id = qualityControl.responsible_id;
      qc.responsible_name = this.getResponsibles(qc.project_id).find(
        r => r.rank_id == qualityControl.responsible_id
      ).user_rank_name;
      qc.contractor_id = qualityControl.contractor_id;
      qc.contractor_name = this.getContractors(qc.project_id).find(
        c => c.ID === qualityControl.contractor_id
      ).contractor_name;

      if (qualityControl.qcReport) {
        this.qualityControlsReports.push(qualityControl.qcReport);
      }
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
    addExternalPoto(qc) {
      this.qualityControl = qc;
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
      this.$store.commit("main/setSpinner", {
        id: spinnerInstances.e_QualityControls_loadAttFiles,
        flag: true
      });
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
          console.log("pr_qc_get_attached_files-error", error);
        })
        .then(() => {
          this.$store.commit("main/setSpinner", {
            id: spinnerInstances.e_QualityControls_loadAttFiles,
            flag: false
          });
        });
    },
    closeQC() {
      this.displayQualityControl = false;
      this.$store.commit("main/setAppHeader", "ריכוז בקרות");
    },
    getReports(quality_control_id) {
      return this.qualityControlsReports.filter(
        r => r.quality_control_id === quality_control_id
      );
    },
    updateStatus(qc_id, status) {
      this.qualityControls.find(
        qc => qc.quality_control_id === qc_id
      ).status_id = status;
    },
    openNewQC() {
      this.$router.push({
        name: "QualityControl"
      });
    },
    backToParent() {
      this.displayQualityControl = false;
    }
  },
  computed: {
    arrActiveGroup() {
      return this.groupBy.RowSource.find(
        e => e.column_name === this.groupBy.ControlSource
      )?.array;
    },
    filterToShow() {
      return this.chipFilters.map(f => {
        return {
          num: f.num,
          Name: f.Name,
          caption: f.Caption,
          value:
            f.apointType === "multiSelect"
              ? f.ControlSource?.length > 1
                ? "(" + f.ControlSource.length.toString() + ")"
                : f.RowSource.filter(field => {
                    return f.ControlSource.indexOf(field[f.optionValue]) >= 0;
                  })
                    .map(fieldMap => fieldMap[f.optionLabel])
                    .toString()
              : f.apointType === "text" &&
                f.Format === "Long Date" &&
                Date.parse(f.ControlSource) === Date.parse(f.ControlSource)
              ? Intl.DateTimeFormat("en-GB").format(f.ControlSource)
              : f.apointType === "checkbox"
              ? ""
              : f.ControlSource
        };
      });
    },
    qcStatuses() {
      return qcStatuses;
    },
    images() {
      return this.attached_files.map(img => ({
        ID: img.ID,
        itemImageSrc: img.fileName,
        thumbnailImageSrc: img.fileName,
        alt: img.SrcFile,
        title: img.SrcFile
      }));
    },
    ...mapState({
      userID: state => +state.api.userID,
      isDataLoaded: state => state.qc.isDataLoaded
    }),
    ...mapGetters({
      getAllStatuses: "qc/getStatuses",
      getResponsibles: "qc/getResponsibles",
      getProjectsUser: "qc/getProjectsUser",
      getContractors: "qc/getContractors"
    })
  },
  watch: {
    qualityControls: function() {
      // console.log("QC", this.qualityControls[0]);
    }
  },
  unmounted() {
    this.$store.commit("main/setSpinner", {
      id: spinnerInstances.e_QualityControls_loadAttFiles,
      flag: false
    });
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
    font-size: 14px;
    .qc-not-desktop {
      box-shadow: 0px 1px 10px 0px rgb(179 179 179 / 75%);
      border-radius: 5px;
      display: grid;
      // grid-template-rows: minmax(10%, 18%) minmax(25%, 55%) minmax(27%, 60%);
      padding: 4px;
      width: 99%;
      max-width: 455px;
      margin: 6px;
      cursor: pointer;
    }
    .content {
      display: grid;
      grid-template-columns: 87% 13%;
      margin: 2px 0px;
    }
    .title {
      text-align: center;
      font-weight: bold;
    }
    .description {
      text-align: center;
      padding-top: 5px;
      overflow: hidden;
      margin-top: 3px;
      color: #0e1758;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0px 1px 10px 0px rgb(179 179 179 / 75%);
      max-height: 71px;
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
.slide-fade-enter-active {
  transition: all 0.6s ease;
}

.slide-fade-leave-active {
  transition: all 1s cubic-bezier(0.5, 1, 1, 0.5);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-100vh);
  opacity: 0;
}
.slide-fade-group-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-group-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 1, 1, 0.5);
}

.slide-fade-group-enter-from,
.slide-fade-group-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.ProjectFilter {
  margin: auto;
  max-width: 950px;
  width: 97%;
  display: flex;

  flex-wrap: wrap;
}
.ProjectFilter #ddlProjects {
  width: 100%;
  text-align: center;
}
</style>
