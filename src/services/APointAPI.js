import store from "../store/index";

const API_HOST = "https://api.apoint.co.il";
// const API_HOST = "https://localhost:44396"; //DEV
const FETCH_DEFAULT_TIMEOUT = 10 * 1000; //10 seconds
const PROC_DEFAULT_TIMEOUT = 10 * 1000; //10 seconds
const FETCH_DEFAULT_HEADERS = {
  "Content-Type": "application/json"
};

export const apiPType = {
  BigInt: 0,
  Binary: 1,
  Bit: 2,
  Char: 3,
  DateTime: 4,
  Decimal: 5,
  Float: 6,
  Image: 7,
  Int: 8,
  Money: 9,
  NChar: 10,
  NText: 11,
  NVarChar: 12,
  Real: 13,
  UniqueIdentifier: 14,
  SmallDateTime: 15,
  SmallInt: 16,
  SmallMoney: 17,
  Text: 18,
  Timestamp: 19,
  TinyInt: 20,
  VarBinary: 21,
  VarChar: 22,
  Variant: 23,
  Xml: 25,
  Udt: 29,
  Structured: 30,
  Date: 31,
  Time: 32,
  DateTime2: 33,
  DateTimeOffset: 34
};

export function Nz(val, zeroValue) {
  if (typeof zeroValue === "undefined")
    if (typeof val === "string") {
      zeroValue = "";
    } else {
      zeroValue = 0;
    }
  if (val === null || val === undefined) return zeroValue;
  else return val;
}

export function setSessionData(userName, userPswd, compGUID) {
  store.commit("api/setSessionData", {
    userName,
    userPswd,
    compGUID
  });
}

export function apiGetCompGUID(compID, WebPswd) {
  const raw = [
    apiParam("CompID", compID, apiPType.Int),
    apiParam("WebPswd", WebPswd)
  ];
  const controller = new AbortController();
  const options = {
    method: "POST",
    headers: FETCH_DEFAULT_HEADERS,
    signal: controller.signal,
    body: JSON.stringify(raw),
    redirect: "follow"
  };

  let timeoutID = setTimeout(() => {
    controller.abort;
    //TODO: לטפל במקרים של ניתוק תקשורת
    throw { error: "connection timeout" };
  }, FETCH_DEFAULT_TIMEOUT);

  // console.log(options);
  return fetch(API_HOST + "/dbActions/Login/GetCompGuid", options)
    .then(response => response.text()) //get text is async
    .then(result => {
      clearTimeout(timeoutID);
      //parse and clean extra api data
      // console.log('login\\GetCompGuid result: ', result)
      let res = JSON.parse(result);
      if (res.APIResponseCode === 0) {
        return res;
      } else {
        // console.log("apiGetCompGUID", res);
        return "";
      }
      // console.log(`login\\load APIResponseText: ${responseText}`);
    })
    .catch(error => {
      // console.log(`login\\GetCompGUID ${error}`);
      throw error;
    });
  // console.log(`apiGetCompGUID: ${compID} ${webPswd}`)
  // return '05885E42-5A7B-4F21-A139-A33EE947F545'
}

export function apiParam(name, val, pType = 8 /* int */) {
  return {
    paramName: name,
    paramValue: val === undefined ? null : val,
    paramType: pType
  };
}

export async function apiGetSessionToken(compGUID, userName, userPswd) {
  let raw = [
    apiParam("CompID", compGUID, 16),
    apiParam("UserName", userName),
    apiParam("UserPswd", userPswd)
  ];
  // console.log("apiGetSessionToken", raw);
  const controller = new AbortController();
  const options = {
    method: "POST",
    headers: FETCH_DEFAULT_HEADERS,
    signal: controller.signal,
    body: JSON.stringify(raw),
    redirect: "follow"
  };

  // console.log(options);
  let timeoutID = setTimeout(() => {
    controller.abort;
    //TODO: לטפל במקרים של ניתוק תקשורת
    throw { error: "connection timeout" };
  }, FETCH_DEFAULT_TIMEOUT);
  // console.log(store)
  store.commit("api/resetToken");
  store.commit("api/setSessionData", {
    userName,
    userPswd,
    compGUID
  });
  try {
    const response = await fetch(API_HOST + "/dbActions/Login/Auth", options);
    const result = await response.text();
    const response_1 = JSON.parse(result);
    clearTimeout(timeoutID);
    // console.log(response_1);
    if (response_1.APIResponseCode === 0) {
      let userObject = JSON.parse(response_1.APIResponseText);
      // console.log("Login/Auth response: ", response_1);
      store.commit("api/setSessionData", {
        sessionToken: userObject.sessionToken,
        userID: parseInt(userObject.userId)
      });

      return userObject.userID;
    } else {
      // console.log("apiGetSessionToken failed", response_1);
      return 0;
    }
  } catch (error) {
    console.log("apiGetSessionToken error: ", error);
    throw error;
  }
}

