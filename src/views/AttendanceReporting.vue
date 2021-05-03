<template>
  <div class="p-d-flex p-jc-evenly p-flex-wrap">
    <div class="field p-d-flex p-ai-center p-m-2">
      <label for="date">תאריך :</label>
      <div class="p-d-flex p-flex-column">
        <Calendar id="date" v-model="date" showIcon disabled />
      </div>
    </div>
    <div class="field p-d-flex p-ai-center p-m-2">
      <label for="project">פרויקט :</label>
      <div class="p-d-flex p-flex-column">
        <Dropdown
          id="project"
          v-model="selectedProject"
          :options="projects"
          optionLabel="ProjectName"
          optionValue="ProjectId"
          @change="loadDetails"
          :showClear="true"
        />
      </div>
    </div>

    <div class="field p-d-flex p-ai-center p-m-2">
      <label for="entity">גורם :</label>
      <div class="p-d-flex p-flex-column">
        <Dropdown
          id="entity"
          v-model="selectedEntity"
          :options="entitys"
          optionLabel="Name"
          optionValue="ID"
          :showClear="true"
          @change="changeEntity"
        />
      </div>
    </div>
    <div class="field p-d-flex p-ai-center p-m-2">
      <label for="entityId">שם גורם :</label>
      <div class="p-d-flex p-flex-column">
        <Dropdown
          id="entityId"
          v-model="selectedContractor"
          :options="contractors"
          optionLabel="ContractorName"
          optionValue="EntityID"
          :showClear="true"
          @change="changeContractor"
        />
      </div>
    </div>
    <div class="field p-d-flex p-ai-center p-m-2">
      <label for="transactiontype">סימון :</label>
      <div class="p-d-flex p-flex-column">
        <Dropdown
          id="transactiontype"
          v-model="selectedTransactiontype"
          :options="transactiontypes"
          :showClear="true"
          optionLabel="Name"
          optionValue="ID"
          @change="setWorkersTransactionType"
        />
      </div>
    </div>
  </div>
  <div>
    <DataTable
      :value="workerslist"
      :resizableColumns="false"
      :rowClass="workerSelected"
      editMode="cell"
      class="p-datatable p-datatable-responsive p-fluid"
    >
      <Column field="worker_name_order" header="שם עובד"></Column>
      <Column field="WorkerID" header="מס' זהות"></Column>
      <Column field="transaction_type" header="סוג העסקה">
        <template #body="slotProps">
          <div
            v-for="transaction of transactiontypes"
            :key="transaction.ID"
            class="p-field-radiobutton"
          >
            <RadioButton
              :id="transaction.ID"
              name="transaction"
              :value="transaction.ID"
              v-model="slotProps.data['transaction_type']"
              @focus="setWorker(slotProps.data)"
            />
            <label :for="transaction.ID">{{ transaction.Name }}</label>
          </div>
          <!-- <Dropdown
            v-model="slotProps.data['transaction_type']"
            :options="transactiontypes"
            optionLabel="Name"
            optionValue="ID"
            laceholder="Select a Status"
            @change="setWorker(slotProps.data)"
          >
          </Dropdown> -->
        </template>
      </Column>
      <Column field="checked" header="סימון" headerStyle="width: 5em;">
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data.checked"
            :binary="true"
            @change="setWorker(slotProps.data, 2)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState } from "vuex";

