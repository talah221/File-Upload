<template>
  <div>
    <Dropdown
      v-model="profetionId"
      :options="profetions"
      optionLabel="profession_name"
      optionValue="profession_id"
    />

    <Dropdown
      v-model="planId"
      :options="palns"
      optionLabel="FileName"
      optionValue="ID"
    />
    <Button label="הצג תוכנית" @click="displayPlan" />
    <Toast position="bottom-right" />
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
  components: {
    Dropdown,
    Button
  },
  data() {
    return {
      allPlans: [],
      profetionId: null,
      planId: null
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
        }
      })
      .catch(error => {
        console.log("pr_qc_get_planes-error", error);
      });
  },
  methods: {
    displayPlan() {
      if (this.profetionId > 0 && this.planId > 0) {
        this.$router.push({
          name: "Plan",
          params: { id: this.planId }
        });
      } else {
        this.$toast.add({
          severity: "error",
          summary: "נתונים חסרים",
          detail: "יש לבחור תוכנית",
          life: null,
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

<style scoped></style>
