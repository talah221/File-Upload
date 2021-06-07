<template>
  <div v-if="!isDesktop">
    <div
      class="ProjectFilter"
      v-show="
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
      >
      </MultiSelect>
    </div>
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
    <div class="top-grid">
      <div
        :class="['chipFilters', displayFilters ? '' : 'm-10']"
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
      <div v-if="!displayQualityControl && !imageEditor.displayImageEditor">
        <div class="content-qcs">
          <div v-show="!displayFilters">
            <div class="header-content">
              <div class="header-btn">
                <Button
                  label="בקרה חדשה"
                  @click="openNewQC"
                  icon="pi pi-plus-circle"
                />
                <Button
                  label="מיין"
                  @click="selected_header_option = header_option_enum.e_sort"
                  icon="pi pi-sort-alt"
                  :class="
                    selected_header_option === header_option_enum.e_sort
                      ? 'selected-option'
                      : ''
                  "
                />
                <Button
                  label="קבץ"
                  @click="selected_header_option = header_option_enum.e_group"
                  icon="pi pi-sitemap"
                  :class="
                    selected_header_option === header_option_enum.e_group
                      ? 'selected-option'
                      : ''
                  "
                />
                <Button label="סנן" @click="showFilters" icon="pi pi-filter" />
              </div>
              <div class="header-select" v-show="selected_header_option">
                <div
                  v-show="selected_header_option === header_option_enum.e_sort"
                >
                  <label :for="sortByList.Name">{{ sortByList.Caption }}</label>
                  <a-point-dropdown
                    :id="sortByList.Name"
                    :field="sortByList"
                    :model-value="sortByList.ControlSource"
                    @update:model-value="updateField(sortByList, $event)"
                    class="header-select-ddl"
                  ></a-point-dropdown>
                  <ToggleButton
                    class="p-button-plain buttonIcon toggleButton"
                    v-model="sortUp.ControlSource"
                    :onLabel="sortUp.onLabel"
                    :offLabel="sortUp.offLabel"
                    :onIcon="sortUp.onIcon"
                    :offIcon="sortUp.offIcon"
                    @change="sortUp.FuncOnUpdate()"
                  ></ToggleButton>
                </div>
                <div
                  v-show="selected_header_option === header_option_enum.e_group"
                >
                  <label :for="groupBy.Name">{{ groupBy.Caption }}</label>
                  <a-point-dropdown
                    class="header-select-ddl"
                    :id="groupBy.Name"
                    :field="groupBy"
                    :model-value="groupBy.ControlSource"
                    @update:model-value="updateField(groupBy, $event)"
                  ></a-point-dropdown>
                </div>
                <Button
                  icon="pi pi-times"
                  class="cancelBtn"
                  @click="selected_header_option = null"
                ></Button>
              </div>
            </div>
            <div class="controls">
              <div class="qc-list">
                <div v-if="!isDesktop">
                  <div
                    v-for="group of arrActiveGroup"
                    :key="group.name"
                    class="qc"
                  >
                    <span
                      v-show="group.name !== ''"
                      @click="group.show = !group.show"
                      style="font-size: 1.5rem"
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
                        <div
                          class="qc-not-desktop"
                          v-if="!isDesktop"
                          :style="'border-right-color:' + qc.status_color"
                        >
                          <div class="qc-details">
                            <div class="" @click="openQC(qc)">
                              {{ qc.quality_control_desc }}
                            </div>
                            <div @click="openQC(qc)">{{ qc.project_desc }}</div>
                            <div class="p-text-bold" @click="openQC(qc)">
                              {{ qc.status_name }}
                            </div>
                            <div @click="openQC(qc)">{{ qc.chapter_name }}</div>
                            <div @click="openQC(qc)">
                              {{ qc.responsible_name }}
                            </div>
                            <div @click="openQC(qc)">
                              {{ qc.contractor_name }}
                            </div>
                            <div @click="openQC(qc)">
                              {{ qc.project_zone1_name }}
                              - {{ qc.project_zone2_name }} -
                              {{ qc.project_zone3_name }}
                            </div>
                            <div @click="openQC(qc)">
                              <span class="p-text-bold"
                                >ב&nbsp;{{ qc.quality_control_id }}</span
                              >
                              {{ qc.formattedCreate_date }}
                            </div>
                            <div>
                              <Button
                                icon="pi pi-camera"
                                class="buttonIcon"
                                @click="addExternalPoto(qc)"
                                :disabled="
                                  qc.status_id === qcStatuses.e_close ||
                                  !qc.allow_edit_open_qc
                                "
                              ></Button>
                              <Button
                                icon="pi pi-images"
                                class="buttonIcon"
                                @click="addAttFiles(qc.quality_control_id)"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              <Dialog v-model:visible="displayReporting" modal>
                <template #header>
                  <h4 style="margin: auto">
                    דיווח טיפול בבקרה מס'
                    {{ qualityControl.quality_control_id }}
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
          @updateQCReporting="updateQCReporting"
          :qcImages="getQcImagesById(qualityControl.quality_control_id)"
        ></QualityControl>
      </div>
    </transition>
  </div>
  <quality-controls-desktop v-if="isDesktop" />
