<template>
  <!-- <Button label="test" @click="apartmentId" /> -->

  <div>
    <div v-if="showProjectList" class="field p-d-flex p-ai-center p-m-2">
      <label :for="projects.Name">{{ projects.Caption }}</label>
      <div class="p-d-flex p-flex-column" ref="" :id="projects.Name">
        <a-point-dropdown
          :field="projects"
          :model-value="projects.ControlSource"
          @update:model-value="projects.ControlSource = $event"
        ></a-point-dropdown>
      </div>
      <span class="error p-mt-1 p-mr-2" v-if="projects.check">
        * שדה חובה
      </span>
      <Button label="המשך" @click="chekProject"></Button>
    </div>
    <div v-else>
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
              style="resize:none"
            ></Textarea>
            <!-- {{ field.RowSource }} -->
            <span class="error p-mt-1 p-mr-2" v-if="field.check">
              * שדה חובה
            </span>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="displaySelectPlan" modal>
        <div>
          <SelectPlan
            :apartmentId="apartmentId"
            @displayPlan="displayPlan"
          ></SelectPlan>
        </div>
      </Dialog>
      <Dialog v-model:visible="imageEditor.displayImageEditor" modal>
        <div>עריכת תוכנית {{ selectedPlan }}</div>
        //todo להביא קומפוננטת עריכת תוכנית
        <ImageEditor
          @saveImage="saveImage"
          :needOpenEditor="imageEditor.needOpenEditor"
          :dataUrl="imageEditor.dataUrl"
        ></ImageEditor>
      </Dialog>

      <div v-if="qcMode === 'new'">
        <QualityControlAdd
          @saveClose="saveClose"
          :apartmentId="apartmentId"
          @plans="selectPlan"
          @addNewQC="addNewQC"
          @addPoto="addPoto"
        />
      </div>
    </div>
  </div>
</template>

<script>
import APointTextbox from "@/components/APoint-textbox.vue";
import APointCheckbox from "@/components/APoint-checkbox.vue";
import APointDropdown from "@/components/APoint-dropdown.vue";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState, mapGetters } from "vuex";
import QualityControlAdd from "@/components/QualityControlAdd.vue";
import SelectPlan from "@/components/SelectPlan.vue";
import { Nz } from "../services/APointAPI";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import { uploadB64 } from "@/services/APointAPI.js";
import ImageEditor from "@/components/ImageEditor.vue";

