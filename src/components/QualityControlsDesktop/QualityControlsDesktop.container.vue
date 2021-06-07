<template>
  <div v-show="displayMainFilters" class="mainFiltersOverlay">
    <div class="mainFilters">
      <QualityControlsFilters
        @showData="setMainFilters"
        @updateFilters="updateMainFilters"
        @clearFilters="clearMainFilters"
        @closeFilters="displayMainFilters = false"
      />
    </div>
  </div>
  <section class="container">
    <div class="layout">
      <header>
        <div class="headerChild">
          <h1>בקרות איכות</h1>
          <span>
            <Checkbox
              id="prjWithQc"
              v-model="displayPrjWithQC"
              :binary="true"
            />
            <label for="prjWithQc"
              >הצג רק {{ getHeadlineToShow }} עם בקרות</label
            >
          </span>
          <span>
            <Checkbox
              id="prjWithOpenQc"
              v-model="displayPrjWithOpenQC"
              :binary="true"
            />
            <label for="prjWithOpenQc"
              >הצג רק {{ getHeadlineToShow }} עם בקרות פתוחות</label
            >
          </span>
        </div>
        <div class="headerChild">
          <Button
            class="qcDesktopBtn"
            @click="openNewQC"
            label="בקרה חדשה"
            icon="pi pi-plus-circle"
          ></Button>
          <Button
            @click="displayMainFilters = true"
            icon="pi pi-filter "
            class="qcDesktopBtn"
            label="סנן"
            :style="chipFilters.length ? 'background:#0e88b3' : ''"
          ></Button>
        </div>
      </header>
      <div class="sub-header">
        <label :for="groupBy.Name"
          >קבץ לפי:
          <a-point-dropdown
            class="header-select-ddl"
            :id="groupBy.Name"
            :field="groupBy"
            :model-value="groupBy.ControlSource"
            @update:model-value="updateField(groupBy, $event)"
          ></a-point-dropdown>
        </label>
        <label for="page-rows" class="page-rows">
          <p>כמות רשומות לתצוגה:</p>
          <InputNumber
            inputStyle="width:65px"
            v-model.number="pageRows"
            :min="5"
            :max="100"
          />
          <Slider id="page-rows" v-model="pageRows" :min="5" :max="100" />
        </label>
      </div>
      <section class="main-table">
        <div class="headers-table">
          <h5 class="w40 cursor-p" @click="sortHeadlineByKey('project_desc')">
            {{ getHeadlineToShow }}
          </h5>
          <h5
            v-if="groupBy.ControlSource === 'project_desc'"
            class="w15 cursor-p"
            @click="sortHeadlineByKey('open_status')"
          >
            בקרות פתוחות
          </h5>
          <h5
            v-if="groupBy.ControlSource === 'project_desc'"
            class="w15 cursor-p"
            @click="sortHeadlineByKey('open_delay_status')"
          >
            מתוכן בקרות בפיגור
          </h5>
          <h5
            v-if="groupBy.ControlSource === 'project_desc'"
            class="w15 cursor-p"
            @click="sortHeadlineByKey('percent_delay')"
          >
            אחוז בקרות בפיגור
          </h5>
          <h5
            v-if="groupBy.ControlSource === 'project_desc'"
            class="w15 cursor-p"
            @click="sortHeadlineByKey('close_status')"
          >
            בקרות סגורות
          </h5>
        </div>
        <div class="data-table">
          <div class="table-row" v-if="!projAndQcsToShow.length">
            <Skeleton></Skeleton>
          </div>
          <div class="table-row" v-if="!projAndQcsToShow.length">
            <Skeleton></Skeleton>
          </div>
          <div class="table-row" v-if="!projAndQcsToShow.length">
            <Skeleton></Skeleton>
          </div>
          <div class="table-row" v-if="!projAndQcsToShow.length">
            <Skeleton></Skeleton>
          </div>
          <div
            v-for="(p, pIdx) in projAndQcsToShow"
            v-show="filterProjects(p, pIdx)"
            :key="p.project_id"
            :class="['table-row ', isActiveProject(p.project_id)]"
          >
            <div class="table-row-wrapper" v-if="!globalLoadingSkeletons">
              <h5
                :class="[
                  'w40',
                  groupBy.ControlSource !== 'project_desc' ? 'cursor-p' : '',
                ]"
                @click="toggleProjQcsAllRow(p.project_id)"
              >
                <router-link
                  event=""
                  :to="`/dashboard/${p.project_id}`"
                  v-if="groupBy.ControlSource === 'project_desc'"
                >
                  <span
                    >{{ p.project_desc }} ({{
                      filteredQcs(p.qcs, p.optionalFilters).length
                    }})</span
                  >
                </router-link>
                <span v-if="groupBy.ControlSource !== 'project_desc'"
                  >{{ p.project_desc }} ({{
                    filteredQcs(p.qcs, p.optionalFilters).length
                  }})
                </span>
              </h5>
              <h5
                :class="[
                  'w15',
                  globalActiveFilter.type === 'open' &&
                  globalActiveFilter.for === p.project_id
                    ? 'active-filter'
                    : '',
                  groupBy.ControlSource !== 'project_desc' ? 'cursor-p' : '',
                ]"
                @click="toggleProjQcsAllRow(p.project_id)"
              >
                <span @click="filterControlsBy('open', p.project_id)">
                  {{ p.open_status }}
                </span>
              </h5>
              <h5
                @click="toggleProjQcsAllRow(p.project_id)"
                :class="[
                  'w15',
                  globalActiveFilter.type === 'delay' &&
                  globalActiveFilter.for === p.project_id
                    ? 'active-filter'
                    : '',
                  groupBy.ControlSource !== 'project_desc' ? 'cursor-p' : '',
                ]"
              >
                <span @click="filterControlsBy('delay', p.project_id)">
                  {{ p.open_delay_status }}
                </span>
              </h5>
              <h5
                :class="[
                  'w15',
                  groupBy.ControlSource !== 'project_desc' ? 'cursor-p' : '',
                ]"
                @click="toggleProjQcsAllRow(p.project_id)"
              >
                <span class="auto-cursor">
                  {{ p.percent_delay }}
                </span>
              </h5>
              <h5
                @click="toggleProjQcsAllRow(p.project_id)"
                :class="[
                  'w15',
                  globalActiveFilter.type === 'closed' &&
                  globalActiveFilter.for === p.project_id
                    ? 'active-filter'
                    : '',
                  groupBy.ControlSource !== 'project_desc' ? 'cursor-p' : '',
                ]"
              >
                <span @click="filterControlsBy('closed', p.project_id)">
                  {{ p.close_status }}
                </span>
              </h5>

              <i
                @click="toggleProjectQcs(p.project_id)"
                :class="
                  showChevronUpOrDown(p.project_id, 'currentOpenProjectsIds')
                "
              ></i>
            </div>
            <Skeleton
              width="100%"
              height="15px"
              v-if="skeletonProjectId === p.project_id"
            ></Skeleton>
            <div
              class="open-project"
              v-if="
                isProjectOpen(p.project_id) &&
                skeletonProjectId !== p.project_id
              "
            >
              <div class="project-header">
                <h5><span>נתוני בקרות בפרוייקט</span></h5>
                <button @click="toggleAllQcs(p.project_id)">
                  {{ getOpenCloseText(p.project_id) }}
                </button>
              </div>
              <div class="qcs-table-container">
                <div class="table-headers">
                  <h5 class="w3">#</h5>
                  <h5 class="w7">
                    <span
                      @click="
                        sortControlsByKey(
                          'quality_control_id',
                          'id',
                          p.project_id
                        )
                      "
                    >
                      <i
                        v-if="activeSort.by === 'id' && activeSort.asc"
                        class="pi pi-sort-numeric-down"
                      ></i>
                      <i
                        v-if="activeSort.by === 'id' && !activeSort.asc"
                        class="pi pi-sort-numeric-up"
                      ></i>
                      מס' בקרה
                    </span>
                  </h5>

                  <h5 class="w18">
                    <span
                      @click="
                        sortControlsByKey(
                          'formattedCreate_date',
                          'date',
                          p.project_id
                        )
                      "
                    >
                      <i
                        v-if="activeSort.by === 'date' && activeSort.asc"
                        class="pi pi-sort-numeric-down"
                      ></i>
                      <i
                        v-if="activeSort.by === 'date' && !activeSort.asc"
                        class="pi pi-sort-numeric-up"
                      ></i>
                      תאריך פתיחה
                    </span>
                  </h5>
                  <!-- {{ groupBy.ControlSource }} -->
                  <h5
                    class="w18"
                    v-if="
                      groupBy.ControlSource !== 'project_desc' &&
                      groupBy.ControlSource !== 'all_qcs'
                    "
                  >
                    <span
                      @click="
                        sortControlsByKey(
                          'project_desc',
                          'project_desc',
                          p.project_id
                        )
                      "
                    >
                      <i
                        v-if="
                          activeSort.by === 'project_desc' && activeSort.asc
                        "
                        class="pi pi-sort-alpha-up"
                      ></i>
                      <i
                        v-if="
                          activeSort.by === 'project_desc' && !activeSort.asc
                        "
                        class="pi pi-sort-alpha-down"
                      ></i>
                      פרוייקט
                    </span>
                    <i
                      v-if="p.project_id"
                      :class="getFilterIcon('project_desc', p.project_id)"
                      @click="
                        toggleOverlay(
                          $event,
                          `project_desc${p.project_id}`,
                          p.project_id,
                          'project_desc'
                        )
                      "
                    ></i>
                  </h5>
                  <h5
                    class="w18"
                    v-if="groupBy.ControlSource !== 'status_name'"
                  >
                    <span
                      @click="
                        sortControlsByKey('status_name', 'status', p.project_id)
                      "
                    >
                      <i
                        v-if="activeSort.by === 'status' && activeSort.asc"
                        class="pi pi-sort-alpha-up"
                      ></i>
                      <i
                        v-if="activeSort.by === 'status' && !activeSort.asc"
                        class="pi pi-sort-alpha-down"
                      ></i>
                      סטטוס
                    </span>
                    <i
                      v-if="p.project_id"
                      :class="getFilterIcon('statuses', p.project_id)"
                      @click="
                        toggleOverlay(
                          $event,
                          `status${p.project_id}`,
                          p.project_id,
                          'status'
                        )
                      "
                    ></i>
                  </h5>
                  <h5
                    class="w18"
                    v-if="groupBy.ControlSource !== 'chapter_name'"
                  >
                    <span
                      @click="
                        sortControlsByKey(
                          'chapter_name',
                          'chapterName',
                          p.project_id
                        )
                      "
                    >
                      <i
                        v-if="activeSort.by === 'chapterName' && activeSort.asc"
                        class="pi pi-sort-alpha-up"
                      ></i>
                      <i
                        v-if="
                          activeSort.by === 'chapterName' && !activeSort.asc
                        "
                        class="pi pi-sort-alpha-down"
                      ></i>
                      פרק</span
                    >
                    <i
                      :class="getFilterIcon('chapters', p.project_id)"
                      @click="
                        toggleOverlay(
                          $event,
                          `chapter${p.project_id}`,
                          p.project_id,
                          'chapter'
                        )
                      "
                    ></i>
                  </h5>
                  <h5 class="w18">
                    <span
                      @click="
                        sortControlsByKey(
                          'impairment_desc',
                          'impairment',
                          p.project_id
                        )
                      "
                    >
                      <i
                        v-if="activeSort.by === 'impairment' && activeSort.asc"
                        class="pi pi-sort-alpha-up"
                      ></i>
                      <i
                        v-if="activeSort.by === 'impairment' && !activeSort.asc"
                        class="pi pi-sort-alpha-down"
                      ></i>

                      סוג ליקוי</span
                    >
                    <i
                      :class="getFilterIcon('impairments', p.project_id)"
                      @click="
                        toggleOverlay(
                          $event,
                          `impairment${p.project_id}`,
                          p.project_id,
                          'impairment'
                        )
                      "
                    ></i>
                  </h5>
                  <h5 class="w18">
                    <span
                      @click="
                        sortControlsByKey('level_desc', 'level', p.project_id)
                      "
                    >
                      <i
                        v-if="activeSort.by === 'level' && activeSort.asc"
                        class="pi pi-sort-alpha-up"
                      ></i>
                      <i
                        v-if="activeSort.by === 'level' && !activeSort.asc"
                        class="pi pi-sort-alpha-down"
                      ></i>
                      רמת חומרה</span
                    >
                    <i
                      :class="getFilterIcon('levels', p.project_id)"
                      @click="
                        toggleOverlay(
                          $event,
                          `level${p.project_id}`,
                          p.project_id,
                          'level'
                        )
                      "
                    ></i>
                  </h5>
                </div>

                <div class="overlays-section">
                  <OverlayPanel
                    :ref="'status' + p.project_id"
                    :style="{ minWidth: '300px', maxWidth: '300px' }"
                  >
                    <MultiSelect
                      :style="{ minWidth: '275px', maxWidth: '275px' }"
                      v-model="p.optionalFilters.statuses"
                      :options="optionalStatuses[p.project_id]"
                      :ref="'statusMs' + p.project_id"
                      optionLabel="name"
                      :optionValue="getVal"
                      placeholder="בחר סטטוסים לסינון"
                      @change="handleFilterChange(p.project_id, 'statuses')"
                    />
                  </OverlayPanel>
                  <OverlayPanel
                    :ref="'chapter' + p.project_id"
                    :style="{ minWidth: '300px', maxWidth: '300px' }"
                  >
                    <MultiSelect
                      :style="{ minWidth: '275px', maxWidth: '275px' }"
                      v-model="p.optionalFilters.chapters"
                      :options="optionalChapters[p.project_id]"
                      optionLabel="name"
                      :optionValue="getVal"
                      placeholder="בחר פרקים לסינון"
                      @change="handleFilterChange(p.project_id, 'chapters')"
                    />
                  </OverlayPanel>
                  <OverlayPanel
                    :ref="'impairment' + p.project_id"
                    :style="{ minWidth: '300px', maxWidth: '300px' }"
                  >
                    <MultiSelect
                      :style="{ minWidth: '275px', maxWidth: '275px' }"
                      v-model="p.optionalFilters.impairments"
                      :options="optionalImpairments[p.project_id]"
                      optionLabel="name"
                      :optionValue="getVal"
                      placeholder="בחר ליקויים לסינון"
                      @change="handleFilterChange(p.project_id, 'impairments')"
                    />
                  </OverlayPanel>
                  <OverlayPanel
                    :ref="'level' + p.project_id"
                    :style="{
                      minWidth: '300px',
                      maxWidth: '300px',
                    }"
                  >
                    <MultiSelect
                      :style="{
                        minWidth: '275px',
                        maxWidth: '275px',
                      }"
                      v-model="p.optionalFilters.levels"
                      :options="optionalLevels[p.project_id]"
                      optionLabel="name"
                      :optionValue="getVal"
                      placeholder="בחר חומרות לסינון"
                      @change="handleFilterChange(p.project_id, 'levels')"
                    />
                  </OverlayPanel>
                  <OverlayPanel
                    :ref="'project_desc' + p.project_id"
                    :style="{
                      minWidth: '300px',
                      maxWidth: '300px',
                    }"
                  >
                    <MultiSelect
                      :style="{
                        minWidth: '275px',
                        maxWidth: '275px',
                      }"
                      v-model="p.optionalFilters.project_desc"
                      :options="optionalProjects[p.project_id]"
                      optionLabel="name"
                      :optionValue="getVal"
                      placeholder="בחר פרוייקטים לסינון"
                      @change="handleFilterChange(p.project_id, 'project_desc')"
                    />
                  </OverlayPanel>
                </div>

                <div
                  v-for="(qc, qIdx) in filteredQcs(p.qcs, p.optionalFilters)"
                  :key="qc.quality_control_id"
                  :class="['qc-table-row', isActiveQc(qc.quality_control_id)]"
                >
                  <div
                    class="table-row-wrapper cursor-p"
                    v-if="showByCurrentPage(p.currentPage, qIdx)"
                    @click="toggleQcData(qc.quality_control_id)"
                  >
                    <h5 class="w3">
                      {{ qIdx + 1 }}
                    </h5>
                    <h5 class="w7">
                      {{ qc.quality_control_id }}
                    </h5>
                    <h5 class="w18">{{ qc.formattedCreate_date }}</h5>
                    <h5
                      class="w18"
                      v-if="
                        groupBy.ControlSource !== 'project_desc' &&
                        groupBy.ControlSource !== 'all_qcs'
                      "
                    >
                      {{ getProjectDescAfterGroupBy(qc.project_id) }}
                    </h5>
                    <h5
                      class="w18"
                      v-if="groupBy.ControlSource !== 'status_name'"
                    >
                      {{ qc.status_name }}
                    </h5>
                    <h5
                      class="w18"
                      v-if="groupBy.ControlSource !== 'chapter_name'"
                    >
                      {{ qc.chapter_name }}
                    </h5>
                    <h5 class="w18">{{ qc.impairment_desc }}</h5>
                    <h5 class="w18">{{ qc.level_desc }}</h5>
                    <i
                      @click="toggleQcData(qc.quality_control_id)"
                      :class="
                        showChevronUpOrDown(
                          qc.quality_control_id,
                          'currentOpenQcIds'
                        )
                      "
                    ></i>
                  </div>
                  <div
                    class="open-qc-container"
                    v-show="isQcOpen(qc.quality_control_id)"
                    v-if="showByCurrentPage(p.currentPage, qIdx)"
                  >
                    <QualityControlItem
                      :qc="qc"
                      :qcReports="getQcReportById(qc.quality_control_id)"
                      :qcImages="getQcImagesById(qc.quality_control_id)"
                    />
                  </div>
                </div>
                <Paginator
                  v-if="filteredQcs(p.qcs, p.optionalFilters).length > pageRows"
                  :rows="pageRows"
                  :v-model:first="1"
                  :totalRecords="filteredQcs(p.qcs, p.optionalFilters).length"
                  @page="pageChange($event, pIdx)"
                  style="direction: ltr"
                ></Paginator>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "primevue/multiselect";
