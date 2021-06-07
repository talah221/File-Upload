<template>
  <input
    type="file"
    v-show="false"
    @change="uploadImage"
    ref="evClickFile"
    accept=".JPEG,.JPG,.PNG ,.GIF"
  />
  <Dialog v-model:visible="displaySelectPlan" modal>
    <template #header>
      <h3 style="margin: auto">בחירת תוכנית</h3>
    </template>
    <div>
      <SelectPlan
        :apartmentId="apartmentId"
        @displayPlan="displayPlan"
        @close="displaySelectPlan = false"
      ></SelectPlan>
    </div>
  </Dialog>

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
        @addPoto="closeReportingAndAddPoto"
      />
    </div>
    <template #footer> </template>
  </Dialog>

  <galleria-full
    v-if="displayAttFiles"
    :images="images"
    :displayFullScreen="true"
    @closeGalleria="displayAttFiles = false"
  ></galleria-full>

  <ImageEditor
    v-if="imageEditor.displayImageEditor"
    @saveImage="saveImage"
    :dataUrl="imageEditor.dataUrl"
    @cancel="cancelImage"
  ></ImageEditor>
  <div class="container" v-show="!isDesktop || qcMode === qcModes_enum.e_new">
    <div v-show="!imageEditor.displayImageEditor">
      <Button
        v-if="qcMode === qcModes_enum.e_new"
        @click="backToParent"
        icon="pi pi-angle-right"
      ></Button>
      <h3 v-if="isDesktop">פתיחת בקרה חדשה</h3>
      <div class="newQcGridDesctop1">
        <div
          :class="isDesktop ? 'newQcGridDesctop' : 'single_form'"
          v-if="qcMode === qcModes_enum.e_new"
          ref="gridLayout"
        >
          <div class="divider"></div>
          <div
            class="field p-d-flex p-ai-center p-m-2"
            :class="field.Name"
            v-for="(field, i) of detailsFields"
            :key="i"
          >
            <label :for="field.Name">{{ field.Caption }}</label>
            <div class="p-d-flex p-flex-column" ref="" :id="field.Name">
              <a-point-textbox
                :field="field"
                :model-value="field.ControlSource"
                @update:model-value="field.ControlSource = $event"
                v-if="field.apointType == 'text'"
              ></a-point-textbox>
              <a-point-checkbox
                v-else-if="field.apointType == 'checkbox'"
                :field="field"
                :model-value="field.ControlSource"
                @update:model-value="field.ControlSource = $event"
              ></a-point-checkbox>
              <a-point-dropdown
                v-else-if="field.apointType == 'dropdown'"
                :field="field"
                :model-value="field.ControlSource"
                @update:model-value="updateField(field, $event)"
              ></a-point-dropdown>

              <Textarea
                v-else-if="field.apointType == 'textarea'"
                :field="field"
                :model-value="field.ControlSource"
                @update:model-value="updateField(field, $event)"
                autoResize
                :disabled="!field.Enabled || field.Locked"
                :rows="1"
                :class="field.required && field.check ? 'p-invalid' : ''"
              ></Textarea>
              <!-- style="resize: none" -->
              <span class="error p-mr-2" v-if="field.check"> * שדה חובה </span>
            </div>
          </div>
        </div>
        <div
          v-if="qcMode && qcMode !== qcModes_enum.e_new"
          class="p-ml-2 p-mr-2"
        >
          <div class="qc-btns p-mb-2">
            <span v-if="qcMode === qcModes_enum.e_open">
              <QualityControlOpen
                @plans="selectPlan"
                @reporting="reporting"
                :apartmentId="apartmentId"
                :allow_edit="qualityControl.allow_edit_open_qc"
              />
            </span>
            <span v-else-if="qcMode === qcModes_enum.e_close">
              <Button
                :disabled="apartmentId === 0"
                label="צפה בתכניות"
                @click="selectPlan"
                icon="pi pi-file-pdf"
                class="p-button-info p-button-outlined p-button-sm p-ml-2"
              ></Button>
              <Button
                label="צפה בקבצים"
                icon="pi pi-folder-open"
                @click="attFiles"
                class="p-button-sm"
              ></Button>
            </span>
          </div>
          <div class="qc-not-desktop">
            <div>פרויקט:</div>
            <div class="">{{ qualityControl.project_desc }}</div>
            <div>סטטוס:</div>
            <div>{{ qualityControl.status_name }}</div>
            <div>תיאור:</div>
            <div>
              {{ qualityControl.quality_control_desc }}
            </div>
            <div>מיקום:</div>
            <div>
              {{ qualityControl.project_zone1_name }} -
              {{ qualityControl.project_zone2_name }} -
              {{ qualityControl.project_zone3_name }}
            </div>
            <div>פרק:</div>
            <div>{{ qualityControl.chapter_name }}</div>
            <div>אחראי לביצוע:</div>
            <div>{{ qualityControl.responsible_name }}</div>
            <div>קבלן:</div>
            <div>{{ qualityControl.contractor_name }}</div>
            <div>סוג ליקוי:</div>
            <div>{{ qualityControl.impairment_desc }}</div>
            <div>רמת חומרה:</div>
            <div>{{ qualityControl.level_desc }}</div>
            <div>יעד לביצוע:</div>
            <div>{{ qualityControl.formattedPlaned_date }}</div>
            <div>פותח הבקרה:</div>
            <div>{{ qualityControl.creater_name }}</div>
            <template v-if="qcMode === qcModes_enum.e_close">
              <div>סוגר הבקרה:</div>
              <div>{{ qualityControl.closed_name }}</div>
              <div>תאריך סגירה:</div>
              <div>{{ qualityControl.formated_closed_date }}</div>
            </template>
          </div>
        </div>

        <div v-if="qcMode === qcModes_enum.e_new">
          <QualityControlAdd
            ref="buttonsControl"
            @saveClose="saveClose"
            :apartmentId="apartmentId"
            @plans="selectPlan"
            @addNewQC="addNewQC"
            @addPoto="addPoto"
          />
        </div>
        <div v-if="qcMode === qcModes_enum.e_open">
          <q-creports class="p-mb-2" :QCreports="qcReports"></q-creports>

          <galleria-full :images="images"></galleria-full>
        </div>
        <div v-else-if="qcMode === qcModes_enum.e_close">
          <q-creports :QCreports="qcReports"></q-creports>

          <div class="qc-btns p-mr-2 p-ml-2">
            <Button
              label="פתח בקרה מחדש"
              @click="openCloseQC"
              class="p-button-sm"
              :disabled="!qualityControl.allow_to_open_closed_qc"
            ></Button>
          </div>
        </div>
        <div v-else-if="qcMode === qcModes_enum.e_canceled">
          <q-creports :QCreports="qcReports"></q-creports>
          <galleria-full :images="images"></galleria-full>
        </div>
      </div>
    </div>
  </div>
  <section
    class="quality-control-dekstop"
    v-if="
      isDesktop &&
        qcMode &&
        qcMode !== qcModes_enum.e_new &&
        !imageEditor.displayImageEditor
    "
  >
    <div class="qc-container">
      <div class="qc-preview">
        <h5>
          מספר בקרה: <span>{{ qualityControl.quality_control_id }}</span>
        </h5>
        <h5>
          תאריך פתיחה: <span>{{ qualityControl.formattedCreate_date }}</span>
        </h5>
      </div>
      <div class="qc-info">
        <div class="info-first">
          <h5>
            סטטוס: <span> {{ qualityControl.status_name }}</span>
          </h5>
          <h5>
            ימי פיגור: <span> {{ qualityControl.pigur }} </span>
          </h5>
          <h5>
            פרק: <span>{{ qualityControl.chapter_name }}</span>
          </h5>
          <h5>
            סוג ליקוי: <span>{{ qualityControl.chapter_name }}</span>
          </h5>
          <h5>
            רמת חומרה: <span>{{ qualityControl.impairment_desc }}</span>
          </h5>

          <div class="info-location">
            <h5>מיקום:</h5>
            <h5>
              חלל 1: <span>{{ qualityControl.project_zone1_name }}</span>
            </h5>
            <h5>
              חלל 2: <span>{{ qualityControl.project_zone2_name }}</span>
            </h5>
            <h5>
              חלל 3: <span> {{ qualityControl.project_zone3_name }}</span>
            </h5>
          </div>
        </div>
        <div class="info-second-and-btns">
          <div class="info-second">
            <h5>
              פותח הבקרה: <span>{{ qualityControl.creater_name }}</span>
            </h5>
            <h5>
              אחראי לביצוע: <span>{{ qualityControl.responsible_name }}</span>
            </h5>
            <h5>
              יעד לביצוע:
              <span>{{ qualityControl.formattedPlaned_date }}</span>
            </h5>
            <h5>
              קבלן:
              <span>{{ qualityControl.contractor_name }}</span>
            </h5>
          </div>
          <div class="btns">
            <QualityControlOpen
              :ref="isDesktop ? 'QualityControlOpen_' : ''"
              v-if="qcMode === qcModes_enum.e_open"
              @plans="selectPlan"
              @reporting="reporting"
              :apartmentId="apartmentId"
              :allow_edit="qualityControl.allow_edit_open_qc"
            />
            <!-- //todo להוסיף נתונים של בקרה סגורה ב descktop -->
          </div>
        </div>
      </div>
      <div class="qc-desc">
        <Textarea
          :value="qualityControl.impairment_desc"
          :autoResize="false"
          disabled
          rows="1"
          cols="70"
        />
      </div>
      <div class="qc-files">
        <h5>קבצים מצורפים:</h5>
        <div class="the-files">
          <galleria-full :images="images"></galleria-full>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import APointTextbox from "@/components/APoint-textbox.vue";
