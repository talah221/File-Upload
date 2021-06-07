<template>
  <main class="main-container">
    <section class="additional-info">
      <h5 class="title">פרטים נוספים:</h5>
      <div class="qc-info">
        <div class="right-section">
          <h5>
            <b> פותח הבקרה: </b>
            {{ qc.creater_name }}
          </h5>
          <h5>
            <b> תאריך יעד: </b>

            {{ qc.formattedPlaned_date }}
          </h5>
          <h5>
            <b> ימי פיגור: </b>
            {{ qc.delay_days }}
          </h5>
          <h5>
            <b> תאריך סגירה: </b>
            {{ qc.formated_closed_date }}
          </h5>
          <h5>
            <b> סוגר הבקרה: </b>
            {{ qc.closed_name }}
          </h5>
        </div>
        <div class="left-section">
          <h5>
            <b> פרק: </b>
            {{ qc.chapter_name }}
          </h5>
          <h5>
            <b> סוג ליקוי: </b>

            {{ qc.impairment_desc }}
          </h5>
          <h5>
            <b> רמת חומרה: </b>

            {{ qc.level_desc }}
          </h5>
          <h5>
            <b> אחראי לביצוע: </b>
            {{ qc.responsible_name }}
          </h5>
          <h5>
            <b> קבלן: </b>
            {{ qc.contractor_name }}
          </h5>
        </div>
      </div>
    </section>
    <section class="description">
      <h5 class="title">תיאור:</h5>
      <!-- <p>{{ qc.quality_control_desc }}</p> -->
      <ReadMore :text="qc.quality_control_desc" length="30" />
      <div class="zones">
        <div class="zone zone-1">
          <h5>
            <b>חלל 1: </b>
            {{ qc.project_zone1_name }}
          </h5>
        </div>
        <div class="zone zone-2">
          <h5>
            <b>חלל 2:</b>

            {{ qc.project_zone2_name }}
          </h5>
        </div>
        <div class="zone zone-3">
          <h5>
            <b>חלל 3:</b>
            {{ qc.project_zone3_name }}
          </h5>
        </div>
      </div>
    </section>
    <section class="pictures">
      <ul class="tabs">
        <li
          :class="selectedTab === 'logs' ? 'active' : ''"
          @click="selectedTab = 'logs'"
        >
          מה בוצע ({{ qcReports.length }})
        </li>
        <li
          :class="selectedTab === 'pictures' ? 'active' : ''"
          @click="selectedTab = 'pictures'"
        >
          הצג תמונות / תוכניות ({{ qcImages.length }})
        </li>
      </ul>
      <Divider align="center">
        <div
          class="p-d-inline-flex p-ai-center"
          :style="{ background: 'transpert' }"
        >
          <i
            :class="['pi pi-chevron-up', selectedTab === 'logs' ? 'left' : '']"
          ></i>
        </div>
      </Divider>
      <div class="logs-history" v-if="selectedTab === 'logs'">
        <div
          class="log"
          v-for="log in qcReports"
          :key="log.quality_control_reporting_id"
        >
          <p>
            <span class="br">{{ log.format_create_date }}</span>
            <span>{{ log.user_rank_name }}</span>
          </p>
          <p>
            <b>{{ log.action_performed }}</b>
          </p>
        </div>
      </div>
      <div class="images" v-if="selectedTab === 'pictures'">
        <galleria-full :images="images"></galleria-full>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from "vuex";
import GalleriaFull from "../../GalleriaFull.vue";
import ReadMore from "../cmps/ReadMore";
export default {
  components: { GalleriaFull, ReadMore },
  props: ["qc", "qcReports", "qcImages"],
  data() {
    return {
      selectedTab: "logs",
      attachedFiles: [],
      displayAttFiles: false,
    };
  },
  methods: {
    getField(num) {
      return this.fields.find((f) => f.num === num);
    },
  },
  mounted() {},
  created() {},
  computed: {
    ...mapState({
      userID: (state) => +state.api.userID,
    }),
    images() {
      return this.qcImages.map((img) => ({
        ID: img.ID,
        itemImageSrc: img.fileName,
        thumbnailImageSrc: img.fileName,
        alt: img.SrcFile,
        title: img.SrcFile,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  display: grid;
  grid-template-columns: 45% 20% 35%;
  margin-top: 25px;
  transition: 0.7s ease-in;

  section {
    padding: 0 5px;
    margin-bottom: 15px;
    .title {
      margin: 0;
      color: #1e81d6;
      font-weight: 600;
    }
  }
  .description {
    border-left: 1px solid lightblue;
    border-right: 1px solid lightblue;
    .container {
      p {
        font-size: 1rem;
      }
    }
    .zones {
      margin-top: 10px;
      .zone {
        display: flex;
        // margin: 10px 0;
        h5 {
          display: flex;
          font-size: 1rem;
          b {
            width: 65px;
          }
          margin-left: 4px;
        }
      }
    }
  }
  .additional-info {
    .qc-info {
      display: flex;
      h5 {
        margin: 10px 0;
        display: flex;
        // font-size: 0.8vw;
        font-size: 1rem;
        span,
        b {
          width: 100px;
        }
      }
      .right-section {
        width: 40%;
      }
      .left-section {
        width: 60%;
      }
    }
  }
  .pictures {
    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        margin-left: 30px;
        font-weight: 600;
        cursor: pointer;

        &.active {
          color: #1e81d6;
        }
      }
    }
    .p-divider {
      color: #1e81d6;
      margin-top: 4px;
      margin-bottom: 0;
      &::before {
        border-color: #1e81d6;
      }
      i {
        margin-left: 200px;
        &.left {
          margin-left: 492px;
        }
      }
    }
    .logs-history {
      max-height: 170px;
      overflow: auto;
      .log {
        margin-bottom: 2px;
        p {
          display: flex;
          margin: 0;
          padding: 0;
          font-size: 1rem;
          span {
            padding: 5px;
          }
          .br {
          }
        }
      }
    }
    .pictures {
    }
  }
}
</style>
