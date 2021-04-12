<template>
  <div>
    {{ detailsChecked }}
    <div v-if="showProjectList" class="field p-d-flex p-ai-center p-m-4">
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
      <qualityControlDetails
        :projectId="projects.ControlSource"
        @checkData="checkDetails"
        :needCheckData="needCheckData"
      ></qualityControlDetails>

      <label for="decription">תיאור</label>
      <Textarea v-model="description" name="decription" />
      <Button label="בדיקה" @click="checkData"></Button>
      <Button label="שמור וסגור" @click="saveClose"></Button>
      <Button label="בקרה חדשה" @click="addQC"></Button>
      <Button label="תוכניות" @click="plans"></Button>
      <Button label="" @click="addPoto" icon="pi pi-camera"></Button>
    </div>
  </div>
  <Toast position="bottom-right" />
</template>

<script>
import qualityControlDetails from "@/components/qualityControlDetails";
import Button from "primevue/button";
import APointDropdown from "../components/APoint-dropdown.vue";
import { Nz } from "../services/APointAPI";
import { mapState } from "vuex";
import Textarea from "primevue/textarea";
import { callProc, apiParam, apiPType } from "../services/APointAPI";

export default {
  name: "qualityControlAdd",
  components: {
    qualityControlDetails,
    Button,
    APointDropdown,
    Textarea
  },
  data() {
    return {
      showProjectList: true,
      //todo change description to object and display error(required) when field is empty
      description: "",
      projects: {
        num: 1,
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
      detailsChecked: null,
      needCheckData: false,
      fields: null
    };
  },
  methods: {
    chekProject() {
      if (this.projects.required && Nz(this.projects.ControlSource) === 0)
        this.projects.check = true;
      else {
        this.projects.check = false;
        this.showProjectList = false;
        // this.getDdlData();
      }
    },
    checkData() {
      this.needCheckData = true;
    },
    saveClose() {
      // this.needCheckData = true;
      //todo how to await to emits?

      if (this.detailsChecked === false && Nz(this.description) !== "") {
        console.log("this.detailsChecked", this.detailsChecked, 3);

        alert("OK");

        //במידה ונשאר סטטוס טיוטה, הוא יתחלף ל"פתוחה" בלחיצה על "שמור וסגור".
        // todo change status in vue or in sql?

        let procParams = [
          apiParam("user_exec", this.userID, apiPType.Int),
          apiParam("quality_control_id", null, apiPType.Int),
          apiParam("project_id", this.projects.ControlSource, apiPType.Int),
          apiParam(
            "status_id",
            this.fields.find(f => f.num === 1).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "zone_1_id",
            this.fields.find(f => f.num === 2).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "zone_2_id ",
            this.fields.find(f => f.num === 3).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "zone_3_id ",
            this.fields.find(f => f.num === 4).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "chapter_id",
            this.fields.find(f => f.num === 5).ControlSource,
            apiPType.Int
          ),
          apiParam("quality_control_desc", this.description, apiPType.NVarChar),
          apiParam(
            "responsible_id",
            this.fields.find(f => f.num === 6).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "planed_date",
            this.fields.find(f => f.num === 7).ControlSource,
            apiPType.SmallDateTime
          ),
          apiParam(
            "impairment_id",
            this.fields.find(f => f.num === 8).ControlSource,
            apiPType.Int
          ),
          apiParam(
            "hardware_level_id",
            this.fields.find(f => f.num === 9).ControlSource,
            apiPType.Int
          )
        ];
        console.log("pr_qc_ins_upd-procParams", procParams);
        callProc("pr_qc_ins_upd", procParams)
          .then(result => {
            result = JSON.parse(result);
            console.log("pr_qc_ins_upd-result", result);
            if (result.procReturnValue === 0) {
              this.$toast.add({
                severity: "success",
                summary: "הבקרה נוספה בהצלחה",
                detail: "",
                life: null,
                closable: true
              });

              this.$route.push({ name: "Home" });
            } else {
              this.$toast.add({
                severity: "error",
                summary: "שגיאה ביצירת בקרה - פנה לתמיכה",
                detail: "",
                life: null,
                closable: true
              });
            }
          })
          .catch(error => {
            console.log("pr_qc_ins_upd-error", error);
          });
      }
      console.log("this.detailsChecked", this.detailsChecked, 4);
    },
    checkDetails(check, fields) {
      console.log("checkDetails", check);
      this.detailsChecked = check;
      this.needCheckData = false;
      this.fields = fields;
    }
  },
  mounted() {
    //todo get projects list by userLogin - callproc
    this.projects.RowSource = [
      { ProjectId: 146, ProjectName: "אדרת הכרמל" },
      { ProjectId: 102, ProjectName: "אדרת הכפר" },
      { ProjectId: 91, ProjectName: "וולפסון" }
    ];
    //הצגת בחירת פרויקט רק אם למשתמש יש הרשאה על יותר מפרויקט אחד
    if (this.projects.RowSource.length === 1) {
      this.projects.ControlSource = this.projects.RowSource[0].ProjectId;
      this.showProjectList = false;
      // this.getDdlData();
    } else {
      this.showProjectList = true;
    }
  },
  computed: {
    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 11px;
}
.field label {
  width: 125px;
}
</style>
