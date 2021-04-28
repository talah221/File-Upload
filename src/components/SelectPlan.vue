<template>
  <div class="single_form">
    <div class="myField">
      <label for="profetionId">מקצוע</label>
      <Dropdown
        v-model="profetionId"
        :options="profetions"
        optionLabel="profession_name"
        optionValue="profession_id"
        id="profetionId"
      />
    </div>
    <div class="myField">
      <label for="planId">תוכנית</label>
      <Dropdown
        v-model="selectedPlan"
        :options="palns"
        optionLabel="FileName"
        id="planId"
        showClear
      />
    </div>
    <Button icon="pi pi-file-pdf" label="הצג תוכנית" @click="displayPlan" />
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { mapState } from "vuex";

export default {
  props: {
    apartmentId: {
      type: Number
    }
  },
  emits: ["displayPlan", "close"],
  components: {
    Dropdown,
    Button
  },
  data() {
    return {
      allPlans: [],
      profetionId: null,
      selectedPlan: null
    };
  },
  mounted() {
    let procParams = [
      apiParam("user_exec", this.userID, apiPType.Int),
      apiParam("apartment_id", this.apartmentId, apiPType.Int)
    ];
    // console.log("pr_qc_get_planes-procParams", procParams);
    callProc("pr_qc_get_planes", procParams)
      .then(result => {
        result = JSON.parse(result);
        // console.log("pr_qc_get_planes-result", result);

        if (result.Table.length > 0) {
          this.allPlans = result.Table;
        } else {
          console.log("pr_qc_get_planes-loload failad");
          this.$toast.add({
            severity: "warn",
            summary: "בחירת תוכנית",
            detail: "אין נתונים להצגה",
            life: 10000,
            closable: true
          });
          this.$emit("close");
        }
      })
      .catch(error => {
        console.log("pr_qc_get_planes-error", error);
        this.$toast.add({
          severity: "error",
          summary: "שגיאה - פנה לתמיכה",
          detail: error,
          life: 10000,
          closable: true
        });
      });
  },
  methods: {
    displayPlan() {
      if (this.profetionId > 0 && this.selectedPlan !== null) {
        this.$emit("displayPlan", this.selectedPlan);
      } else {
        this.$toast.add({
          severity: "error",
          summary: "נתונים חסרים",
          detail: "יש לבחור תוכנית",
          life: 10000,
          closable: true
        });
      }
    }
  },
  computed: {
    profetions() {
      let distinctProf = this.allPlans
        .map(prof => prof.profession_id)
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value !== "";
        });

      return distinctProf
        .map(p => ({
          profession_id: p,
          profession_name: this.allPlans.find(plan => {
            // console.log(plan, p);
            return plan.profession_id === p;
          }).profession_name
        }))
        .sort(function(a, b) {
          if (
            a.profession_name.toLocaleLowerCase() <
            b.profession_name.toLocaleLowerCase()
          ) {
            return -1;
          }
          if (
            a.profession_name.toLocaleLowerCase() >
            b.profession_name.toLocaleLowerCase()
          ) {
            return 1;
          }
          return 0;
        });
    },
    palns() {
      return this.allPlans.filter(
        plan => plan.profession_id === this.profetionId
      );
    },
    ...mapState({ userID: state => +state.api.userID })
  }
};
</script>

<style scoped>
.single_form {
  flex-direction: column;
  width: 85%;
}
.single_form .myField {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}
.single_form .myField > div {
  width: 74%;
}
</style>