import OverlayPanel from "primevue/overlaypanel";
import { callProc, apiParam, apiPType, Nz } from "../../services/APointAPI";
import QualityControlItem from "./cmps/QualityControlItem.vue";
import QualityControlsFilters from "@/components/QualityControlsFilters.vue";
import { qcStatuses } from "../../scripts/enums";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Skeleton from "primevue/skeleton";
import Paginator from "primevue/paginator";
import APointDropdown from "@/components/APoint-dropdown.vue";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
/* eslint-disable */
export default {
  name: "QualityControlsDesktop",
  components: {
    MultiSelect,
    QualityControlItem,
    OverlayPanel,
    QualityControlsFilters,
    Button,
    APointDropdown,
    Checkbox,
    Skeleton,
    Paginator,
    InputNumber,
    Slider,
  },
  data() {
    return {
      activeHeadlineSort: { by: null, asc: false },
      activeSort: { by: null, asc: false },

      globalLoadingSkeletons: false,
      skeletonProjectId: null,

      globalActiveFilter: { for: null, type: null },
      allQualityControls: [],
      projectWithAllQcs: [],
      pageRows: 10,
      attachFiles: [],
      currentOpenProjectsIds: [],
      currentOpenQcIds: [],
      projectsAndQcs: [],
      projAndQcsToShow: [],
      qualityControlsReports: [],
      currentProjectsAllQcsOpen: [],
      projectsList: [],
      optionalProjects: {},
      selectedProjects: {},
      optionalStatuses: {},
      selectedStatuses: {},
      optionalChapters: {},
      selectedChapters: {},
      optionalImpairments: {},
      selectedImpairments: {},
      optionalLevels: {},
      selectedLevels: {},
      chipFilters: [],
      chipFilters_enum: {
        e_projectId: 1,
      },
      displayMainFilters: false,
      displayPrjWithOpenQC: false,
      displayPrjWithQC: true,
      groupBy: {
        num: 3,
        apointType: "dropdown",
        check: false,
        required: true,
        Caption: "לפי:",
        optionLabel: "desc",
        optionValue: "column_name",
        showClear: false,
        ControlSource: "project_desc",
        RowSource: [
          { column_name: "project_desc", desc: "פרויקטים" },
          { column_name: "chapter_name", desc: "פרקים", array: [] },
          { column_name: "status_name", desc: "סטטוסים", array: [] },
          { column_name: "all_qcs", desc: "כל הבקרות", array: [] },
        ],
        Enabled: true,
        Name: "groupBy",
        FuncOnUpdate: () => {
          this.groupByFunc();
        },
        DefaultValue: "project_desc",
      },
    };
  },
  methods: {
    sortHeadlineByKey(key) {
      this.activeHeadlineSort.by = key;
      let copyProjects = JSON.parse(JSON.stringify(this.projAndQcsToShow));

      if (this.groupBy.ControlSource === "status_name") {
        this.activeHeadlineSort.asc = !this.activeHeadlineSort.asc;
        if (this.activeHeadlineSort.asc) {
          copyProjects = copyProjects.sort((a, b) => {
            return a[key].localeCompare(b[key]);
          });

          this.projAndQcsToShow = copyProjects;
          return (this.projectsAndQcs = copyProjects);
        } else {
          copyProjects = copyProjects.sort((a, b) => {
            return b[key].localeCompare(a[key]);
          });
          this.projAndQcsToShow = copyProjects;
          return (this.projectsAndQcs = copyProjects);
        }
      }
      if (this.activeHeadlineSort.asc) {
        copyProjects = copyProjects.sort((a, b) => {
          return parseInt(a[key]) - parseInt(b[key]);
        });
      } else {
        copyProjects = copyProjects.sort((a, b) => {
          return parseInt(b[key]) - parseInt(a[key]);
        });
      }
      this.activeHeadlineSort.asc = !this.activeHeadlineSort.asc;
      this.projAndQcsToShow = copyProjects;
      this.projectsAndQcs = copyProjects;
    },
    updateField(field, value) {
      field.ControlSource = value;
      if (field.FuncOnUpdate !== undefined) eval(field.FuncOnUpdate(value));
    },
    groupQcsByKey(items, key) {
      return items.reduce((result, item) => {
        return {
          ...result,
          [item[key]]: [...(result[item[key]] || []), item],
        };
      }, {});
    },
    groupByFunc() {
      this.currentOpenProjectsIds = [];
      this.currentProjectsAllQcsOpen = [];
      this.currentOpenQcIds = [];
      switch (this.groupBy.ControlSource) {
        case "all_qcs":
          this.projectsAndQcs = [{ ...this.projectWithAllQcs }];
          this.projAndQcsToShow = [{ ...this.projectWithAllQcs }];
          break;
        case "chapter_name":
        case "status_name":
          const groupedObjByStatus = this.groupQcsByKey(
            this.allQualityControls,
            this.groupBy.ControlSource
          );
          let groupedArrByStatus = Object.keys(groupedObjByStatus).map(
            (status) => {
              return {
                project_id: status,
                project_desc: status,
                qcs: groupedObjByStatus[status],
                currentPage: 0,
              };
            }
          );
          groupedArrByStatus = groupedArrByStatus.map((p) => {
            p.optionalFilters = this.getAllFilters(p);
            return p;
          });

          this.projectsAndQcs = groupedArrByStatus;
          this.projAndQcsToShow = groupedArrByStatus;
          break;
        case "project_desc":
          this.filterQualityControl();
          break;
      }
    },
    dudi() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify([
        {
          paramName: "CompGuid",
          paramValue: "4D5B7C6C-525F-45E9-9659-6BCE5F0A7D78",
          paramType: 14,
        },
        {
          paramName: "HtmlText",
          paramValue: "https://www.apoint.co.il",
          paramType: 12,
        },
        { paramName: "OutputFileName", paramValue: "test.pdf", paramType: 12 },
      ]);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://apidev.apoint.co.il/docs/HTMLtoPDF/url", requestOptions)
        .then((result) => {
          console.log(result);

          this.saveToFile(
            result.data,
            "fileProps.fileName.pdf",
            "application/pdf"
          );
        })
        .catch((error) => console.log("error", error));
    },
    saveToFile(data, filename, mime) {
      //original Func Name: downloadFile
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const blob = new Blob([data], {
        type: mime || "application/octet-stream",
      });
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        // IE doesn't allow using a blob object directly as link href.
        // Workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
        return;
      }
      // Other browsers
      // Create a link pointing to the ObjectURL containing the blob
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);
      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
      }, 100);
    },
    pageChange(ev, pIdx) {
      this.projAndQcsToShow[pIdx].currentPage = ev.page;
      //event.first: Index of first record
      //event.rows: Number of rows to display in new page
      //event.pageCount: Total number of pages
    },
    openNewQC() {
      this.$router.push({
        name: "QualityControl",
      });
    },
    findProjectIdxById(id) {
      return this.projAndQcsToShow.findIndex((p) => p.project_id === id);
    },
    handleFilterChange(projectId, filterType) {
      const projectIdx = this.findProjectIdxById(projectId);
      let selectedType = "";
      switch (filterType) {
        case "statuses":
          selectedType = "selectedStatuses";
          break;
        case "chapters":
          selectedType = "selectedChapters";
          break;
        case "impairments":
          selectedType = "selectedImpairments";
          break;
        case "levels":
          selectedType = "selectedLevels";
          break;
        case "project_desc":
          selectedType = "selectedProjects";
          break;
      }
      const filterIds = this[selectedType][projectId];

      this.projAndQcsToShow[projectIdx].optionalFilters[filterType].map((f) => {
        if (!filterIds.find((id) => id === f.id)) {
          f.show = false;
        } else f.show = true;
        return f;
      });

      // let oldProjs = [...this.projAndQcsToShow];

      // oldProjs[projectIdx].optionalFilters[filterType] = updatedFilters;
    },
    sortControlsByKey(key, sortBy, projectId) {
      const projectIdx = this.findProjectIdxById(projectId);
      this.activeSort.by = sortBy;
      if (sortBy === "id") {
        if (this.activeSort.asc) {
          this.projAndQcsToShow[projectIdx].qcs.sort((a, b) => b[key] - a[key]);
        } else {
          this.projAndQcsToShow[projectIdx].qcs.sort((a, b) => a[key] - b[key]);
        }
      } else if (sortBy === "date") {
        if (this.activeSort.asc) {
          this.projAndQcsToShow[projectIdx].qcs.sort(
            (a, b) => new Date(a.create_date) - new Date(b.create_date)
          );
        } else {
          this.projAndQcsToShow[projectIdx].qcs.sort(
            (a, b) => new Date(b.create_date) - new Date(a.create_date)
          );
        }
      } else {
        if (this.activeSort.asc) {
          this.projAndQcsToShow[projectIdx].qcs.sort((a, b) =>
            a[key].localeCompare(b[key])
          );
        } else {
          this.projAndQcsToShow[projectIdx].qcs.sort((a, b) =>
            b[key].localeCompare(a[key])
          );
        }
      }
      return (this.activeSort.asc = !this.activeSort.asc);
    },
    toggleOverlay(event, diff, projectId, type) {
      let optionalType = "";
      let selectedType = "";
      switch (type) {
        case "chapter":
          optionalType = "optionalChapters";
          selectedType = "selectedChapters";
          break;
        case "status":
          optionalType = "optionalStatuses";
          selectedType = "selectedStatuses";
          break;
        case "impairment":
          optionalType = "optionalImpairments";
          selectedType = "selectedImpairments";
          break;
        case "level":
          optionalType = "optionalLevels";
          selectedType = "selectedLevels";
          break;
        case "project_desc":
          optionalType = "optionalProjects";
          selectedType = "selectedProjects";
          break;
      }
      if (optionalType === "optionalProjects") {
        const projIdx = this.findProjectIdxById(projectId);
        this.optionalProjects[projectId] = this.projAndQcsToShow[projIdx].qcs
          .map((qc) => {
            const project = this.projectsList.find(
              (p) => p.project_id === qc.project_id
            );
            return {
              id: project.project_id,
              name: project.project_desc,
              show: true,
            };
          })
          .filter((value, index, self) => {
            return self.findIndex((i) => i.name === value.name) === index;
          });
        if (!this.selectedProjects[projectId]?.length) {
          this.selectedProjects[projectId] = this.optionalProjects[
            projectId
          ].map((opt) => opt.id);
        }
        return this.$refs[diff].toggle(event);
      }
      let optTypes = [];
      this.projectsAndQcs.forEach((proj) => {
        if (proj.project_id === projectId) {
          optTypes = proj.qcs
            .map((item) => {
              let name = "";
              let id = item[`${type}_id`];
              if (type === "chapter" || type === "status") {
                name = item[`${type}_name`];
              } else name = item[`${type}_desc`];
              if (type === "level") id = item["hardware_level_id"];
              return {
                name,
                id,
                show: true,
              };
            })
            .filter((value, index, self) => {
              return self.findIndex((i) => i.id === value.id) === index;
            });
        }
      });
      this[optionalType][projectId] = optTypes;
      if (!this[selectedType][projectId]?.length) {
        this[selectedType][projectId] = this[optionalType][projectId].map(
          (opt) => opt.id
        );
        // setTimeout(() => {
        //   const multiSelect = this.$refs[`statusMs${projectId}`];
        //   multiSelect.show();
        // }, 50);
      }
      this.$refs[diff].toggle(event);
    },
    filterControlsBy(filterBy, pId) {
      // If the filter is already active, so the user want to remove it.
      if (
        this.globalActiveFilter.for === pId &&
        pId !== 0 &&
        this.globalActiveFilter.type === filterBy
      ) {
        this.currentOpenQcIds = [];
        this.projAndQcsToShow = [...this.projectsAndQcs];
        this.globalActiveFilter = { for: null, type: null };
        this.toggleProjectQcs(pId);
        this.currentOpenProjectsIds.splice(
          this.currentOpenProjectsIds.indexOf(pId),
          1
        );
        return;
      }
      // if the user toggeling between one filter and another
      if (
        this.globalActiveFilter.for &&
        pId !== 0 &&
        this.globalActiveFilter.type !== filterBy
      ) {
        this.currentOpenQcIds = [];
        this.projAndQcsToShow = [...this.projectsAndQcs];
        this.toggleProjectQcs(pId);
        this.currentOpenProjectsIds.splice(
          this.currentOpenProjectsIds.indexOf(pId),
          1
        );
      }

      // setting filter by user's choice.
      this.globalActiveFilter = { for: pId, type: filterBy };
      this.currentProjectsAllQcsOpen.push(pId);
      const qcsToOpen = [];
      let filteredProjects = JSON.parse(JSON.stringify(this.projAndQcsToShow));
      switch (filterBy) {
        case "open":
          filteredProjects = filteredProjects.filter((p) => {
            if (pId === p.project_id || pId === 0) {
              p.qcs = p.qcs?.filter((qc) => {
                const stsId = qc.status_id;
                if (
                  stsId !== qcStatuses.e_close &&
                  stsId !== qcStatuses.e_canceled
                ) {
                  qcsToOpen.push(qc.quality_control_id);
                  return true;
                }
              });
            }
            return p;
          });
          break;
        case "all":
          filteredProjects = this.projectsAndQcs;
          break;
        case "delay":
          filteredProjects = filteredProjects.filter((p) => {
            if (pId === p.project_id) {
              p.qcs = p.qcs.filter((qc) => {
                if (qc.delay_days > 0) {
                  qcsToOpen.push(qc.quality_control_id);
                  return true;
                }
              });
            }
            return p;
          });
          break;
        case "closed":
          filteredProjects = filteredProjects.filter((p) => {
            if (pId === p.project_id) {
              p.qcs = p.qcs.filter((qc) => {
                if (qc.status_id === qcStatuses.e_close) {
                  qcsToOpen.push(qc.quality_control_id);
                  return true;
                }
              });
            }
            return p;
          });
          break;
        case "withQcs":
          filteredProjects = filteredProjects.filter((p) => {
            return pId === 0 && p.qcs.length > 0;
          });
          break;
      }
      this.projAndQcsToShow = [...filteredProjects];
      if (
        !this.currentOpenProjectsIds.find((prId) => prId === prId) &&
        pId !== 0
      ) {
        this.toggleProjectQcs(pId);
      }
      // qcsToOpen.forEach((qcId) => this.toggleQcData(qcId));
    },
    getAllFilters(proj) {
      let chapters = [];
      let statuses = [];
      let impairments = [];
      let levels = [];

      let project_desc = proj.qcs
        .map((qc) => {
          const project = this.projectsList.find(
            (p) => p.project_id === qc.project_id
          );
          return {
            id: project.project_id,
            name: project.project_desc,
            show: true,
          };
        })
        .filter((val, idx, self) => {
          return self.findIndex((i) => (i.name === val.name) === idx);
        });
      proj.qcs.forEach((qc) => {
        const {
          chapter_id,
          chapter_name,
          status_id,
          status_name,
          impairment_desc,
          impairment_id,
          level_desc,
          hardware_level_id,
        } = qc;
        if (!chapters.find((f) => f.id === chapter_id)) {
          chapters.push({ id: chapter_id, name: chapter_name, show: true });
        }

        if (!statuses.find((f) => f.id === status_id)) {
          statuses.push({ id: status_id, name: status_name, show: true });
        }
        if (!impairments.find((f) => f.id === impairment_id)) {
          impairments.push({
            id: impairment_id,
            name: impairment_desc,
            show: true,
          });
        }
        if (!levels.find((f) => f.id === hardware_level_id)) {
          levels.push({ id: hardware_level_id, name: level_desc, show: true });
        }
      });
      const optionalFilters = {
        chapters,
        statuses,
        impairments,
        levels,
        project_desc,
      };
      return optionalFilters;
    },
    showProjectQcs(pId) {
      return this.qcToShow.filter((qc) => qc.project_id === +pId);
    },
    getQcReportById(qId) {
      return this.qualityControlsReports.filter(
        (qc) => qc.quality_control_id == qId
      );
    },
    getQcImagesById(qId) {
      return this.attachFiles.filter((qc) => +qc.quality_control_id === +qId);
    },
    toggleAllQcs(projectId) {
      const projectIdIdx = this.currentProjectsAllQcsOpen.findIndex(
        (projId) => projId === projectId
      );
      const projectIdx = this.findProjectIdxById(projectId);
      if (projectIdIdx === -1) {
        //OPEN QCS.
        const newQcsToOpen = this.projAndQcsToShow[projectIdx].qcs.map(
          (qc) => qc.quality_control_id
        );
        this.currentOpenQcIds = [...this.currentOpenQcIds, ...newQcsToOpen];
        this.currentProjectsAllQcsOpen = [
          ...this.currentProjectsAllQcsOpen,
          projectId,
        ];
      } else {
        //CLOSE QCS
        const newArr = [...this.currentProjectsAllQcsOpen];
        newArr.splice(projectIdIdx, 1);
        this.currentProjectsAllQcsOpen = [...newArr];
        this.currentOpenQcIds = this.currentOpenQcIds.filter((qcId) => {
          const qc = this.projAndQcsToShow[projectIdx].qcs.find((qc) => {
            // && qc.project_id === projectId
            return +qc.quality_control_id === +qcId;
          });
          if (+qcId !== +qc?.quality_control_id) return qcId;
        });
      }
    },
    isProjectOpen(id) {
      const isProjectOpen = Boolean(
        this.currentOpenProjectsIds.find((projectId) => projectId === id)
      );
      return isProjectOpen;
    },
    isQcOpen(id) {
      return Boolean(this.currentOpenQcIds.find((qcId) => qcId === id));
    },
    toggleProjQcsAllRow(id) {
      if (this.groupBy.ControlSource === "project_desc") return;
      return this.toggleProjectQcs(id);
    },
    toggleProjectQcs(id) {
      this.skeletonProjectId = id;
      const projectIdx = this.currentOpenProjectsIds.findIndex(
        (projectId) => projectId === id
      );
      if (projectIdx === -1) {
        const projectIdx = this.findProjectIdxById(id);
        //הפרויקט נפתח רק אם יש לו נתונים
        if (this.projAndQcsToShow[projectIdx].qcs?.length > 0)
          this.currentOpenProjectsIds = [...this.currentOpenProjectsIds, id];
      } else {
        const newArr = [...this.currentOpenProjectsIds];
        newArr.splice(projectIdx, 1);
        this.currentOpenProjectsIds = [...newArr];
      }
      setTimeout(() => (this.skeletonProjectId = null), 300);
      // this.skeletonProjectId = null;
    },
    toggleQcData(qId) {
      const qcIdx = this.currentOpenQcIds.findIndex((qcId) => qcId === qId);
      if (qcIdx === -1) {
        this.currentOpenQcIds = [...this.currentOpenQcIds, qId];
      } else {
        const newArr = [...this.currentOpenQcIds];
        newArr.splice(qcIdx, 1);
        this.currentOpenQcIds = [...newArr];
      }
    },
    getOpenCloseText(projectId) {
      if (this.currentProjectsAllQcsOpen.find((id) => id === projectId)) {
        return "סגור הכל";
      }
      return "פתח הכל";
    },
    toggleGlobalLoadingSkeleton() {
      this.globalLoadingSkeletons = !this.globalLoadingSkeletons;
    },
    filterQualityControl() {
      this.projectsAndQcs = [];
      this.projAndQcsToShow = [];
      this.projectsList = [];
      this.qualityControlsReports = [];
      let projectsList = [];
      // const currentRoute = this.$route;
      let procParams = [apiParam("user_exec", this.userID, apiPType.Int)];
      this.chipFilters.forEach((filter) => {
        procParams.push(
          apiParam(
            filter.Name,
            filter.apointType === "multiSelect"
              ? filter.ControlSource.toString()
              : filter.ControlSource,
            filter.type
          )
        );
      });
      callProc("pr_qc_select", procParams)
        .then((result) => {
          result = JSON.parse(result);
          if (result.procReturnValue === 0) {
            // הצגת הודעה כאשר אין נתונים
            if (result.Table?.length === 0) {
              this.$toast.add({
                severity: "info",
                summary: "בקרות איכות",
                detail: "אין נתונים להצגה",
                life: 10000,
                closable: true,
              });
            }
            this.allQualityControls = result.Table;
            this.qualityControlsReports = result.Table1;
            this.attachFiles = result.Table2;
            this.projectsList = result.Table3;
            // אם מסננים לפי פרויקט מציגים רק את הפרויקטים שנבחרו
            const selectedPrjFilter = this.chipFilters?.find(
              (filter) => filter.num === this.chipFilters_enum.e_projectId
            )?.ControlSource;
            if (selectedPrjFilter?.length > 0 && 1 === 0) {
              projectsList = this.projectsList.filter((prj) =>
                selectedPrjFilter.includes(prj.project_id)
              );
            } else {
              projectsList = this.projectsList;
            }
            this.projectsAndQcs = projectsList.map((proj) => {
              proj.qcs = result.Table.filter((qc) => {
                if (qc.project_id === proj.project_id) return qc;
              });
              if (proj) proj.optionalFilters = this.getAllFilters(proj);
              proj.currentPage = 0;
              return proj;
            });
            this.projAndQcsToShow = JSON.parse(
              JSON.stringify(this.projectsAndQcs)
            );
            this.projectWithAllQcs = {
              project_id: -1,
              qcs: this.allQualityControls,
              project_desc: "כל הבקרות",
              currentPage: 0,
            };
            this.projectWithAllQcs.optionalFilters = this.getAllFilters(
              this.projectWithAllQcs
            );

            if (this.projAndQcsToShow.length === 1) {
              this.toggleProjectQcs(this.projAndQcsToShow[0].project_id);
            }
            if (this.groupBy.ControlSource !== "project_desc")
              this.groupByFunc();
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
    updateMainFilters(field) {
      if (
        Nz(field.ControlSource, "") === "" ||
        (field.apointType === "multiSelect" &&
          field.ControlSource.length === 0) ||
        (field.apointType === "checkbox" && !field.ControlSource)
      ) {
        let index = this.chipFilters.findIndex((f) => f.num === field.num);
        if (index >= 0) this.chipFilters.splice(index, 1);
      } else {
        if (this.chipFilters.find((f) => f.num === field.num) !== undefined) {
          this.chipFilters.find((f) => f.num === field.num).ControlSource =
            field.ControlSource;
        } else {
          this.chipFilters.push(field);
        }
      }
    },

    clearMainFilters(fieldNum) {
      if (fieldNum === undefined) {
        this.chipFilters = [];
      } else {
        let index = this.chipFilters.findIndex((f) => f.num === fieldNum);
        if (index >= 0) this.chipFilters.splice(index, 1);
        // this.removeFilter = fieldNum;
        this.filterQualityControl();
      }
    },
    setMainFilters() {
      this.filterQualityControl();
      this.displayMainFilters = false;
      // this.toggleProjectQcs(this.projAndQcsToShow[0].project_id);
    },
  },
  computed: {
    ...mapState({
      userID: (state) => +state.api.userID,
    }),
    getHeadlineToShow() {
      return this.groupBy.RowSource.find((group) => {
        return group.column_name === this.groupBy.ControlSource;
      }).desc;
    },
    getProjectDescAfterGroupBy() {
      return (pId) => {
        return this.projectsList.find((p) => p.project_id === pId).project_desc;
      };
    },
    getVal() {
      return (val) => {
        return val;
      };
    },
    showByCurrentPage() {
      return (page, qIdx) => {
        const minIdx = this.pageRows * page - 1;
        const maxIdx = minIdx + this.pageRows;
        return qIdx > minIdx && qIdx <= maxIdx;
      };
    },
    filteredQcs() {
      return (qcs, optionalFilters) => {
        const filteredQcs = qcs.filter((qc) => {
          let shouldShowQc = true;
          const statusId = qc.status_id;
          const chapterId = qc.chapter_id;
          const impairmentId = qc.impairment_id;
          const levelId = qc.hardware_level_id;
          const projectId = qc.project_id;
          shouldShowQc = optionalFilters.chapters.find(
            (f) => f.id === chapterId
          )?.show;
          if (!shouldShowQc) return shouldShowQc;
          shouldShowQc = optionalFilters.project_desc.find(
            (f) => f.id === projectId
          )?.show;
          if (!shouldShowQc) return shouldShowQc;
          shouldShowQc = optionalFilters.impairments.find(
            (f) => f.id === impairmentId
          )?.show;
          if (!shouldShowQc) return shouldShowQc;
          shouldShowQc = optionalFilters.levels.find(
            (f) => f.id === levelId
          )?.show;
          if (!shouldShowQc) return shouldShowQc;
          shouldShowQc = optionalFilters.statuses.find(
            (f) => f.id === statusId
          )?.show;
          if (!shouldShowQc) return shouldShowQc;
          return shouldShowQc;
        });
        return filteredQcs;
      };
    },

    filterProjects() {
      return (p) => {
        const QCS = this.projectsAndQcs.find(
          (prj) => prj.project_id === p.project_id
        ).qcs;
        if (this.displayPrjWithQC && QCS.length === 0) return false;
        if (
          this.displayPrjWithOpenQC &&
          !QCS.find(
            (qc) =>
              qc.status_id !== qcStatuses.e_close &&
              qc.status_id !== qcStatuses.e_canceled
          )
        )
          return false;

        return true;
      };
    },

    getFilterIcon() {
      return (type, pId) => {
        const projIdx = this.findProjectIdxById(pId);
        let optionalLength;
        const selectedLength =
          this.projAndQcsToShow[projIdx].optionalFilters[type].length;
        let iconToReturn = "pi pi-filter-slash unfiltered";

        switch (type) {
          case "statuses":
            optionalLength = this.optionalStatuses[pId]?.length;
            if (optionalLength && selectedLength !== optionalLength) {
              iconToReturn = "pi pi-filter";
            }
            break;
          case "project_desc":
            optionalLength = this.optionalProjects[pId]?.length;
            if (optionalLength && selectedLength !== optionalLength) {
              iconToReturn = "pi pi-filter";
            }
            break;
          case "chapters":
            optionalLength = this.optionalChapters[pId]?.length;
            if (optionalLength && selectedLength !== optionalLength) {
              iconToReturn = "pi pi-filter";
            }
            break;
          case "impairments":
            optionalLength = this.optionalImpairments[pId]?.length;
            if (optionalLength && selectedLength !== optionalLength) {
              iconToReturn = "pi pi-filter";
            }
            break;
          case "levels":
            optionalLength = this.optionalLevels[pId]?.length;
            if (optionalLength && selectedLength !== optionalLength) {
              iconToReturn = "pi pi-filter";
            }
            break;
        }
        return iconToReturn;
      };
    },
    showChevronUpOrDown() {
      return (id, currentOpenItem) => {
        if (this[currentOpenItem].find((openItemId) => openItemId === id))
          return "pi pi-chevron-up";
        else return "pi pi-chevron-down ";
      };
    },
    isActiveProject() {
      return (projectId) => (this.isProjectOpen(projectId) ? "active" : "");
    },
    isActiveQc() {
      return (qcId) => (this.isQcOpen(qcId) ? "active" : "");
    },
  },
  watch: {},
  updated() {
    const showedProjects = this.projAndQcsToShow.filter((p) => {
      return this.filterProjects(p);
    });
    if (showedProjects.length === 1 && !this.currentOpenProjectsIds.length) {
      this.toggleProjectQcs(showedProjects[0].project_id);
    }
  },
  mounted() {},
  created() {},
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  .layout {
    width: 98%;
    margin: 0 auto;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 {
        margin: 0;
        font-weight: 600;
        font-size: 2rem;
        display: inline-block;
      }
      .headerChild {
        display: flex;
        gap: 10px;
        align-items: center;
        span {
          label {
            margin-right: 6px;
          }
        }
      }

      button {
        // background: white;
        min-width: 35px;
        cursor: pointer;
        height: 40px;

        // font-size: 1.3rem;
      }
    }
    .sub-header {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .p-slider {
        margin-top: 10px;
      }
      label {
        margin-left: 25px;
        div,
        input {
          margin-right: 6px;
        }
      }

      .page-rows {
        p {
          margin: 0;
          margin-left: 15px;
          display: inline;
        }
      }
    }
    .main-table {
      width: 100%;
      border-top: 2px solid #1e81d6;
      margin-top: 15px;
      .headers-table {
        display: flex;
        background: #eeeeee;
        border-bottom: 1px solid lightgray;
        padding: 14px 10px;
        h5 {
          // cursor: pointer;
          margin: 0;
          font-weight: 600;
          &.w40 {
            width: 40%;
          }
          &.w15 {
            width: 15%;
          }
        }
      }
    }
    .data-table {
      .table-row {
        border-bottom: 1px solid lightgray;
        padding: 10px 6px;
        .table-row-wrapper {
          display: flex;
          &.active {
            background: #eeeeee;
          }
          h5 {
            margin: 0;
            span {
              cursor: pointer;
            }

            &.w40 {
              font-weight: 600;
              width: 40%;
            }
            &.w15 {
              width: 15%;
            }
            &.active-filter {
              color: #1e81d6;
              font-weight: 600;
            }
          }
          i {
            cursor: pointer;
          }
        }
        .open-project {
          .project-header {
            margin: 0 auto;
            margin-top: 10px;
            padding: 7px 0;
            display: flex;
            justify-content: space-between;
            h5 {
              font-size: 1.1rem;
            }
            button {
              border: 1px solid lightgray;
              background: white;
              width: 80px;
              cursor: pointer;
              transition: 0.4s;
              &:hover {
                background: lightgray;
              }
            }
          }
          .qcs-table-container {
            margin: 0 auto;
            .table-headers {
              background: #1e81d6;
              display: flex;
              padding: 10px 7px;
              h5 {
                padding: 0 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0;
                color: white;
                border-left: 1px solid white;
                &:nth-of-type(6) {
                  border-left: none;
                }
                span,
                i {
                  cursor: pointer;
                }
                &.w10 {
                  width: 10%;
                }
                &.w7 {
                  width: 7%;
                }
                &.w3 {
                  width: 3%;
                }
                &.w18 {
                  width: 18%;
                }
              }
            }
            .qc-table-row {
              transition: 0.7s ease-in;

              margin-bottom: 5px;
              &:nth-child(even) {
                background: white;
              }
              &.active {
                background: #dbe9f4;
              }
              .table-row-wrapper {
                display: flex;
                align-items: center;
                padding: 5px 0;

                h5 {
                  padding: 4px 12px;
                  margin: 0;
                  &.w10 {
                    width: 10%;
                  }
                  &.w7 {
                    width: 7%;
                  }
                  &.w3 {
                    width: 3%;
                  }
                  &.w18 {
                    width: 18%;
                  }
                }
                i {
                  margin-left: 6px;
                  cursor: pointer;
                }
              }
              .open-qc-container {
                transition: height 1s ease-out;
              }
            }
          }
        }
      }
    }
  }
}

// HELPERS:
.cursor-p {
  cursor: pointer;
}
.p-skeleton {
  background-color: rgb(28 28 28 / 6%);
}

.auto-cursor {
  cursor: auto !important;
}
.pi-filter {
  transition: 0.8s;
}
.pi-filter-slash {
  transition: 0.8s;
  &:hover {
    color: white;
    &::before {
      content: "\e94c";
    }
  }
}
.unfiltered {
  transition: 0.8s;
  color: #ffffff8a;
}
.mainFiltersOverlay {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.438);
  position: fixed;
  z-index: 1;
}
.mainFilters {
  width: 50vw;
  height: 100vh;
  margin: auto;
  background-color: white;
  padding: 20px;
}
</style>
