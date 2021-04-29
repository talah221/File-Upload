<template>
  <div>
    <div v-if="displayQualityControl">
      <QualityControl
        @close="displayQualityControl = false"
        :qualityControl="qualityControl"
      ></QualityControl>
    </div>
    <div v-else>
      <div v-show="displayFilters">
        <QualityControlsFilters
          @showData="setFilters"
          :filters="filters"
          @updateFilters="updateFilters"
          @clearFilters="clearFilters"
        />
      </div>
      <div v-show="!displayFilters">
        <div class="p-d-flex p-ai-center p-jc-end" style="width: 97%">
          <Button label="סינונים" @click="showFilters" icon="pi pi-filter" />
        </div>
        <div class="controls">
          .
          <div v-if="isDesktop" class="qc-table-headers">
            <h5 class="table-header">מס' בקרה</h5>
            <h5 class="table-header">תאריך פתיחה</h5>
            <h5 class="table-header">סטטוס</h5>
            <h5 class="table-header">פרק</h5>
            <h5 class="table-header">סוג ליקוי</h5>
            <h5 class="table-header">רמת חומרה</h5>
            <h5 class="table-header">o</h5>
          </div>
          <div class="qc-list">
            <div
              v-for="qc of qualityControls"
              :key="qc.quality_control_id"
              class="qc"
            >
              <div class="qc-not-desktop" v-if="!isDesktop">
                <div @click="openQC(qc)">
                  <div>
                    ב&nbsp;{{ qc.quality_control_id }} -
                    {{ qc.formattedCreate_date }}
                  </div>
                  <div>
                    {{ qc.project_zone1_name }} - {{ qc.project_zone2_name }} -
                    {{ qc.project_zone3_name }}
                  </div>
                  <div>
                    <span class="p-text-bold">תיאור:</span>
                    {{ qc.quality_control_desc }}
                  </div>
                </div>
                <div @click="openQC(qc)">
                  <div class="p-text-bold">{{ qc.chapter_name }}</div>
                  <div>{{ qc.responsible_name }}</div>
                </div>
                <div class="buttonsDiv">
                  <Button icon="pi pi-folder-open" class="folder-btn"></Button>
                  <Button
                    label="דווח"
                    class="p-button-sm report-btn"
                    @click="reporting(qc)"
                    :disabled="qc.status_id === 1109"
                  />
                </div>
              </div>
              <section class="qc-desktop" v-if="isDesktop">
                <div class="qc-id">{{ qc.quality_control_id }}</div>
                <div class="qc-create-date">{{ qc.create_date }}</div>
                <div class="qc-status">{{ qc.status_name }}</div>
                <div class="qc-chapter">{{ qc.chapter_name }}</div>
                <div class="qc-impairment">{{ qc.impairment_desc }}</div>
                <div class="qc-level">{{ qc.level_desc }}</div>
              </section>
            </div>
          </div>
          <Dialog v-model:visible="displayReporting" modal>
            <template #header>
              <h3 style="margin: auto">
                דיווח טיפול בבקרה מס' {{ qualityControl.quality_control_id }}
              </h3>
            </template>
            <div>
              <QCReporting
                :qualityControl="qualityControl"
                @closeReporting="closeReporting"
              />
            </div>

            <template #footer> </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import { mapState } from "vuex";
import { callProc, apiParam, apiPType, Nz } from "../services/APointAPI";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
import Dialog from "primevue/dialog";
import QCReporting from "@/components/QCReporting.vue";
import QualityControl from "./QualityControl.vue";
//todo לחצנים : הצגת קבצים מצורפים
export default {
  components: {
    Button,
    QualityControlsFilters,
    Dialog,
    QCReporting,
    QualityControl,
  },
  data() {
    return {
      qualityControls: [],
      displayFilters: false,
      filters: {},
      displayReporting: false,
      qualityControl: null,
      displayQualityControl: false,
      isDesktop: true,
    };
  },
  mounted() {},
  created() {
    this.isDesktop = window.innerWidth > 896;
  },
  watch: {
    qualityControls: function () {
      console.log("QC", this.qualityControls[0]);
    },
  },
  methods: {
    showFilters() {
      this.displayFilters = true;
      this.$store.commit("main/setAppHeader", "סינון בקרות");
    },
    filterQualityControl() {
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      Object.keys(this.filters).forEach((key) => {
        procParams.push(
          apiParam(key, this.filters[key].value, this.filters[key].type)
        );
      });
      callProc("pr_qc_select", procParams)
        .then((result) => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            this.qualityControls = result.Table;
            this.displayFilters = false;
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
    clearFilters(fieldName) {
      if (fieldName === undefined) this.filters = {};
      else {
        delete this.filters[fieldName];
      }
    },
    updateFilters(field) {
      if (
        Nz(field.ControlSource, "") === "" ||
        (field.apointType === "multiSelect" && field.ControlSource.length === 0)
      ) {
        delete this.filters[field.Name];
      } else {
        this.filters[field.Name] = {
          value:
            field.apointType === "multiSelect"
              ? field.ControlSource.toString()
              : field.ControlSource,
          type: field.type,
        };
      }
    },
    reporting(qc) {
      this.qualityControl = qc;
      this.displayReporting = true;
    },
    closeReporting(qualityControl) {
      //?הנתונים לא מתרעננים בתצוגה
      console.log("closeReporting", qualityControl);
      let qc = this.qualityControls.find(
        (qc) => qc.quality_control_id === qualityControl.quality_control_id
      );
      qc.status_id = qualityControl.status_id;
      qc.responsible_id = qualityControl.responsible_id;
      this.qualityControl = null;
      this.displayReporting = false;
    },
    openQC(qc) {
      this.qualityControl = qc;
      this.displayQualityControl = true;
    },
  },
  computed: {
    ...mapState({ userID: (state) => +state.api.userID }),
  },
};
</script>

<style scoped lang="scss">
@media (min-width: 880px) {
  // DESKTOP STYLING
  .qc-table-container-desktop {
    display: flex;
    width: 100%;
  }
  .qc {
  }
  .controls {
    .qc-table-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      .table-header {
        background: white;
        margin: 0;
        text-align: center;
      }
    }
    .qc-list {
      .qc:nth-of-type(even) {
        background: white;
      }
      .qc {
        margin: 0;
        text-align: center;
        padding: 8px 0;

        .qc-desktop {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
      }
    }
  }
}
@media (max-width: 800px) {
  .qc {
    // border: 1px solid black;
    box-shadow: 0px 1px 10px 0px rgb(179 179 179 / 75%);
    border-radius: 5px;
    display: grid;
    grid-template-columns: 56% 31% 13%;
    padding: 2px;
    width: 99%;
    max-width: 455px;
    margin: 6px;
    cursor: pointer;
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
  justify-content: space-around;
  flex-direction: column;
}

.report-btn {
  color: $color--primary;
}
.folder-btn {
  padding: 3px;
  color: $color--folder;
}
</style>
