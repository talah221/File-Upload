export function csvToObjArray(csv, spliter = ",") {
  //parse csv to object
  // console.log("csv", csv);
  let ar = [];
  if (csv === undefined || csv === "" || csv === null) return ar;
  ar = csv.split(spliter);
  return ar.map((val, index) => {
    return { key: index, value: val };
  });
  // console.log("res", res);
}

export function arrayToCsv(a, seperator = ",") {
  //convert array of items to csv string
  return a.join(seperator);
}

export function dateStr(
  today,
  yrDigits = 4,
  withTime = false,
  withSeconds = false
) {
  if (typeof today === "undefined") {
    today = new Date();
  } else {
    if (typeof today === "string") today = new Date(today);
  }
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;

  let mm = today.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;
  let yy = today.getFullYear() - (yrDigits === 2 ? 2000 : 0);
  today = dd + "/" + mm + "/" + yy;
  if (withTime) {
    let hh = today.getHours();
    if (hh < 10) hh = "0" + hh;

    let nn = today.getMinutes();
    if (nn < 10) nn = "0" + nn;
    today += ` ${hh}:${mm}`;
    if (withSeconds) {
      let ss = today.getSeconds();
      if (ss < 10) ss = "0" + ss;
      today += `:${ss}`;
    }
  }
  return today;
}
export function dateFormat(
  date,
  withTime = false,
  withSeconds = false,
  yrTwoDigits = false
) {
  let dateOption = {
    month: "2-digit",
    day: "2-digit"
  };

  if (yrTwoDigits) dateOption.year = "2-digit";
  else dateOption.year = "numeric";

  if (withTime) {
    dateOption.hour = "2-digit";
    dateOption.hour12 = false;
    dateOption.minute = "2-digit";
    if (withSeconds) dateOption.second = "2-digit";
  }

  if (date === undefined) {
    date = new Date();
  } else {
    if (typeof date === "string") date = new Date(date);
  }

  let formated = new Intl.DateTimeFormat("en-US", dateOption).format(date);

  return formated.replace(",", "");
}
