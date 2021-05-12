import { callProc, apiParam, apiPType } from "../services/APointAPI";
import { apiStore } from "./apiStore";

export const qualityControl = {
  namespaced: true,
  state: {
    statuses: [],
    zone1: [],
    zone2: [],
    zone3: [],
    chapters: [],
    responsibles: [],
    impairment: [],
    hardware_level: [],
    allUsers: [],
    notDone: [],
    projectsUser: [],
    contractors: [],
    timeOut: 3600000,
    timeOutId: null,
    isDataLoaded: false,
    selectedProjectId: null
  },
  mutations: {
    setSelectedProjectId(state, payload) {
      if (payload?.length === 1) state.selectedProjectId = payload[0];
      else if (payload && typeof payload === "number")
        state.selectedProjectId = payload;
      else state.selectedProjectId = null;
    }
  },
  actions: {
    loadDdlData({ state, dispatch }) {
      if (state.timeOut !== null) {
        clearTimeout(state.timeOutId);
      }
      state.timeOutId = setTimeout(() => {
        dispatch("loadDdlData");
      }, state.timeOut);
      // console.log("qcStore-loadDdlData", state, new Date());
      let procParams = [
        apiParam("user_exec", apiStore.state.userID, apiPType.Int)
      ];
      callProc("pr_qc_ddl_data", procParams)
        .then(result => {
          result = JSON.parse(result);
          if (result.Table.length > 0) {
            state.statuses = result.Table;
          }

          if (result.Table1.length > 0) {
            state.zone1 = result.Table1;
          }
          if (result.Table2.length > 0) {
            state.zone2 = result.Table2;
          }
          if (result.Table3.length > 0) {
            state.zone3 = result.Table3;
          }
          if (result.Table4.length > 0) {
            state.chapters = result.Table4;
          }
          if (result.Table5.length > 0) {
            state.responsibles = result.Table5;
          }
          if (result.Table6.length > 0) {
            state.impairment = result.Table6;
          }
          if (result.Table7.length > 0) {
            state.hardware_level = result.Table7;
          }
          if (result.Table8.length > 0) {
            state.allUsers = result.Table8;
          }
          if (result.Table9.length > 0) {
            state.notDone = result.Table9;
          }
          if (result.Table10.length > 0) {
            state.projectsUser = result.Table10;
          }
          if (result.Table11.length > 0) {
            state.contractors = result.Table11;
          }
        })
        .catch(error => {
          console.log("pr_qc_ddl_data-error-store", error);
          throw error;
        })
        .then(() => {
          state.isDataLoaded = true;
          // console.log("qcStore-loadDdlData-finish", state, new Date());
        });
    }
  },
  getters: {
    getStatuses: state => () => {
      return state.statuses;
    },
    getZone1: state => projectId => {
      if (projectId > 0)
        return state.zone1.filter(z => z.project_id === projectId);
      return state.zone1;
    },

    getZone2: state => projectId => {
      if (projectId > 0)
        return state.zone2.filter(z => z.project_id === projectId);
      return state.zone2;
    },

    getZone3: state => projectId => {
      if (projectId > 0)
        return state.zone3.filter(z => z.project_id === projectId);
      return state.zone3;
    },
    getChapters: state => () => {
      return state.chapters;
    },
    getResponsibles: state => projectId => {
      //? האם למיין את התפקידים ולפי מה
      let responsibles = state.responsibles;
      if (projectId > 0) {
        responsibles = responsibles.filter(
          rank => rank.project_id === projectId
        );
        // .sort(function(a, b) {
        //   if (
        //     a.user_rank_name.toLocaleLowerCase() <
        //     b.user_rank_name.toLocaleLowerCase()
        //   ) {
        //     return -1;
        //   }
        //   if (
        //     a.user_rank_name.toLocaleLowerCase() >
        //     b.user_rank_name.toLocaleLowerCase()
        //   ) {
        //     return 1;
        //   }
        //   return 0;
        // });
      } else {
        responsibles = responsibles
          .map(rank => rank.rank_id)
          .filter((value, index, self) => {
            return self.indexOf(value) === index && value !== "";
          })
          .map(rankId => ({
            rank_id: rankId,
            user_rank_name: state.responsibles.find(r => {
              // console.log(plan, p);
              return r.rank_id === rankId;
            }).rank_name
          }));
        // .sort(function(a, b) {
        //   if (
        //     a.rank_name.toLocaleLowerCase() < b.rank_name.toLocaleLowerCase()
        //   ) {
        //     return -1;
        //   }
        //   if (
        //     a.rank_name.toLocaleLowerCase() > b.rank_name.toLocaleLowerCase()
        //   ) {
        //     return 1;
        //   }
        //   return 0;
        // });
        //? מה להציג למשתמש בעת סינון בקרות כאשר לא נבחר פרויקט - תפקידים בלבד?
      }
      return responsibles;

      // let distinctUsers = state.responsibles;
      // if (projectId > 0) {
      //   distinctUsers = distinctUsers.filter(
      //     user => user.project_id === projectId
      //   );
      // }
      // distinctUsers = distinctUsers
      //   .map(user => user.user_id)
      //   .filter((value, index, self) => {
      //     return self.indexOf(value) === index && value !== "";
      //   });

      // return distinctUsers
      //   .map(user => ({
      //     user_id: user,
      //     user_full_name: state.responsibles.find(u => {
      //       // console.log(plan, p);
      //       return u.user_id === user;
      //     }).user_full_name
      //   }))
      //   .sort(function(a, b) {
      //     if (
      //       a.user_full_name.toLocaleLowerCase() <
      //       b.user_full_name.toLocaleLowerCase()
      //     ) {
      //       return -1;
      //     }
      //     if (
      //       a.user_full_name.toLocaleLowerCase() >
      //       b.user_full_name.toLocaleLowerCase()
      //     ) {
      //       return 1;
      //     }
      //     return 0;
      //   });
    },
    getImpairment: state => () => {
      return state.impairment;
    },
    getHardwareLevel: state => () => {
      return state.hardware_level;
    },
    getAllUsers: state => () => {
      return state.allUsers;
    },
    getNotDone: state => () => {
      return state.notDone;
    },
    getProjectsUser: state => () => {
      return state.projectsUser;
    },
    getContractors: state => projectId => {
      if (projectId > 0)
        return state.contractors.filter(c => c.project_id === projectId);
      return state.contractors;
    }
  }
};

//! ברגע שיש סינון שמשתמשים בו יותר מפעם אחת יש להעבירו לסטור כפרמטר לפונקציה