export function callProc(procName, procParams, timeout = PROC_DEFAULT_TIMEOUT) {
  // console.log("callProc: ", procName, procParams, store.state.api.sessionToken);
  const raw = [
    apiParam("sessionToken", store.state.api.sessionToken, 16),
    apiParam("procName", procName)
  ];
  if (procParams != undefined) {
    //add missing @ to param name
    (procParams = procParams.map(item =>
      item.paramName.substring(1, 1) === "@"
        ? item
        : {
            paramName: "@" + item.paramName,
            paramValue: item.paramValue,
            paramType: item.paramType
          }
    )),
      raw.push({
        paramName: "procParams",
        paramValue: JSON.stringify(procParams),
        paramType: 12
      });
  }
  // console.log(raw);
  const controller = new AbortController();
  const options = {
    method: "POST",
    headers: FETCH_DEFAULT_HEADERS,
    signal: controller.signal,
    body: JSON.stringify(raw),
    redirect: "follow"
  };
  let timeoutID = setTimeout(() => {
    controller.abort;
    //TODO: לטפל במקרים של ניתוק תקשורת
    throw { error: "connection timeout" };
  }, timeout);

  // console.log(options);
  return fetch(API_HOST + "/dbActions/callProc", options)
    .then(response => response.text()) //get text is async
    .then(result => {
      clearTimeout(timeoutID);
      //parse and clean extra api data
      let res = JSON.parse(result);
      // console.log(res);
      if (res.APIResponseCode == 0) {
        // console.log(`callProc APIResponseText: ${responseText}`);
        if (res.APIResponseText === "{}") return res.APIResponseCode;
        else return res.APIResponseText;
      } else {
        // console.log(raw);
        throw {
          errorCode: res.APIResponseCode,
          errorDescription: res.APIResponseDescription
          // responseText: res.APIResponseText,
        };
      }
    })
    .catch(error => {
      // console.log(`callProc error: ${procName}`, error);
      if (error.errorCode == -1) {
        //sessionToken expired
        store.commit("api/resetToken");
        //TODO: popup login page to re-login and get new token to continue current action
        //TODO: route to main login page with prev route info to return to after re-login
      }
      throw error;
    });
}

export function getCompanyDetails(compID) {
  if (compID === undefined) {
    compID = store.state.api.compID;
  }
  const raw = [apiParam("CompID", compID, 16)];
  const controller = new AbortController();
  const options = {
    method: "POST",
    headers: FETCH_DEFAULT_HEADERS,
    signal: controller.signal,
    body: JSON.stringify(raw),
    redirect: "follow"
  };

  let timeoutID = setTimeout(() => {
    controller.abort;
    //TODO: לטפל במקרים של ניתוק תקשורת
    throw { error: "connection timeout" };
  }, FETCH_DEFAULT_TIMEOUT);

  // console.log(options);
  return fetch(API_HOST + "/dbActions/Login/Load", options)
    .then(response => response.text()) //get text is async
    .then(result => {
      clearTimeout(timeoutID);
      //parse and clean extra api data
      // console.log(`login\\load result: ${result}`);
      let res = JSON.parse(result);
      if (res.APIResponseCode === 0) {
        return res.APIResponseText;
      } else {
        //compID guid is wrong
        return "";
      }
      // console.log(`login\\load APIResponseText: ${responseText}`);
    })
    .catch(error => {
      // console.log("login\\load", error);
      throw error;
    });
}

export function encrypt(data, encryptionKey = "") {
  if (encryptionKey == "") {
    encryptionKey = store.state.api.compGUID;
  }
  let enc = require("simple-encryptor")(encryptionKey); //ENC_KEY is usually compGUID
  return enc.encrypt(data);
}

export function decrypt(data, decryptionKey = "") {
  if (decryptionKey == "") {
    decryptionKey = store.state.api.compGUID;
  }
  let enc = require("simple-encryptor")(decryptionKey); //ENC_KEY is usually compGUID
  return enc.decrypt(data);
}
