<template>
  <section class="dashboard-container" v-if="!isLoading">
    <header>
      <button class="hidden"></button>
      <h3>בקרות איכות - {{ projectName }}</h3>
      <router-link :to="navToQcs">
        <Button>צפיה בבקרות הפרוייקט</Button>
      </router-link>
    </header>
    <dashboard-preview v-if="previewData" :previewData="previewData" />
    <section
      class="controls-chapters"
      :style="{ maxWidth: `${barData.datasets[0].data.length * 150}px` }"
    >
      <h4>כמות בקרות לפי פרקים</h4>
      <Chart
        v-if="barData.labels.length"
        type="bar"
        width="75%"
        :height="250"
        :data="barData"
        :options="barOptions"
      />
    </section>
    <section class="controls-doughnuts">
      <Chart
        v-if="impairmentData.labels.length"
        type="doughnut"
        :data="impairmentData"
        :options="{
          title: {
            text: 'כמות בקרות לפי סוג ליקוי',
            display: true,
            font: { weight: 900, size: '3rem' },
          },
        }"
      />
      <Chart
        v-if="seriousData.labels.length"
        type="doughnut"
        :data="seriousData"
        :options="{
          title: { text: 'כמות בקרות לפי רמת חומרה', display: true },
        }"
      />
    </section>
  </section>
</template>

<script>
import DashboardPreview from "../components/DashhboardPreview";
import Chart from "primevue/chart/Chart.vue";
import { callProc, apiParam, apiPType } from "../services/APointAPI.js";
import Button from "primevue/button";

export default {
  name: "Dashboard",
  components: { Chart, DashboardPreview, Button },
  mounted() {},
  created() {
    if (this.$route.params.id) this.projectId = this.$route.params.id;
    this.fetchData();
  },
  data() {
    return {
      isLoading: true,
      previewData: null,
      porjectId: 146,
      barData: {
        labels: [],
        datasets: [
          {
            label: "כמות בקרות לפי פרקים",
            backgroundColor: "#42A5F5",
            data: [],
          },
        ],
      },
      barOptions: {
        plugins: {
          title: {
            display: true,
            text: "Custom Chart Title",
          },
          datalabels: {
            color: "white",
            textAlign: "center",
            font: { weight: "bold", size: 16 },
          },
        },
        legend: { display: false },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
        responsive: true,
        hoverMode: "index",
        stacked: false,

        scales: {
          yAxes: [
            {
              display: true,
              gridLines: {
                // drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      impairmentData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            // hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      seriousData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "green"],
            // hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
    };
  },
  methods: {
    fetchData() {
      let project_id = this.projectId;
      let procParams = [
        apiParam("user_exec", this.userID, apiPType.Int),
        apiParam("project_id", project_id, apiPType.Int),
      ];
      callProc("pr_quality_control_dashboard", procParams)
        .then((result) => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.handleData(result);
          }
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: "שגיאה בקבלת סיכומים לבקרות איכות - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true,
          });
          console.log("pr_quality_control_dashboard-error", error);
        });
    },
    handleData(data) {
      this.barData.labels = data.Table4.map((item) => item.labels);
      this.barData.datasets[0].data = data.Table4.map((item) => item.data);
      this.impairmentData.labels = data.Table5.map((item) => {
        return `${item.labels}: ${item.data}`;
      });
      this.impairmentData.datasets[0].data = data.Table5.map(
        (item) => item.data
      );
      this.seriousData.labels = data.Table6.map((item) => {
        return `${item.labels}: ${item.data}`;
      });
      this.seriousData.datasets[0].data = data.Table6.map((item) => item.data);
      this.previewData = {
        open: data.Table[0],
        delayed: data.Table1[0],
        closed: data.Table2[0],
        more: data.Table3[0],
      };
      this.projectName = data.Table7[0].project_name;
      this.isLoading = false;
    },
  },
  computed: {
    navToQcs() {
      return `/QualityControls/${this.projectId}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .hidden {
      visibility: hidden;
    }
    h3 {
      font-weight: 600;
      text-align: center;
      padding: 15px;
      padding-top: 30px;
    }
    button {
      border: 2px solid black;
      border-radius: 40px;
    }
  }
  .controls-chapters {
    margin: 0 auto;
    h4 {
      text-align: center;
      padding: 15px;
      font-weight: 600;
      font-size: 16px;
      margin: 0;
    }
  }
  .controls-doughnuts {
    display: flex;
    margin-top: 35px;
    justify-content: space-around;
    div {
      padding: 10px;
      width: 45%;
      border-top: 6px solid lightblue;
      box-shadow: 0px 2px 20px 0px #00000061;
      margin-bottom: 50px;
    }
  }
}

@media (max-width: 700px) {
  .controls-doughnuts {
    flex-direction: column;
    div {
      width: 95% !important;
      margin: 0 auto;
    }
  }
}
</style>