</template>

<script>
import Button from "primevue/button";
import { mapState, mapGetters } from "vuex";
import {
  callProc,
  apiParam,
  apiPType,
  Nz,
  uploadB64,
} from "../services/APointAPI";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
import Dialog from "primevue/dialog";
import QCReporting from "@/components/QCReporting.vue";
import QualityControl from "./QualityControl.vue";
import ImageEditor from "@/components/ImageEditor.vue";
import { qcStatuses, fileTypes } from "../scripts/enums.js";
import Chip from "primevue/chip";
import GalleriaFull from "@/components/GalleriaFull.vue";
import APointDropdown from "@/components/APoint-dropdown.vue";
import ToggleButton from "primevue/togglebutton";
import MultiSelect from "primevue/multiselect";
import QualityControlsDesktop from "../components/QualityControlsDesktop/QualityControlsDesktop.container.vue";
// import QualityControlsDesktop from "../components/QualityControlsDesktop/QualityControlsDesktop.container.vue";

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
    MultiSelect,
    QualityControlsDesktop,
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
        fileName: "",
      },
      displayAttFiles: false,
      attached_files: [],
      qc_attached_files: [],
      chipFilters: [],
      removeFilter: null,
      qualityControlsReports: [],

      sortByList: {
        num: 1,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "לפי:",
        optionLabel: "desc",
        optionValue: "field",
        showClear: false,
        ControlSource: null,
        RowSource: [
          { field: "id", desc: "תאריך פתיחה" },
          { field: "project_desc", desc: "פרויקט" },
          { field: "project_zone1_name", desc: "חללים" },
          { field: "chapter_name", desc: "פרק" },
          { field: "responsible_name", desc: "אחראי לביצוע" },
          { field: "status_name", desc: "סטטוס" },
        ],
        Enabled: true,
        Name: "sortBy",
        FuncOnUpdate: () => {
          this.sortBy();
        },
        DefaultValue: "id",
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
        },
      },
      groupBy: {
        num: 3,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "לפי:",
        optionLabel: "desc",
        optionValue: "column_name",
        showClear: false,
        ControlSource: null,
        RowSource: [
          { column_name: "", desc: "ללא קיבוץ", array: [] },
          { column_name: "project_desc", desc: "פרויקט" },
          { column_name: "chapter_name", desc: "פרקים", array: [] },
          { column_name: "status_name", desc: "סטטוס", array: [] },
        ],
        Enabled: true,
        Name: "groupBy",
        FuncOnUpdate: () => {},
        DefaultValue: "",
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
        },
      },
      header_option_enum: {
        e_sort: 1,
        e_group: 2,
      },
      selected_header_option: null,
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
      if (this.isDataLoaded === false && i < 30000) return;
      clearInterval(interval);
      loadData();
    }, 1);
  },
  created() {
    this.isDesktop = window.innerWidth > 896;
  },
  methods: {
    getQcImagesById(qId) {
      // console.log(
      //   "getQcImagesById",
      //   qId,
      //   this.attached_files.filter(qc => qc.quality_control_id === qId)
      // );
      return this.attached_files.filter((qc) => qc.quality_control_id === qId);
    },
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate(value));
    },
    getField(num) {
      return this.fields.find((f) => f.num === num);
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
      if (filterStr === "") return this.qualityControls;
      else
        return this.qualityControls.filter(
          (e) => e[this.groupBy.ControlSource] === filterStr
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
      this.chipFilters.forEach((filter) => {
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
        .then((result) => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            // הצגת הודעה כאשר אין נתונים
            if (result.Table?.length === 0) {
              this.$toast.add({
                severity: "info",
                summary: "בקרות איכות",
                detail: "אין נתונים להצגה",
                life: 10000,
                closable: true,
              });
            }
            this.qualityControls = result.Table;
            this.qualityControlsReports = result.Table1;
            this.attached_files = result.Table2;
            this.displayFilters = false;
            // console.log(result);
            this.sortBy();
            //grouping

            this.groupBy.RowSource.forEach((group) => {
              if (group.column_name !== "") {
                group.array = this.qualityControls
                  .map((item) => {
                    // console.log(item);
                    return item[group.column_name];
                  })
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort()
                  .map((item) => ({ name: item, show: true }));
              } else {
                group.array = [{ name: "", show: true }];
              }
            });
            console.log("qc-select end", new Date());
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בהצגת בקרות - פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true,
            });
          }
        })
        .catch((error) => {
          console.log("pr_qc_select-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true,
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
        let index = this.chipFilters.findIndex((f) => f.num === fieldNum);
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
        let index = this.chipFilters.findIndex((f) => f.num === field.num);
        if (index >= 0) this.chipFilters.splice(index, 1);
      } else {
        if (this.chipFilters.find((f) => f.num === field.num) !== undefined) {
          this.chipFilters.find((f) => f.num === field.num).ControlSource =
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
    updateQCReporting(updatedQC) {
      let qcIndex = this.qualityControls.findIndex(
        (qc) =>
          qc.quality_control_id === updatedQC.qualityControl.quality_control_id
      );
      this.qualityControls[qcIndex] = updatedQC.qualityControl;
      //במקרה בו הבקרה שנשלחת לתצוגת בקרה בודדת, זהה לזאת שדיווחו עליה- מעדכנים
      if (
        this.qualityControl.quality_control_id ===
        updatedQC.qualityControl.quality_control_id
      ) {
        this.qualityControl = updatedQC.qualityControl;
      }

      if (updatedQC.qcReport) {
        this.qualityControlsReports.push(updatedQC.qcReport);
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
      reader.onload = (event) => {
        // console.log(event.target.result);
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
        .then((result) => {
          if (result === true) {
            this.$toast.add({
              severity: "success",
              summary: "הקובץ צורף בהצלחה",
              detail: "",
              life: 10000,
              closable: true,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בצירוף קובץ",
              detail: "",
              life: 10000,
              closable: true,
            });
          }

          // console.log("uploadB64-result", result); //1/1 uploaded successfully
        })
        .catch((error) => {
          console.log("uploadB64-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בצירוף קבצים",
            detail: error,
            life: 10000,
            closable: true,
          });
        })
        .then(() => {
          this.imageEditor.displayImageEditor = false;
          this.imageEditor.dataUrl = "";
          this.imageEditor.fileName = "";
        });
    },

    addAttFiles(qcId) {
      this.qc_attached_files = this.getQcImagesById(qcId);
      if (this.qc_attached_files?.length > 0) this.displayAttFiles = true;
      else {
        this.$toast.add({
          severity: "warn",
          summary: "קבצים מצורפים",
          detail: "אין נתונים להצגה",
          life: 10000,
          closable: true,
        });
      }
    },
    closeQC() {
      this.displayQualityControl = false;
      this.$store.commit("main/setAppHeader", "ריכוז בקרות");
    },
    getReports(quality_control_id) {
      return this.qualityControlsReports.filter(
        (r) => r.quality_control_id === quality_control_id
      );
    },

    openNewQC() {
      this.$router.push({
        name: "QualityControl",
      });
    },
    backToParent() {
      this.displayQualityControl = false;
      this.$store.commit("main/setAppHeader", "ריכוז בקרות");
    },
  },
  computed: {
    arrActiveGroup() {
      return this.groupBy.RowSource.find(
        (e) => e.column_name === this.groupBy.ControlSource
      )?.array;
    },
    filterToShow() {
      return this.chipFilters.map((f) => {
        return {
          num: f.num,
          Name: f.Name,
          caption: f.Caption,
          value:
            f.apointType === "multiSelect"
              ? f.ControlSource?.length > 1
                ? "(" + f.ControlSource.length.toString() + ")"
                : f.RowSource.filter((field) => {
                    return f.ControlSource.indexOf(field[f.optionValue]) >= 0;
                  })
                    .map((fieldMap) => fieldMap[f.optionLabel])
                    .toString()
              : f.apointType === "text" &&
                f.Format === "Long Date" &&
                Date.parse(f.ControlSource) === Date.parse(f.ControlSource)
              ? Intl.DateTimeFormat("en-GB").format(f.ControlSource)
              : f.apointType === "checkbox"
              ? ""
              : f.ControlSource,
        };
      });
    },
    qcStatuses() {
      return qcStatuses;
    },
    images() {
      return this.qc_attached_files.map((img) => ({
        ID: img.ID,
        itemImageSrc: img.fileName,
        thumbnailImageSrc: img.fileName,
        alt: img.SrcFile,
        title: img.SrcFile,
      }));
    },
    ...mapState({
      userID: (state) => +state.api.userID,
      isDataLoaded: (state) => state.qc.isDataLoaded,
    }),
    ...mapGetters({
      getAllStatuses: "qc/getStatuses",
      getResponsibles: "qc/getResponsibles",
      getProjectsUser: "qc/getProjectsUser",
      getContractors: "qc/getContractors",
    }),
  },
  watch: {
    qualityControls: function () {
      // console.log("QC", this.qualityControls[0]);
    },
  },
  unmounted() {},
};
</script>

<style scoped lang="scss">
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
    max-width: 500px;
    margin: 6px;
    cursor: pointer;
    background-color: white;
    border-right-style: solid;
    border-right-width: 7px;
  }
  .qc-details {
    display: grid;
    grid-template-columns: 27% 25% 48%;
    // grid-template-rows: 1.5fr 1fr 1fr 1fr 1.5fr;
    // grid-auto-rows: 20px 10px 10px 10px 20px;
    // height: 50px;
  }
  .qc-details > div:nth-child(1) {
    //כותרת הבקרה -> תיאור
    grid-column-start: 1;
    grid-column-end: 4;
    max-height: 45px;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
  }
  .qc-details > div:nth-child(2) {
    //פרויקט
    grid-column-start: 1;
    grid-column-end: 4;
    max-height: 48px;
    overflow: hidden;
  }
  .qc-details > div:nth-child(5) {
    //סטטוס
    grid-column-start: 1;
    grid-column-end: 2;
    max-height: 48px;
    overflow: hidden;
  }
  .qc-details > div:nth-child(4) {
    //פרק
    grid-column-start: 2;
    grid-column-end: 4;
    max-height: 48px;
    overflow: hidden;
    text-align: left;
  }
  .qc-details > div:nth-child(5) {
    //אחראי
    grid-column-start: 1;
    grid-column-end: 3;
    max-height: 48px;
    overflow: hidden;
  }
  .qc-details > div:nth-child(6) {
    //קבלן
    grid-column-start: 3;
    grid-column-end: 4;
    max-height: 48px;
    overflow: hidden;
    text-align: left;
  }
  .qc-details > div:nth-child(7) {
    //חללים
    grid-column-start: 1;
    grid-column-end: 4;
    max-height: 48px;
    overflow: hidden;
  }
  .qc-details > div:nth-child(8) {
    //מס בקרה ותאריך פתיחת הבקרה
    grid-column-start: 1;
    grid-column-end: 3;
    padding-top: 8px;
    max-height: 48px;
    overflow: hidden;
  }
  .qc-details > div:nth-child(9) {
    //לחצנים
    grid-column-start: 3;
    grid-column-end: 4;
    overflow: hidden;
    text-align: left;
    button {
      &.buttonIcon {
        width: 33px;
      }
      height: 28.38px;
    }
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
// }
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
// .slide-fade-enter-active {
//   transition: all 0.6s ease;
// }

// .slide-fade-leave-active {
//   transition: all 1s cubic-bezier(0.5, 1, 1, 0.5);
// }

// .slide-fade-enter-from,
// .slide-fade-leave-to {
//   transform: translateY(-100vh);
//   opacity: 0;
// }
// .slide-fade-group-enter-active {
//   transition: all 0.3s ease;
// }

// .slide-fade-group-leave-active {
//   transition: all 0.3s cubic-bezier(0.5, 1, 1, 0.5);
// }

// .slide-fade-group-enter-from,
// .slide-fade-group-leave-to {
//   transform: translateY(-100%);
//   opacity: 0;
// }
.ProjectFilter {
  margin: auto;
  max-width: 950px;
  width: 97%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2px;
  // position: fixed;
  z-index: 10;
  background-color: #f4f4f4;
  width: 100vw;
}
.ProjectFilter #ddlProjects {
  width: 100%;
  text-align: center;
  background-color: transparent;
  font-size: 16px;
  color: #6d8dbe;
}

.content-qcs {
  // position: absolute;
  // top: 111px;
  // margin-top: 10px;
  overflow: scroll;
}
.header-btn {
  display: flex;
  // width: 97%;
  // margin-right: auto;
  // margin-left: auto;
  justify-content: center;
}
.header-btn button {
  height: 40px;
}
.header-select {
  display: flex;
  // background-color: white;
  justify-content: space-between;
  label {
    margin: auto 10px;
  }
  .header-select-ddl {
    width: 200px;
  }
  .toggleButton {
    border: none;
    height: 100%;
  }
  .cancelBtn {
    background-color: transparent;
    border: none;
  }
}
.selected-option {
  background-color: #6d8dbe !important;
  color: white !important;
}
.top-grid {
  // display: grid;
  // grid-template-rows: 1fr 1fr 1fr;
  // grid-auto-rows: 50px 50px 50px;
  .ProjectFilter {
    grid-row-start: 1;
    grid-row-end: 1;
  }
  .chipFilters {
    margin-top: 45px;
    z-index: 2;
    &.m-10 {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .header-content {
    grid-row-start: 3;
    grid-row-end: 3;
  }
}
</style>
<style>
.ProjectFilter .p-multiselect .p-multiselect-trigger {
  position: absolute !important;
  top: 12px;
  left: 2px;
  background-color: #f4f4f4;
}
</style>
