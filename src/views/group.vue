<template>
  <label :for="groupBy.Name">{{ groupBy.Caption }}</label>
  <div class="p-d-flex p-flex-column" :id="groupBy.Name">
    <a-point-dropdown
      :field="groupBy"
      :model-value="groupBy.ControlSource"
      @update:model-value="updateField(groupBy, $event)"
    ></a-point-dropdown>
  </div>
  <div v-for="group of arrActiveGroup" :key="group.name">
    {{ group.name }} ( {{ filetrByGroup(group.name).length }} )
    <p @click="group.show = !group.show">הצג/הסתר</p>
    <transition
      name="slide-fade"
      v-for="qc of filetrByGroup(group.name)"
      :key="qc.quality_control_id"
    >
      <div v-show="group.show">
        {{ qc.quality_control_id }} - {{ qc.chapter_name }} -
        {{ qc.status_name }}
      </div>
    </transition>
  </div>
</template>

<script>
import APointDropdown from "../components/APoint-dropdown.vue";
import { callProc, apiParam, apiPType } from "../services/APointAPI";
export default {
  components: {
    APointDropdown
  },

  data() {
    return {
      groupBy: {
        num: 1,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "קיבוץ:",
        optionLabel: "desc",
        optionValue: "column_name",
        showClear: false,
        ControlSource: null,
        RowSource: [
          { column_name: "chapter_name", desc: "פרקים", array: [] },
          { column_name: "status_name", desc: "סטטוס", array: [] }
        ],
        Enabled: true,
        Name: "sortBy",
        FuncOnUpdate: () => {},
        DefaultValue: "chapter_name"
      },
      qualityControls: []
    };
  },
  methods: {
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate(value));
    },
    filetrByGroup(filterStr) {
      return this.qualityControls.filter(
        e => e[this.groupBy.ControlSource] === filterStr
      );
    },

    filterQualityControl() {
      let procParams = [apiParam("user_exec", 1, apiPType.Int)];

      callProc("pr_qc_select", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            console.log(result);
            this.qualityControls = result.Table;
            //grouping
            this.groupBy.RowSource.forEach(group => {
              group.array = this.qualityControls
                .map(item => item[group.column_name])
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort()
                .map(item => ({ name: item, show: false }));
            });
            console.log(this.groupBy.RowSource);
          } else {
            this.$toast.add({
              severity: "error",
              summary: "שגיאה בהצגת בקרות - פנה לתמיכה",
              detail: "",
              life: 10000,
              closable: true
            });
          }
        })
        .catch(error => {
          console.log("pr_qc_select-error", error);
          this.$toast.add({
            severity: "error",
            summary: "שגיאה - פנה לתמיכה",
            detail: error,
            life: 10000,
            closable: true
          });
        });
    }
  },
  mounted() {
    this.filterQualityControl();
  },
  computed: {
    arrActiveGroup() {
      return this.groupBy.RowSource.find(
        e => e.column_name === this.groupBy.ControlSource
      )?.array;
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 1, 1, 0.5);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
