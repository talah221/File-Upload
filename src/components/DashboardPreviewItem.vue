<template>
  <section
    class="preview-item-container"
    :style="`border:2px solid ${bgColor}`"
  >
    <div class="title">{{ getItemTitle }}</div>
    <div class="item-data">
      <div
        class="open-or-close item-css"
        v-if="type === 'open' || type == 'closed'"
      >
        <div class="total">
          <p>{{ type === "closed" ? "מתחילת הפרוייקט" : "" }}</p>
          <span :style="`color:${bgColor}`">
            {{ data.total }}
          </span>
        </div>
        <div class="stats">
          <p>
            מהיום: <span> {{ data.today }}</span>
          </p>
          <p>
            מהשבוע: <span>{{ data.thisWeek }}</span>
          </p>
          <p>
            מהחודש האחרון: <span> {{ data.thisMonth }}</span>
          </p>
        </div>
      </div>
      <div class="delayed item-css" v-if="type === 'delayed'">
        <div class="total">
          <p>כמות</p>
          <span :style="`color: ${bgColor}`">{{ data.total }}</span>
        </div>
        <hr width="1" size="1" />
        <div class="precent total">
          <p>אחוז</p>
          <span :style="`color:${bgColor}`">{{ data.precent }}</span>
        </div>
      </div>
      <div class="more item-css" v-if="type === 'more'">
        <div class="right-data">
          <p>
            <span> פתוחה</span> <span>{{ data.opened }}</span>
          </p>
          <p>
            <span> בטיפול </span> <span>{{ data.in_progress }}</span>
          </p>
          <p>
            <span> טופלה </span> <span>{{ data.completed }}</span>
          </p>
        </div>
        <div class="left-data">
          <p>
            <span>תזכורת</span> <span>{{ data.reminder }}</span>
          </p>
          <p>
            <span> מצב קיים </span> <span>{{ data.existing_situation }}</span>
          </p>
          <p>
            <span> בוטלה </span><span>{{ data.canceled }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "DashboardPreviewItem",
  props: ["bgColor", "data", "type"],
  mounted() {},
  computed: {
    getItemTitle() {
      switch (this.type) {
        case "open":
          return "בקרות פתוחות";
        case "delayed":
          return "בקרות בפיגור";
        case "closed":
          return "בקרות סגורות";
        case "more":
          return "סטטוסים נוספים";
        default:
          return "שגיאה";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-item-container {
  .title {
    position: relative;
    top: -12px;
    right: 25%;
    text-align: center;
    width: 50%;
    background: white;
    font-weight: 600;
    border: 1px solid lightgray;
    transform: perspective(10px) rotateX(1deg);
  }

  .item-data {
    .item-css {
      display: flex;
      justify-content: space-around;
      // padding-bottom: 15px;
      hr {
        background-color: lightgray;
      }
      .total {
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        p {
          margin: 0;
        }
        span {
          font-size: 4rem;
          line-height: 1;
        }
      }
      .stats {
        p {
          margin: 0;
          padding: 0;
          span {
            font-weight: 600;
          }
        }
      }
      .right-data,
      .left-data {
        width: 25%;
        p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
