import store from "../store/index";

import { callProc, apiParam, apiPType } from "../services/APointAPI.js";

export function pr_qc_reporting_ins(
  quality_control_id,
  status_id,
  responsible_id,
  action_performed,
  contractor_id
) {
  let procParams = [
    apiParam("user_exec", +store.state.api.userID, apiPType.Int),
    apiParam("quality_control_id", quality_control_id, apiPType.Int),
    apiParam("status_id", status_id, apiPType.Int),
    apiParam("responsible_id", responsible_id, apiPType.Int),
    apiParam("action_performed", action_performed, apiPType.NVarChar),
    apiParam("contractor_id", contractor_id, apiPType.Int)
  ];
  return callProc("pr_qc_reporting_ins", procParams);
}