export default {
  name: "AttendanceReporting",
  components: { Calendar, Dropdown, DataTable, Column, Checkbox, RadioButton },
  data() {
    return {
      date: new Date(),
      projects: [],
      selectedProject: null,
      entitys: [],
      selectedEntity: null,
      allContractors: [],
      selectedContractor: null,
      transactiontypes: [],
      selectedTransactiontype: null,
      allWorkerslist: []
    };
  },
  mounted() {
    let procParams = [
      apiParam("UserId", this.userID, apiPType.Int),
      apiParam("PermissionsType", 1, apiPType.Int)
    ];
    callProc("pr_WebApp_PhotoAdd_ProjectList_Permissions", procParams)
      .then(result => {
        result = JSON.parse(result);
        this.projects = result.Table;
        this.entitys = result.Table1;
        this.transactiontypes = result.Table2;
      })
      .catch(error => {
        console.log(error);
        this.$toast.add({
          severity: "error",
          summary: "שגיאה - פנה לתמיכה",
          detail: error,
          life: 10000,
          closable: true
        });
      });
  },
  computed: {
    contractors() {
      return this.allContractors.filter(
        c => c.EntityType === this.selectedEntity || c.EntityType === 0
      );
    },

    workerslist() {
      return this.allWorkerslist.filter(
        w =>
          w.EntityType === this.selectedEntity &&
          w.EntityID === this.selectedContractor
      );
    },
    ...mapState({ userID: state => +state.api.userID })
  },
  methods: {
    loadDetails() {
      if (this.selectedProject != null) {
        // pr_WebApp_Attendance_Reporting_lists
        let procParams = [
          apiParam("UserId", this.userID, apiPType.Int),
          apiParam("ProjectId", this.selectedProject, apiPType.Int),
          apiParam("Date", this.date, apiPType.DateTime)
        ];
        callProc("pr_WebApp_Attendance_Reporting_lists", procParams)
          .then(result => {
            result = JSON.parse(result);
            console.log("result", result);
            this.allContractors = result.Table;
            this.allWorkerslist = result.Table1;
          })
          .catch(error => {
            console.log(error);
            this.$toast.add({
              severity: "error",
              summary: "שגיאה - פנה לתמיכה",
              detail: error,
              life: 10000,
              closable: true
            });
          });
      } else {
        this.clearedProject();
      }
    },
    getTransactionType(id) {
      if (id == -1) return "בחר";
      return this.transactiontypes.filter(e => e.ID === id)[0].Name;
    },
    setWorkersTransactionType() {
      this.workerslist.forEach(worker => {
        if (worker.checked !== true)
          worker.transaction_type = this.selectedTransactiontype;
      });
    },
    setWorker(worker, call = 1) {
      console.log("setWorker", worker);
      let InsertDelete = worker.checked;
      if (call == 1) {
        //בעת שינוי בסוג העסקה
        if (worker.transaction_type == -1) {
          //לא נבחר סוג העסקה
          if (InsertDelete) {
            this.$toast.add({
              severity: "error",
              summary: "נתונים חסרים",
              detail: "יש לבחור סוג העסקה",
              closable: true
            });
            worker.checked = !worker.checked;
            return;
          }
        } else {
          if (InsertDelete) {
            //אם כבר דווח העובד מגדירים כשינוי סוג העסקה
            InsertDelete = "update";
            if (worker.checked == worker.transaction_type) {
              //אם לא מורשה לבצע שינוי לא מבצעים
              return;
            }
          } else {
            //אם לא דווח מגדירים לדיווח
            InsertDelete = true;
            worker.checked = true;
          }
        }
      } else {
        //אם במוד של דיווח ולא נבחר סוג העסקה
        if (worker.checked === true && worker.transaction_type === -1) {
          this.$toast.add({
            severity: "error",
            summary: "נתונים חסרים",
            detail: "יש לבחור סוג העסקה",
            closable: true
          });
          worker.checked = false;
          return;
        }
        if (worker.Work_permit !== "") {
          this.$toast.add({
            severity: "warn",
            summary: "",
            detail: worker.Work_permit,
            closable: true
          });
        }
      }
      let procParams = [
        apiParam("id", worker.ID, apiPType.Int),
        apiParam(
          "date",
          this.date.toLocaleDateString(),
          apiPType.SmallDateTime
        ),
        apiParam("InsertDelete", InsertDelete.toString(), apiPType.NVarChar),
        apiParam("transaction_type", worker.transaction_type, apiPType.Int),
        apiParam("userID", this.userID, apiPType.int),
        apiParam("validWorker", true, apiPType.Bit)
      ];
      callProc("WebApp_Attendance_Reporting", procParams)
        .then(result => {
          result = JSON.parse(result);
          let res = result.Table[0].Column1;
          if (res == "OK") console.log("OK");
          else if (res == "0") {
            worker.checked = !worker.checked;
            this.$router.push({
              name: "Home"
            });
          } else {
            this.$toast.add({
              severity: "warn",
              summary: "",
              detail: res,
              closable: true
            });
            if (call == 2) {
              worker.checked = !worker.checked;
            } else {
              if (worker.transaction_type == 2) {
                worker.checked = 1;
              } else if (worker.transaction_type == 1) {
                worker.checked = 2;
              }
            }
          }
          // } else {
          //   //load failed
          //   console.log("load fail");
          // }
        })
        .catch(error => {
          console.log(error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
        });
    },
    workerSelected(data) {
      return data.checked ? "workerSelected" : null;
    },
    changeEntity() {
      if (this.selectedEntity != null) this.clearedEntity();
    },
    changeContractor() {
      if (this.selectedContractor != null) this.clearedContractor();
    },
    clearedProject() {
      this.selectedEntity = null;
      this.selectedContractor = null;
      this.selectedTransactiontype = null;
    },
    clearedEntity() {
      this.selectedContractor = null;
      this.selectedTransactiontype = null;
    },
    clearedContractor() {
      this.selectedTransactiontype = null;
    }
  }
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}
.field label {
  width: 65px;
}
.field div {
  width: 200px;
}
::v-deep(.workerSelected) {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
</style>