import APointCheckbox from "@/components/APoint-checkbox.vue";
import APointDropdown from "@/components/APoint-dropdown.vue";
import { callProc, apiParam, apiPType, uploadB64 } from "../services/APointAPI";
import { mapState, mapGetters } from "vuex";
import QualityControlAdd from "@/components/QualityControlAdd.vue";
import SelectPlan from "@/components/SelectPlan.vue";
import { Nz } from "../services/APointAPI";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import ImageEditor from "@/components/ImageEditor.vue";
import QualityControlOpen from "@/components/QualityControlOpen.vue";
import QCReporting from "@/components/QCReporting.vue";
import { qcStatuses, fileTypes, spinnerInstances } from "@/scripts/enums.js";
import QCreports from "../components/QCreports.vue";
import GalleriaFull from "@/components/GalleriaFull.vue";
import { pr_qc_reporting_ins } from "@/scripts/db.js";

export default {
  name: "QualityControl",
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    Button,
    QualityControlAdd,
    Dialog,
    Textarea,
    SelectPlan,
    ImageEditor,
    QualityControlOpen,
    QCReporting,
    QCreports,
    GalleriaFull
  },
  props: {
    qualityControl: {
      type: Object,
      require: false
    },
    qcReports: {
      type: Object,
      require: false
    },
    qcImages: {
      type: Array,
      require: false
    }
  },
  emits: ["close", "closeReportingAndAddPoto", "updateQCReporting"],
  data() {
    return {
      fields: [
        {
          num: 1,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרויקט:",
          optionLabel: "ProjectName",
          optionValue: "ProjectId",
          showClear: true,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "projectId",
          FuncOnUpdate: value => {
            this.getField(this.fields_enum.e_zone1).ControlSource = null;
            this.getField(this.fields_enum.e_zone2).ControlSource = null;
            this.getField(this.fields_enum.e_zone3).ControlSource = null;
            this.getField(this.fields_enum.e_responsibles).ControlSource = null;
            this.getDdlDataLinkedToProject();
            this.$store.commit("qc/setSelectedProjectId", value);
          }
        },

        {
          num: 3,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סטטוס:",
          optionLabel: "status_name",
          optionValue: "status_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "status",
          DefaultValue: qcStatuses.e_draft,
          AllRowSource: null
        },
        {
          num: 12,
          apointType: "textarea",
          check: false,
          required: true,
          Caption: "תיאור:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "description"
        },
        {
          num: 7,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרק:",
          optionLabel: "chapter_name",
          optionValue: "chapter_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "chapter"
        },
        {
          num: 10,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סוג ליקוי:",
          optionLabel: "impairment_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "impairment"
        },
        {
          num: 11,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "רמת חומרה:",
          optionLabel: "level_desc",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "severityLevel"
        },
        {
          num: 4,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 1:",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone1",
          FuncOnUpdate: () => {
            this.getField(this.fields_enum.e_zone2).ControlSource = null;
            this.getField(this.fields_enum.e_zone3).ControlSource = null;
            this.filterZone2();
          }
        },
        {
          num: 5,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "חלל 2:",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone2",
          AllRowSource: null,
          FuncOnUpdate: () => {
            this.getField(this.fields_enum.e_zone3).ControlSource = null;
            this.filterZone3();
          }
        },
        {
          num: 6,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "חלל 3:",
          optionLabel: "project_zone_name",
          optionValue: "project_zones_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "zone3",
          AllRowSource: null
        },

        {
          num: 8,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "אחראי לביצוע:",
          optionLabel: "user_rank_name",
          optionValue: "rank_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsibles"
        },
        {
          num: 9,
          apointType: "text",
          check: false,
          required: true,
          Caption: "יעד לביצוע:",
          minDate: null,
          maxDate: null,
          manualInput: false,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: "",
          Enabled: true,
          Name: "planedDate",
          showIcon: true
        },

        {
          num: 13,
          apointType: "dropdown",
          check: false,
          required: false,
          Caption: "קבלן:",
          optionLabel: "contractor_name",
          optionValue: "ID",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "contractor_id"
        },
        {
          num: 2,
          apointType: "text",
          check: false,
          required: false,
          Caption: "פותח הבקרה:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "creater_name"
        },
        {
          num: 14,
          apointType: "text",
          check: false,
          required: false,
          Caption: "סוגר הבקרה:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "closed_name"
        },
        {
          num: 15,
          apointType: "text",
          check: false,
          required: false,
          Caption: "ת.סגירה:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "formated_closed_date"
        },

        {
          num: 16,
          apointType: "text",
          check: false,
          required: false,
          Caption: "מספר בקרה:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "quality_control_id"
        }
      ],
      fields_enum: {
        e_projectId: 1,
        e_creater_name: 2,
        e_status: 3,
        e_zone1: 4,
        e_zone2: 5,
        e_zone3: 6,
        e_chapter: 7,
        e_responsibles: 8,
        e_planedDate: 9,
        e_impairment: 10,
        e_severityLevel: 11,
        e_description: 12,
        e_contractor_id: 13,
        e_closed_name: 14,
        e_closed_date: 15,
        e_qc_id: 16
      },
      qcMode: null,
      qcModes_enum: {
        e_new: 1,
        e_open: 2,
        e_close: 3,
        e_canceled: 4
      },
      displaySelectPlan: false,
      selectedPlan: null,
      imageEditor: {
        displayImageEditor: false,
        dataUrl: "",
        fileName: ""
      },
      displayReporting: false,
      isDesktop: false,
      attached_files: [],
      displayAttFiles: false
    };
  },
  created() {
    this.isDesktop = window.innerWidth > 890; // false; //todo change window.innerWidth > 896; //
  },
  mounted() {
    this.getQcData();
  },
  methods: {
    getQcData() {
      let header = "";

      if (this.qualityControl === undefined) {
        //בקרה חדשה
        this.getDdlData();
        this.qcMode = this.qcModes_enum.e_new;
        header = "בקרה חדשה";
        this.getField(this.fields_enum.e_qc_id).ControlSource = null;
        if (this.$store.state.qc.selectedProjectId) {
          this.getField(
            this.fields_enum.e_projectId
          ).ControlSource = this.$store.state.qc.selectedProjectId;
          this.getField(this.fields_enum.e_projectId).FuncOnUpdate();
        }
        //הצגת בחירת פרויקט רק אם למשתמש יש הרשאה על יותר מפרויקט אחד
        // if (
        //   this.getField(this.fields_enum.e_projectId).RowSource.length === 1
        // ) {
        //   this.getField(
        //     this.fields_enum.e_projectId
        //   ).ControlSource = this.getField(
        //     this.fields_enum.e_projectId
        //   ).RowSource[0].ProjectId;
        // }
      } else {
        //בקרה קיימת
        header =
          "ב-" +
          this.qualityControl.quality_control_id +
          " - " +
          this.qualityControl.formattedCreate_date;

        if (this.qualityControl.status_id === qcStatuses.e_close) {
          this.qcMode = this.qcModes_enum.e_close;
        } else if (this.qualityControl.status_id === qcStatuses.e_canceled) {
          this.qcMode = this.qcModes_enum.e_canceled;
        } else {
          this.qcMode = this.qcModes_enum.e_open;
        }
        //הכנסת נתונים של הבקרה
        this.fields.forEach(field => {
          switch (field.num) {
            case this.fields_enum.e_qc_id:
              field.ControlSource = this.qualityControl.quality_control_id;
              break;

            case this.fields_enum.e_status:
              field.ControlSource = this.qualityControl.status_id;
              break;

            case this.fields_enum.e_projectId:
              field.ControlSource = this.qualityControl.project_id;
              break;

            case this.fields_enum.e_zone1:
              field.ControlSource = this.qualityControl.zone_1_id;
              this.filterZone2();
              break;

            case this.fields_enum.e_zone2:
              field.ControlSource = this.qualityControl.zone_2_id;
              this.filterZone3();
              break;

            case this.fields_enum.e_zone3:
              field.ControlSource = this.qualityControl.zone_3_id;
              break;

            case this.fields_enum.e_chapter:
              field.ControlSource = this.qualityControl.chapter_id;
              break;

            case this.fields_enum.e_responsibles:
              field.ControlSource = this.qualityControl.responsible_id;
              break;

            case this.fields_enum.e_planedDate:
              field.ControlSource = new Date(this.qualityControl.planed_date);
              break;

            case this.fields_enum.e_impairment:
              field.ControlSource = this.qualityControl.impairment_id;
              break;

            case this.fields_enum.e_severityLevel:
              field.ControlSource = this.qualityControl.hardware_level_id;
              break;

            case this.fields_enum.e_description:
              field.ControlSource = this.qualityControl.quality_control_desc;
              break;

            case this.fields_enum.e_closed_name:
              field.ControlSource = this.qualityControl.closed_name;
              break;

            case this.fields_enum.e_closed_date:
              field.ControlSource = this.qualityControl.formattedCreate_date;
              break;
            case this.fields_enum.e_creater_name:
              field.ControlSource = this.qualityControl.creater_name;
              break;
            case this.fields_enum.e_contractor_id:
              field.ControlSource = this.qualityControl.contractor_id;
              break;
          }
        });
        // this.getAttachedFiles();
        this.attached_files = this.qcImages;
      }
      this.$store.commit("main/setAppHeader", header);
      this.setPermission();
    },
    clickFile() {
      this.$refs.evClickFile.click();
    },
    uploadImage(e) {
      let reader = new FileReader();
      reader.onload = event => {
        // console.log(event.target.result);
        this.imageEditor.dataUrl = event.target.result;
        this.imageEditor.displayImageEditor = true;
      };
      this.imageEditor.fileName = e.target.files[0].name;
      reader.readAsDataURL(e.target.files[0]);
    },
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate(value));
    },
    checkData() {
      let flag = false;

      this.fields.forEach(f => {
        if (f.required && (f.ControlSource == null || f.ControlSource == "")) {
          f.check = true;
          flag = true;
        } else f.check = false;
      });
      return flag;
    },
    getDdlData() {
      this.$store.commit("main/setSpinner", {
        id: spinnerInstances.e_QualityControl_loadDdl,
        flag: true
      });

      let loadData = () => {
        this.getField(
          this.fields_enum.e_projectId
        ).RowSource = this.getProjectsUser();
        this.getField(
          this.fields_enum.e_status
        ).AllRowSource = this.getAllStatuses();
        this.getField(this.fields_enum.e_status).RowSource = this.getStatus();

        this.getField(
          this.fields_enum.e_chapter
        ).RowSource = this.getChapters();

        this.getField(
          this.fields_enum.e_impairment
        ).RowSource = this.getImpairment();
        this.getField(
          this.fields_enum.e_severityLevel
        ).RowSource = this.getHardwareLevel();
        this.getDdlDataLinkedToProject();
      };
      let i = 0;
      let interval = setInterval(() => {
        i++;
        // console.log("interval", i);
        if (this.isDataLoaded === false && i < 30000) return;
        clearInterval(interval);
        loadData();
        this.$store.commit("main/setSpinner", {
          id: spinnerInstances.e_QualityControl_loadDdl,
          flag: false
        });
      }, 1);
    },
    getDdlDataLinkedToProject() {
      let projectId = this.getField(this.fields_enum.e_projectId).ControlSource;
      let zone1, zone2, zone3, responsible, contractor;

      zone1 = this.getField(this.fields_enum.e_zone1);
      zone2 = this.getField(this.fields_enum.e_zone2);
      zone3 = this.getField(this.fields_enum.e_zone3);
      responsible = this.getField(this.fields_enum.e_responsibles);
      contractor = this.getField(this.fields_enum.e_contractor_id);

      if (projectId !== null) {
        zone1.RowSource = this.getZone1(projectId);
        zone2.AllRowSource = this.getZone2(projectId);
        zone3.AllRowSource = this.getZone3(projectId);
        this.filterZone2();
        responsible.RowSource = this.getResponsibles(projectId);
        contractor.RowSource = this.getContractors(projectId);
      } else {
        zone1.RowSource = null;
        zone2.AllRowSource = null;
        zone3.AllRowSource = null;
        this.filterZone2();

        responsible.RowSource = null;
        contractor.RowSource = null;
      }
    },
    saveClose() {
      const funcOnSucces = () => {
        this.$toast.add({
          severity: "success",
          summary: "הבקרה נוספה בהצלחה",
          detail: "",
          life: 10000,
          closable: true
        });
        this.$router.push({
          name: "QualityControls",
          params: { filter: "ICreated" }
        });
      };

      this.saveData(funcOnSucces);
    },
    saveData(funcOnSuccess) {
      if (this.checkData() === true) return;

      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam(
          "quality_control_id",
          this.getField(this.fields_enum.e_qc_id).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "project_id",
          this.getField(this.fields_enum.e_projectId).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "status_id",
          this.getField(this.fields_enum.e_status).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "zone_1_id",
          this.getField(this.fields_enum.e_zone1).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "zone_2_id ",
          this.getField(this.fields_enum.e_zone2).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "zone_3_id ",
          this.getField(this.fields_enum.e_zone3).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "chapter_id",
          this.getField(this.fields_enum.e_chapter).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "quality_control_desc",
          this.getField(this.fields_enum.e_description).ControlSource,
          apiPType.NVarChar
        ),
        apiParam(
          "responsible_id",
          this.getField(this.fields_enum.e_responsibles).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "planed_date",
          this.getField(this.fields_enum.e_planedDate).ControlSource,
          apiPType.SmallDateTime
        ),
        apiParam(
          "impairment_id",
          this.getField(this.fields_enum.e_impairment).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "hardware_level_id",
          this.getField(this.fields_enum.e_severityLevel).ControlSource,
          apiPType.Int
        ),
        apiParam(
          "contractor_id ",
          this.getField(this.fields_enum.e_contractor_id).ControlSource,
          apiPType.Int
        )
      ];
      // console.log("pr_qc_ins_upd-procParams", procParams);
      callProc("pr_qc_ins_upd", procParams)
        .then(result => {
          result = JSON.parse(result);
          // console.log("pr_qc_ins_upd-result", result);
          if (result.procReturnValue === 0) {
            this.getField(this.fields_enum.e_qc_id).ControlSource =
              result.Table[0].quality_control_id;
            funcOnSuccess();
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בעדכון בקרה - פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true
            });
          }
        })
        .catch(error => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בעדכון בקרה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
          console.log("pr_qc_ins_upd-error", error);
        });
    },
    filterZone2() {
      const zone1 = this.getField(this.fields_enum.e_zone1).ControlSource;
      let zone2 = this.getField(this.fields_enum.e_zone2);
      // zone2.ControlSource = null;
      if (zone1 !== null && zone2.AllRowSource !== null) {
        zone2.RowSource = zone2.AllRowSource.filter(
          zone => zone.parent_id === zone1
        );
      } else {
        zone2.RowSource = null;
      }
      this.filterZone3();
    },
    filterZone3() {
      const zone2 = this.getField(this.fields_enum.e_zone2).ControlSource;
      let zone3 = this.getField(this.fields_enum.e_zone3);
      // zone3.ControlSource = null;
      if (zone2 !== null && zone3.AllRowSource !== null) {
        zone3.RowSource = zone3.AllRowSource.filter(
          zone => zone.parent_id === zone2
        );
      } else {
        zone3.RowSource = null;
      }
    },
    getField(num) {
      return this.fields.find(f => f.num === num);
    },
    getStatus() {
      if (this.qcMode === this.qcModes_enum.e_new) {
        return this.getField(this.fields_enum.e_status).AllRowSource.filter(
          status =>
            [
              qcStatuses.e_draft,
              qcStatuses.e_existing_situation,
              qcStatuses.e_reminder
            ].indexOf(status.status_id) >= 0
        );
      }
      return this.getField(this.fields_enum.e_status).AllRowSource;
    },
    selectPlan() {
      if (this.apartmentId > 0 && this.checkData() === false) {
        this.selectedPlan = null;
        this.displaySelectPlan = true;
      }
    },
    displayPlan(plan) {
      this.selectedPlan = plan;
      this.displaySelectPlan = false;
      if (this.selectedPlan != null) {
        this.saveData(() => {
          let procParams = [
            apiParam("user_exec", this.userID, apiPType.Int),
            apiParam("plan_id", plan.ID, apiPType.Int)
          ];
          // console.log("pr_qc_get_planes-procParams", procParams);
          callProc("pr_qc_get_plan_file_name", procParams)
            .then(result => {
              result = JSON.parse(result);
              if (result.Table.length > 0) {
                this.imageEditor.dataUrl =
                  result.Table[0].fileName + this.$store.state.api.sessionToken;
                // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAYAAABxyNlsAAAD+UlEQVR4Xu3Y3U5cVRiH8WftPXv2nmEopUEwBVOZALFii0ar/bCNMWn86JEnnnjSy/AOvAAvoDfgmTGa2mgNmqhQW4uWNqaAmRiDUtphYPb3Xs0MTTCGNkD6HvHO8eY/4cfDypox6fIfNl1pUDo0jAl6cYMecH2MWwLjgDHoa28Cpn131q5PX6Jy/B3IcwhXybMMb+AIfv0EbrVfgfdmi8nCNfvg8084eOFj8tUGG3NfYdIQt3cQt/8wwcRZnGrfHuf3948ZmyW2eflT/ImzhAuz2LhF37mLYAuShRnwAoKxUxi/RwveZSvG5plt3/ySaPE63uAoJgkpDdbxRl7C5inpwk84PYcoDU/i1AYwjrPLt9i/jxtrC5v8Nc/a9CUOnPoIp3eA9M/r4Dh4I8cwjkvSuIkxThfYPXhYgXfYi7GdV9QinPsam8dUpi5gs4S08StFtE5l/DTWQNqYw2Yp5SOv4PQ+o0fEDoA3cW2B3bhP+PsViiSmdvJDinije+baeIPqy+9TRC3ihRmMF+DX38AEtR3M7+9HuribBJZi7V/Wb3yBU/KoHnsXazOi299jjCF44RxFa4XozjRu55o2dhInOKAFP6Gf/+BuAufNf0gWZ8ijFsH4GYxXJlm6Qb6xCqXOhwsPu34PU+mjcvQtnB69Bz/O93+4jwpuPyBevEbeWqE6eZ4iDWnf+hZTKlMePkp8+7vuTaI8NEYweR5Truzv///H/Pbb4EL3DA6bxHd+IG0ud69o6b0GQf0EydI13Eov3shxors/4o2+jv/smOJuI7At7tYZvEJ79jPi+39Te+0DiuYyNosJJt7EVPtJFn/GFgXB+GnF3R3u1hkc/XaFrPPlztAowcQZ3P5hbNKmPXeZ0lAd/7kpxd097qMzeH2VaP4qtsgIXnwbx68R3fqmC1yZeg/j67Vsu7qecCxsPd45gzvXsPb8VQibkMYYv9L9wOH2DQH6teSecTevwZYibBIt/YIpcvznX8Wp9Svszu+5enQ+TYEdHQtP8w3305biCv61FVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XMUVFBCc1nIVV1BAcFrLVVxBAcFpLVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XMUVFBCc1nIVV1BAcFrLVVxBAcFpLVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XEHch0SKbRqgl+f2AAAAAElFTkSuQmCC";
                this.imageEditor.fileName = this.selectedPlan.FileName;
                this.imageEditor.displayImageEditor = true;
              }
            })
            .catch(error => {
              console.log("pr_qc_get_plan_file_name-error", error);
              this.$toast.add({
                severity: "error",
                summary: "שגיאה - פנה לתמיכה",
                detail: error,
                life: 10000,
                closable: true
              });
            });
        });
      }
    },
    addNewQC() {
      const funcOnSucces = () => {
        this.$toast.add({
          severity: "success",
          summary: "הבקרה נוספה בהצלחה",
          detail: "",
          life: 10000,
          closable: true
        });

        this.clearFields();
      };

      this.saveData(funcOnSucces);
    },
    clearFields() {
      this.fields.forEach(f => {
        switch (f.num) {
          case this.fields_enum.e_status:
            f.ControlSource = f.DefaultValue;
            break;
          case this.fields_enum.e_projectId:
            break;
          default:
            f.ControlSource = null;
        }
      });
      this.getDdlDataLinkedToProject();
    },
    saveImage(imageUrl) {
      let closeImageEditor = () => {
        this.imageEditor.displayImageEditor = false;
        this.imageEditor.dataUrl = "";
        this.imageEditor.fileName = "";
      };
      if (this.qcMode == this.qcModes_enum.e_close) {
        this.$toast.add({
          severity: "warn",
          summary: "בקרה סגורה- הקובץ לא נשמר",
          detail: "",
          life: 10000,
          closable: true
        });
        closeImageEditor();
        return;
      }
      let parentType, parentID, createdBy, srcFileName, base64String;
      parentType = fileTypes.e_qualityControl;
      parentID = this.getField(this.fields_enum.e_qc_id).ControlSource;
      createdBy = this.userID;
      srcFileName = this.imageEditor.fileName;
      base64String = imageUrl; //this.imageEditor.dataUrl;
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
            this.getAttachedFiles();
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בצירוף קובץ",
              detail: "",
              life: 10000,
              closable: true
            });
          }

          // console.log("uploadB64-result", result); //1/1 uploaded successfully
        })
        .catch(error => {
          console.log("uploadB64-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בצירוף קבצים",
            detail: error,
            life: 10000,
            closable: true
          });
        })
        .then(() => {
          closeImageEditor();
        });
    },
    addPoto() {
      this.saveData(() => {
        this.clickFile();
      });
    },
    setPermission() {
      //אין צורך היות ומשתמשים בקומבויים רק בבקרה חדשה ותמיד כל השדות מאופשרים
      // let enabledFields;
      // if (this.qcMode === this.qcModes_enum.e_new) enabledFields = true;
      // else enabledFields = false;
      // this.fields.forEach(field => {
      //   field.Enabled = enabledFields;
      // });
    },
    reporting() {
      this.displayReporting = true;
    },
    closeReporting(updatedQC) {
      // //? נתונים לא מתרעננים במסך descktop
      // this.getField(this.fields_enum.e_status).ControlSource =
      //   qualityControl.status_id;
      // this.getField(this.fields_enum.e_responsibles).ControlSource =
      //   qualityControl.responsible_id;
      // this.getField(this.fields_enum.e_contractor_id).ControlSource =
      //   qualityControl.contractor_id;

      // let qcMode;
      // if (qualityControl.status_id === qcStatuses.e_close)
      //   qcMode = this.qcModes_enum.e_close;
      // //הבאת נתונים נוספים מהDB
      // else qcMode = this.qcModes_enum.e_open;
      // if (qcMode !== this.qcMode) {
      //   this.qcMode = qcMode;
      //   this.setPermission();
      // }
      this.displayReporting = false;
      this.$emit("updateQCReporting", updatedQC);
    },
    backToParent() {
      this.$router.push({
        name: "Home"
      });
    },
    closeReportingAndAddPoto(qualityControl) {
      if (qualityControl !== undefined) {
        this.closeReporting(qualityControl);
      } else {
        this.displayReporting = false;
      }

      if (this.qualityControl !== undefined && this.isDesktop) {
        //כאשר במסך גדול ונשלחו נתונים בפרופס מעבירים את בחירת הקובץ והצגת העורך לאבא
        this.$emit("closeReportingAndAddPoto", qualityControl);
      } else {
        this.clickFile();
      }
    },
    attFiles() {
      if (this.attached_files && this.attached_files.length > 0)
        this.displayAttFiles = true;
      else
        this.$toast.add({
          severity: "warn",
          summary: "קבצים מצורפים",
          detail: "אין נתונים להצגה",
          life: 10000,
          closable: true
        });
    },
    openCloseQC() {
      pr_qc_reporting_ins(
        this.qualityControl.quality_control_id,
        qcStatuses.e_open,
        this.qualityControl.responsible_id,
        "בקרה נפתחה מחדש",
        this.qualityControl.contractor_id
      )
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.$toast.add({
              severity: "success",
              summary: "הבקרה נפתחה בהצלחה",
              detail: "",
              life: 3000,
              closable: true
            });
            let updatedQC = {
              qualityControl: result.Table2[0],
              // quality_control_id: result.Table1[0].quality_control_id,
              // status_id: result.Table1[0].new_status_id,
              // responsible_id: result.Table1[0].new_responsible_id,
              // contractor_id: result.Table1[0].new_contractor_id,
              qcReport: result.Table1[0]
            };
            this.closeReporting(updatedQC);
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בפתיחת בקרה מחדש- פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true
            });
            console.log(
              "pr_qc_reporting_ins-error-procReturnValue",
              result.procReturnValue
            );
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
    getAttachedFiles() {
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam(
          "quality_control_id",
          this.getField(this.fields_enum.e_qc_id).ControlSource,
          apiPType.Int
        )
      ];
      callProc("pr_qc_get_attached_files", procParams)
        .then(result => {
          result = JSON.parse(result);
          this.attached_files = result.Table;
        })
        .catch(error => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בהבאת קבצים מצורפים - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
          console.log("pr_qc_get_attached_files-error", error);
        });
    },
    cancelImage() {
      // if (this.qcMode === this.qcModes_enum.e_new)
      this.imageEditor.displayImageEditor = false;
      // else this.displayReporting = false;
    }
  },
  computed: {
    detailsFields() {
      switch (this.qcMode) {
        case this.qcModes_enum.e_close:
          return this.fields.filter(
            field => field.num < this.fields_enum.e_qc_id
          );
        case this.qcModes_enum.e_open:
          return this.fields.filter(
            field => field.num < this.fields_enum.e_closed_name
          );
        default:
          return this.fields.filter(
            field =>
              field.num < this.fields_enum.e_closed_name &&
              field.num !== this.fields_enum.e_creater_name
          );
      }
    },

    apartmentId() {
      if (this.qcMode === this.qcModes_enum.e_new) {
        let allZone2 = this.getField(this.fields_enum.e_zone2).AllRowSource;

        if (allZone2 === undefined || allZone2 === null) return 0;

        let currentZone = allZone2.find(
          zone =>
            zone.project_zones_id ===
            this.getField(this.fields_enum.e_zone2).ControlSource
        );
        if (currentZone === undefined) return 0;
        return Nz(currentZone.apartment_id);
      } else {
        return Nz(this.qualityControl.apartment_id);
      }
    },
    //היה בשימוש בשביל להעביר נתונים לדיווח בקרה והוחלף לפרופס כי לא היה צורך בחישוב זה
    // qcObject() {
    //   return {
    //     quality_control_id: this.getField(this.fields_enum.e_qc_id)
    //       .ControlSource,
    //     project_id: this.getField(this.fields_enum.e_projectId).ControlSource,
    //     status_id: this.getField(this.fields_enum.e_status).ControlSource,
    //     zone_1_id: this.getField(this.fields_enum.e_zone1).ControlSource,
    //     zone_2_id: this.getField(this.fields_enum.e_zone2).ControlSource,
    //     zone_3_id: this.getField(this.fields_enum.e_zone3).ControlSource,
    //     chapter_id: this.getField(this.fields_enum.e_chapter).ControlSource,
    //     responsible_id: this.getField(this.fields_enum.e_responsibles)
    //       .ControlSource,
    //     planed_date: this.getField(this.fields_enum.e_planedDate).ControlSource,
    //     impairment_id: this.getField(this.fields_enum.e_impairment)
    //       .ControlSource,
    //     hardware_level_id: this.getField(this.fields_enum.e_severityLevel)
    //       .ControlSource,
    //     quality_control_desc: this.getField(this.fields_enum.e_description)
    //       .ControlSource
    //   };
    // },
    images() {
      return this.qcImages.map(img => ({
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
      getZone1: "qc/getZone1",
      getZone2: "qc/getZone2",
      getZone3: "qc/getZone3",
      getChapters: "qc/getChapters",
      getResponsibles: "qc/getResponsibles",
      getImpairment: "qc/getImpairment",
      getHardwareLevel: "qc/getHardwareLevel",
      getAllUsers: "qc/getAllUsers",
      getNotDone: "qc/getNotDone",
      getProjectsUser: "qc/getProjectsUser",
      getContractors: "qc/getContractors"
    })
  },
  watch: {
    qualityControl() {
      this.getQcData();
    },
    qcMode() {
      if (this.qcMode === this.qcModes_enum.e_new) {
        this.$nextTick(function() {
          // this.$refs.gridLayout.appendChild(this.$refs.buttonsControl.$el);
        });
      }
    }
  },
  unmounted() {
    this.$store.commit("main/setSpinner", {
      id: spinnerInstances.e_QualityControl_loadDdl,
      flag: false
    });
  }
};
</script>

<style scoped lang="scss">
.container {
  h3 {
    text-align: center;
    text-decoration: underline;
  }
}

.field label {
  min-width: 105px;
  max-width: 105px;
}
.error {
  color: red;
  font-size: 11px;
}
.single_form {
  margin-bottom: 20px;
}

.single_form_buttons {
  display: flex;
  justify-content: space-around;
}
/* זה הגדרות של דסקטופ שאת רשמת אבל אני מוסיף הגדרות נוספות מתחת */
@media screen and (min-width: 896px) {
  #description {
    width: 97% !important;
    // max-width: 950px !important;
  }
  .description label {
    // width: 8% !important;
  }
  .description div {
    // width: 91.5% !important;
  }

  .single_form {
    width: 90%;
    margin: 0 auto;
    // display: grid;
    // grid-template-columns: 5% 10% 30% 30% 10% 5%;
    // grid-template-rows: repeat(20, 1fr);
    .projectId {
      width: 50%;
      grid-column: 2/6;
      label {
        width: 30%;
      }
      div {
        width: 70%;
      }
    }
    .status {
      width: 50%;
      label {
        width: 30%;
      }
      div {
        width: 60%;
      }
    }
    .description {
      display: block !important;
      div {
        width: 100% !important;
      }
    }
    .chapter {
    }
    .impairment {
    }
    .severityLevel {
    }
    .zone1 {
    }
    .zone2 {
    }
    .zone3 {
    }
    .responsibles {
    }
    .planedDate {
    }
    .contractor_id {
    }
  }
}
.quality-control-dekstop {
  width: 80%;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  .qc-container {
    h5 {
      margin: 0;
      padding: 5px;
      span {
        font-weight: 700;
      }
    }
    .qc-preview {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      width: 100%;
    }
    .qc-info {
      margin-top: 35px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      .info-first {
        .info-location {
          margin-top: 25px;
        }
      }
      .info-second-and-btns {
        .info-second {
        }
        .btns {
        }
      }
    }
    .qc-files {
      .the-files {
        display: flex;
        justify-content: center;
        width: 100%;
        // height: 300px;
        img {
        }
      }
    }
  }
}
.qc-not-desktop {
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 5px;
}
.qc-not-desktop > div:nth-child(2n-1) {
  font-weight: 700;
}
.qc-btns {
  text-align: left;
}
.newQcGridDesctop {
  display: grid;
  grid-template-rows: repeat(10, 50px);
  grid-template-columns: 39% 4% 40% 2% 10%;
  justify-content: center;
  gap: 13px 3px;

  // grid-template-columns: 40vw 1px 40vh 30px;
  // grid-template-areas: 40fr 1px 40fr 30px;
  .projectId {
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 2;

    #projectId {
      width: 100%;
    }
  }
  .status {
    grid-row: 2;
    grid-column-start: 1;
    grid-column-end: 2;
    #status {
      width: 100%;
    }
  }
  .description {
    grid-row: 3;
    grid-column-start: 1;
    grid-column-end: -1;
  }
  .chapter {
    grid-row: 4;
    grid-column: 1;
    #chapter {
      width: 100%;
    }
  }
  .impairment {
    grid-row: 5;
    grid-column: 1;
    #impairment {
      width: 100%;
    }
  }
  .severityLevel {
    grid-row: 6;
    grid-column: 1;
    #severityLevel {
      width: 100%;
    }
  }
  .responsibles {
    grid-row: 7;
    grid-column: 1;
    #responsibles {
      width: 100%;
    }
  }
  .contractor_id {
    grid-row: 8;
    grid-column: 1;
    #contractor_id {
      width: 100%;
    }
  }
  .planedDate {
    grid-row: 9;
    grid-column: 1;
  }
  .zone1 {
    grid-row: 4;
    grid-column: 3;
    #zone1 {
      width: 100%;
    }
  }
  .zone2 {
    grid-row: 5;
    grid-column: 3;
    #zone2 {
      width: 100%;
    }
  }
  .zone3 {
    grid-row: 6;
    grid-column: 3;

    #zone3 {
      width: 100%;
    }
  }
  .divider {
    background-color: black;
    display: block;
    grid-column: 2;
    grid-row-start: 4;
    grid-row-end: 9;
    width: 2px;
    justify-self: center;
  }
}
.divider {
  display: none;
}
</style>
