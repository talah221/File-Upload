<template>
  <input
    type="file"
    v-show="false"
    @change="uploadImage"
    ref="evClickFile"
    accept="image/*"
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
      <h3 style="margin: auto">
        דיווח טיפול בבקרה מס' {{ qualityControl.quality_control_id }}
      </h3>
    </template>
    <div>
      <QCReporting
        :qualityControl="qcObject"
        @closeReporting="closeReporting"
        @addPoto="closeReportingAndAddPoto"
      />
    </div>
    <template #footer> </template>
  </Dialog>

  <galleria-full
    v-if="displayAttFiles"
    :images="attached_files"
    :displayFullScreen="true"
    @closeGalleria="displayAttFiles = false"
  ></galleria-full>

  <ImageEditor
    v-if="imageEditor.displayImageEditor"
    @saveImage="saveImage"
    :dataUrl="imageEditor.dataUrl"
    @cancel="displayReporting = false"
  ></ImageEditor>
  <div class="container" v-if="!isDesktop || qcMode === qcModes_enum.e_new">
    <div v-if="!imageEditor.displayImageEditor">
      <Button
        v-if="qcMode !== qcModes_enum.e_new"
        @click="backToParent"
        icon="pi pi-angle-left"
      ></Button>
      <div class="single_form">
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
              style="border: 1px solid #ced4da;"
            ></Textarea>
            <!-- style="resize: none" -->
            <span class="error p-mt-1 p-mr-2" v-if="field.check">
              * שדה חובה
            </span>
          </div>
        </div>
      </div>

      <div v-if="qcMode === qcModes_enum.e_new">
        <QualityControlAdd
          @saveClose="saveClose"
          :apartmentId="apartmentId"
          @plans="selectPlan"
          @addNewQC="addNewQC"
          @addPoto="addPoto"
        />
      </div>
      <div v-else-if="qcMode === qcModes_enum.e_open">
        <galleria-full :images="attached_files"></galleria-full>

        <QualityControlOpen
          @plans="selectPlan"
          @reporting="reporting"
          :apartmentId="apartmentId"
        />
      </div>
      <div v-else-if="qcMode === qcModes_enum.e_close">
        <q-creports :QCreports="qcReports"></q-creports>

        <div class="single_form_buttons">
          <Button
            :disabled="apartmentId === 0"
            label="תוכניות"
            @click="selectPlan"
            icon="pi pi-file-pdf"
          ></Button>
          <Button
            icon="pi pi-folder-open"
            @click="attFiles"
            class="qc-buttons"
          ></Button>
          <Button label="פתח בקרה מחדש" @click="openCloseQC"></Button>
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
              יעד לביצוע: <span>{{ qualityControl.formattedPlaned_date }}</span>
            </h5>
          </div>
          <div class="btns">
            <QualityControlOpen
              v-if="qcMode === qcModes_enum.e_open"
              @plans="selectPlan"
              @reporting="reporting"
              :apartmentId="apartmentId"
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
          <galleria-full :images="attached_files"></galleria-full>
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
    }
  },
  emits: ["close", "closeReportingAndAddPoto", "updateStatus"],
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
          showClear: false,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "projectId",
          FuncOnUpdate: () => {
            this.getField(this.fields_enum.e_zone1).ControlSource = null;
            this.getField(this.fields_enum.e_zone2).ControlSource = null;
            this.getField(this.fields_enum.e_zone3).ControlSource = null;
            this.getField(this.fields_enum.e_responsibles).ControlSource = null;
            this.getDdlDataLinkedToProject();
          }
        },
        {
          num: 2,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "סטטוס:",
          optionLabel: "status_name",
          optionValue: "status_id",
          showClear: false,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "status",
          DefaultValue: qcStatuses.e_draft,
          AllRowSource: null
        },
        {
          num: 3,
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
          num: 4,
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
          num: 5,
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
          num: 6,
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
          num: 7,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "אחראי לביצוע:",
          optionLabel: "user_full_name",
          optionValue: "user_id",
          showClear: true,
          Format: "",
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "responsibles"
        },
        {
          num: 8,
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
          num: 9,
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
          num: 10,
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
          num: 11,
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
          num: 12,
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
          num: 13,
          apointType: "text",
          check: false,
          required: false,
          Caption: "ת.סגירה:",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "formattedCreate_date"
        },
        {
          num: 14,
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
        e_status: 2,
        e_zone1: 3,
        e_zone2: 4,
        e_zone3: 5,
        e_chapter: 6,
        e_responsibles: 7,
        e_planedDate: 8,
        e_impairment: 9,
        e_severityLevel: 10,
        e_description: 11,
        e_closed_name: 12,
        e_closed_date: 13,
        e_qc_id: 14
      },
      qcMode: null,
      qcModes_enum: {
        e_new: 1,
        e_open: 2,
        e_close: 3
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
    this.isDesktop = window.innerWidth > 896;
  },
  mounted() {
    this.getDdlData();
    this.getQcData();
  },
  methods: {
    getQcData() {
      let header = "";

      if (this.qualityControl === undefined) {
        //בקרה חדשה
        this.qcMode = this.qcModes_enum.e_new;
        header = "בקרה חדשה";
        this.getField(this.fields_enum.e_qc_id).ControlSource = null;
        //הצגת בחירת פרויקט רק אם למשתמש יש הרשאה על יותר מפרויקט אחד
        if (
          this.getField(this.fields_enum.e_projectId).RowSource.length === 1
        ) {
          this.getField(
            this.fields_enum.e_projectId
          ).ControlSource = this.getField(
            this.fields_enum.e_projectId
          ).RowSource[0].ProjectId;
        }
      } else {
        //בקרה פתוחה/סגורה
        header = "בקרה מס' " + this.qualityControl.quality_control_id;

        if (this.qualityControl.status_id === qcStatuses.e_close) {
          this.qcMode = this.qcModes_enum.e_close;
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
          }
        });
        this.getAttachedFiles();
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
        console.log(event.target.result);
        this.imageEditor.dataUrl = event.target.result;
        this.imageEditor.displayImageEditor = true;
      };
      this.imageEditor.fileName = e.target.files[0].name;
      reader.readAsDataURL(e.target.files[0]);
    },
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate());
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
      let zone1, zone2, zone3, responsible;

      zone1 = this.getField(this.fields_enum.e_zone1);
      zone2 = this.getField(this.fields_enum.e_zone2);
      zone3 = this.getField(this.fields_enum.e_zone3);
      responsible = this.getField(this.fields_enum.e_responsibles);

      if (projectId !== null) {
        zone1.RowSource = this.getZone1(projectId);
        zone2.AllRowSource = this.getZone2(projectId);
        zone3.AllRowSource = this.getZone3(projectId);
        this.filterZone2();
        responsible.RowSource = this.getResponsibles(projectId);
      } else {
        zone1.RowSource = null;
        zone2.AllRowSource = null;
        zone3.AllRowSource = null;
        this.filterZone2();

        responsible.RowSource = null;
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
        )
      ];
      // console.log("pr_qc_ins_upd-procParams", procParams);
      callProc("pr_qc_ins_upd", procParams)
        .then(result => {
          result = JSON.parse(result);
          console.log("pr_qc_ins_upd-result", result);
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
      console.log("selected plan ", plan);
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
                this.imageEditor.dataUrl = result.Table[0].fileName;
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
          closeImageEditor();
        });
    },
    addPoto() {
      this.saveData(() => {
        this.clickFile();
      });
    },
    setPermission() {
      let enabledFields;
      if (this.qcMode === this.qcModes_enum.e_new) enabledFields = true;
      else enabledFields = false;
      this.fields.forEach(field => {
        field.Enabled = enabledFields;
      });
    },
    reporting() {
      this.displayReporting = true;
    },
    closeReporting(qualityControl) {
      //? נתונים לא מתרעננים במסך descktop
      this.getField(this.fields_enum.e_status).ControlSource =
        qualityControl.status_id;
      this.getField(this.fields_enum.e_responsibles).ControlSource =
        qualityControl.responsible_id;

      let qcMode;
      if (qualityControl.status_id === qcStatuses.e_close)
        qcMode = this.qcModes_enum.e_close;
      else qcMode = this.qcModes_enum.e_open;
      if (qcMode !== this.qcMode) {
        this.qcMode = qcMode;
        this.setPermission();
      }
      this.displayReporting = false;
    },
    backToParent() {
      this.$emit("close");
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
      this.getField(this.fields_enum.e_status).ControlSource =
        qcStatuses.e_open;
      this.saveData(() => {
        this.qcMode = this.qcModes_enum.e_open;
        this.setPermission();
        this.$emit(
          "updateStatus",
          this.getField(this.fields_enum.e_qc_id).ControlSource,
          qcStatuses.e_open
        );
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
    }
  },
  computed: {
    detailsFields() {
      if (this.qcModes_enum.e_close === this.qcMode) {
        return this.fields.filter(
          field => field.num < this.fields_enum.e_qc_id
        );
      } else {
        return this.fields.filter(
          field => field.num < this.fields_enum.e_closed_name
        );
      }
    },

    apartmentId() {
      let allZone2 = this.getField(this.fields_enum.e_zone2).AllRowSource;

      if (allZone2 === undefined || allZone2 === null) return 0;

      let currentZone = allZone2.find(
        zone =>
          zone.project_zones_id ===
          this.getField(this.fields_enum.e_zone2).ControlSource
      );
      if (currentZone === undefined) return 0;
      return Nz(currentZone.apartment_id);
    },
    qcObject() {
      return {
        quality_control_id: this.getField(this.fields_enum.e_qc_id)
          .ControlSource,
        project_id: this.getField(this.fields_enum.e_projectId).ControlSource,
        status_id: this.getField(this.fields_enum.e_status).ControlSource,
        zone_1_id: this.getField(this.fields_enum.e_zone1).ControlSource,
        zone_2_id: this.getField(this.fields_enum.e_zone2).ControlSource,
        zone_3_id: this.getField(this.fields_enum.e_zone3).ControlSource,
        chapter_id: this.getField(this.fields_enum.e_chapter).ControlSource,
        responsible_id: this.getField(this.fields_enum.e_responsibles)
          .ControlSource,
        planed_date: this.getField(this.fields_enum.e_planedDate).ControlSource,
        impairment_id: this.getField(this.fields_enum.e_impairment)
          .ControlSource,
        hardware_level_id: this.getField(this.fields_enum.e_severityLevel)
          .ControlSource,
        quality_control_desc: this.getField(this.fields_enum.e_description)
          .ControlSource
      };
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
      getProjectsUser: "qc/getProjectsUser"
    })
  },
  watch: {
    qualityControl() {
      this.getQcData();
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
.error {
  color: red;
  font-size: 11px;
}
.single_form {
  margin-bottom: 20px;
}
.qc-buttons {
  height: 52px;
}
.single_form_buttons {
  display: flex;
  justify-content: space-around;
}
/* זה הגדרות של דסקטופ שאת רשמת אבל אני מוסיף הגדרות נוספות מתחת */
@media screen and (min-width: 896px) {
  .description {
    width: 97% !important;
    max-width: 950px !important;
  }
  .description label {
    width: 8% !important;
  }
  .description div {
    width: 91.5% !important;
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
</style>