export default {
  components: {
    APointTextbox,
    APointCheckbox,
    APointDropdown,
    Button,
    QualityControlAdd,
    Dialog,
    Textarea,
    SelectPlan,
    ImageEditor
  },
  data() {
    return {
      showProjectList: true,
      fields: [
        {
          num: 1,
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
          DefaultValue: 1100,
          AllRowSource: null
        },
        {
          num: 2,
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
          funcOnUpdate: "this.filterZone2()"
        },
        {
          num: 3,
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
          funcOnUpdate: "this.filterZone3()"
        },
        {
          num: 4,
          apointType: "dropdown",
          check: false,
          required: true,
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
          num: 5,
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
          num: 6,
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
          num: 7,
          apointType: "text",
          check: false,
          required: true,
          Caption: "יעד לביצוע:",
          minDate: null,
          maxDate: null,
          manualInput: true,
          showButtonBar: true,
          Format: "Long Date",
          ControlSource: "",
          Enabled: true,
          Name: "planedDate",
          showIcon: true
        },
        {
          num: 8,
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
          num: 9,
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
          num: 10,
          apointType: "dropdown",
          check: false,
          required: true,
          Caption: "פרויקט",
          optionLabel: "ProjectName",
          optionValue: "ProjectId",
          showClear: false,
          ControlSource: null,
          RowSource: [],
          Enabled: true,
          Name: "projectId"
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
          Caption: "מספר בקרה",
          Format: "",
          ControlSource: null,
          Enabled: true,
          Locked: false,
          Name: "quality_control_id"
        }
      ],
      fields_enum: {
        e_status: 1,
        e_zone1: 2,
        e_zone2: 3,
        e_zone3: 4,
        e_chapter: 5,
        e_responsibles: 6,
        e_planedDate: 7,
        e_impairment: 8,
        e_severityLevel: 9,
        e_projectId: 10,
        e_description: 11,
        e_qc_id: 12
      },
      qcMode: null,
      displaySelectPlan: false,
      selectedPlan: null,
      imageEditor: {
        displayImageEditor: false,
        needOpenEditor: false,
        dataUrl: ""
      }
    };
  },
  mounted() {
    let header = "";
    //todo get projects list by userLogin - callproc
    this.getField(this.fields_enum.e_projectId).RowSource = [
      { ProjectId: 146, ProjectName: "אדרת הכרמל" },
      { ProjectId: 102, ProjectName: "אדרת הכפר" },
      { ProjectId: 91, ProjectName: "וולפסון" }
    ];

    if (this.$route.params.id === undefined) {
      this.qcMode = "new";
      header = "בקרה חדשה";
      this.getField(this.fields_enum.e_qc_id).ControlSource = null;
      //הצגת בחירת פרויקט רק אם למשתמש יש הרשאה על יותר מפרויקט אחד
      if (this.projects.RowSource.length === 1) {
        this.projects.ControlSource = this.projects.RowSource[0].ProjectId;
        this.showProjectList = false;
        this.getDdlData();
      } else {
        this.showProjectList = true;
      }
    } else {
      this.getDdlData();
      //todo שינוי מוד הבקרה + הבאת נתונים אם קיימת משימה
    }
    this.$store.commit("main/setAppHeader", header);
  },
  methods: {
    updateField(field, value) {
      field.ControlSource = value;
      eval(field.funcOnUpdate);
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
    chekProject() {
      if (this.projects.required && Nz(this.projects.ControlSource) === 0)
        this.projects.check = true;
      else {
        this.projects.check = false;
        this.showProjectList = false;
        this.getDdlData();
      }
    },
    getDdlData() {
      this.$store.commit("main/setSpinner", true);

      let loadData = () => {
        this.getField(
          this.fields_enum.e_status
        ).AllRowSource = this.getAllStatuses();
        this.getField(this.fields_enum.e_status).RowSource = this.getStatus();
        this.getField(this.fields_enum.e_zone1).RowSource = this.getZone1(
          this.projects.ControlSource
        );
        this.getField(this.fields_enum.e_zone2).AllRowSource = this.getZone2(
          this.projects.ControlSourc
        );
        this.filterZone2();
        this.getField(this.fields_enum.e_zone3).AllRowSource = this.getZone3(
          this.projects.ControlSourc
        );
        this.getField(
          this.fields_enum.e_chapter
        ).RowSource = this.getChapters();

        this.getField(
          this.fields_enum.e_responsibles
        ).RowSource = this.getResponsibles();

        this.getField(
          this.fields_enum.e_impairment
        ).RowSource = this.getImpairment();
        this.getField(
          this.fields_enum.e_severityLevel
        ).RowSource = this.getHardwareLevel();
      };
      let i = 0;
      let interval = setInterval(() => {
        i++;
        // console.log("interval", i);
        if (this.isDataLoaded === false && i < 30000) return;
        clearInterval(interval);
        loadData();
        this.$store.commit("main/setSpinner", false);
      }, 1);
    },
    saveClose() {
      const funcOnSucces = () => {
        this.$toast.add({
          severity: "success",
          summary: "הבקרה נוספה בהצלחה",
          detail: "",
          life: null,
          closable: true
        });

        this.$router.push({ name: "Home" });
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
        apiParam("project_id", this.projects.ControlSource, apiPType.Int),
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
              life: null,
              closable: true
            });
          }
        })
        .catch(error => {
          console.log("pr_qc_ins_upd-error", error);
        });
    },
    filterZone2() {
      const zone1 = this.getField(this.fields_enum.e_zone1).ControlSource;
      let zone2 = this.getField(this.fields_enum.e_zone2);
      zone2.ControlSource = null;
      if (zone1 !== null) {
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
      zone3.ControlSource = null;
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
      if (this.qcMode === "new") {
        return this.getField(this.fields_enum.e_status).AllRowSource.filter(
          status => [1100, 1107, 1108].indexOf(status.status_id) >= 0
        );
      }
      // todo הצגת סטטוסים לבחירה לפי מוד הבקרה-> עדכון ובקרה סגורה

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
          this.imageEditor.displayImageEditor = true;
          //שמירת קובץ מצורף
          //todo לשנות לנתונים אמיתיים + לקרוא לפונקציה רק לאחר שמירת התמונה שנערכה
          this.savePlanImage(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAYAAABxyNlsAAAD+UlEQVR4Xu3Y3U5cVRiH8WftPXv2nmEopUEwBVOZALFii0ar/bCNMWn86JEnnnjSy/AOvAAvoDfgmTGa2mgNmqhQW4uWNqaAmRiDUtphYPb3Xs0MTTCGNkD6HvHO8eY/4cfDypox6fIfNl1pUDo0jAl6cYMecH2MWwLjgDHoa28Cpn131q5PX6Jy/B3IcwhXybMMb+AIfv0EbrVfgfdmi8nCNfvg8084eOFj8tUGG3NfYdIQt3cQt/8wwcRZnGrfHuf3948ZmyW2eflT/ImzhAuz2LhF37mLYAuShRnwAoKxUxi/RwveZSvG5plt3/ySaPE63uAoJgkpDdbxRl7C5inpwk84PYcoDU/i1AYwjrPLt9i/jxtrC5v8Nc/a9CUOnPoIp3eA9M/r4Dh4I8cwjkvSuIkxThfYPXhYgXfYi7GdV9QinPsam8dUpi5gs4S08StFtE5l/DTWQNqYw2Yp5SOv4PQ+o0fEDoA3cW2B3bhP+PsViiSmdvJDinije+baeIPqy+9TRC3ihRmMF+DX38AEtR3M7+9HuribBJZi7V/Wb3yBU/KoHnsXazOi299jjCF44RxFa4XozjRu55o2dhInOKAFP6Gf/+BuAufNf0gWZ8ijFsH4GYxXJlm6Qb6xCqXOhwsPu34PU+mjcvQtnB69Bz/O93+4jwpuPyBevEbeWqE6eZ4iDWnf+hZTKlMePkp8+7vuTaI8NEYweR5Truzv///H/Pbb4EL3DA6bxHd+IG0ud69o6b0GQf0EydI13Eov3shxors/4o2+jv/smOJuI7At7tYZvEJ79jPi+39Te+0DiuYyNosJJt7EVPtJFn/GFgXB+GnF3R3u1hkc/XaFrPPlztAowcQZ3P5hbNKmPXeZ0lAd/7kpxd097qMzeH2VaP4qtsgIXnwbx68R3fqmC1yZeg/j67Vsu7qecCxsPd45gzvXsPb8VQibkMYYv9L9wOH2DQH6teSecTevwZYibBIt/YIpcvznX8Wp9Svszu+5enQ+TYEdHQtP8w3305biCv61FVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XMUVFBCc1nIVV1BAcFrLVVxBAcFpLVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XMUVFBCc1nIVV1BAcFrLVVxBAcFpLVdxBQUEp7VcxRUUEJzWchVXUEBwWstVXEEBwWktV3EFBQSntVzFFRQQnNZyFVdQQHBay1VcQQHBaS1XcQUFBKe1XEHch0SKbRqgl+f2AAAAAElFTkSuQmCC",
            this.getField(this.fields_enum.e_qc_id).ControlSource,
            plan
          );
        });
      }
    },
    addNewQC() {
      const funcOnSucces = () => {
        this.$toast.add({
          severity: "success",
          summary: "הבקרה נוספה בהצלחה",
          detail: "",
          life: null,
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
    },
    savePlanImage(imgB64, qc_id, plan) {
      //todo לבדוק אם אפשר לייעל
      let parentType, parentID, createdBy, srcFileName, base64String;
      parentType = 254;
      parentID = qc_id;
      createdBy = this.userID;
      srcFileName = plan.FileName;
      base64String = imgB64;
      uploadB64(parentType, parentID, createdBy, srcFileName, base64String)
        .then(result => {
          if (result === true) {
            this.$toast.add({
              severity: "success",
              summary: "הקבצים צורפו בהצלחה",
              detail: "",
              life: null,
              closable: true
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בצירוף קבצים",
              detail: "",
              life: null,
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
            life: null,
            closable: true
          });
          console.log("uploadB64-error", error);
        });
    }
  },
  computed: {
    detailsFields() {
      return this.fields.filter(field => field.num < 10 || field.num === 11);
    },

    projects() {
      return this.getField(this.fields_enum.e_projectId);
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

    ...mapState({
      userID: state => +state.api.userID,
      isDataLoaded: state => state.qc.isDataLoaded
    }),
    ...mapGetters({
      getAllStatuses: "qc/getStatuses",
      getZone1: "qc/getZone1",
      getZone5: "qc/getZone5",
      getZone2: "qc/getZone2",
      getZone3: "qc/getZone3",
      getChapters: "qc/getChapters",
      getResponsibles: "qc/getResponsibles",
      getImpairment: "qc/getImpairment",
      getHardwareLevel: "qc/getHardwareLevel",
      getAllUsers: "qc/getAllUsers",
      getNotDone: "qc/getNotDone"
    })
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 11px;
}
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
</style>
