import moment from "moment";
import { DateType } from "../types";

class Config {
  static typeOf = (value: any): string => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  };

  static isEmpty = (value: any): boolean => {
    switch (typeof value) {
      case "object": {
        if (Array.isArray(value)) return value.length <= 0;
        else return (value && Object.keys(value).length <= 0) || !value;
      }
      case "string": {
        return !value;
      }
      case "number": {
        return value === 0 ? false : !value;
      }
      default: {
        return !value;
      }
    }
  };

  static toTimestamp = (dateProp: DateType, timeProp: DateType): DateType => {
    const date = !this.isEmpty(dateProp)
      ? moment(dateProp).format("YYYY-MM-DD")
      : "";
    const time = !this.isEmpty(timeProp)
      ? moment(timeProp).format("HH:mm:ss")
      : "";
    const timestamp =
      date && time ? Date.parse(`${date}T${time}`) : dateProp || timeProp;
    return timestamp; // QC Passed
  };

  static isValidDateTime = (dateValue: any) => {
    let result = false;
    if (Config.typeOf(dateValue) === "string" && !Config.isEmpty(dateValue)) {
      let regexDate =
        /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
      //regexDate Bao gồm các ngày như sau https://regexr.com/39tr1
      let utcRegex =
        /^[0-9]{4}-((0[1-9]|1[0-2])){1}-(0[1-9]|1[0-9])T(23:59:60|(([01]([0-9])|(2[0-3])){1}:?([0-5][0-9])){1}(:?([0-5][0-9])(.([0-9]+))?))?(Z|(\+|-)([01]([0-9])|(2[0-4])){1}((:)?([0-5][0-9]){1})?){1}$/;
      //utcRegex Bao gồm các ngày như sau https://www.regextester.com/95191
      if (regexDate.test(dateValue)) {
        result = regexDate.test(dateValue.trim());
      }
      if (utcRegex.test(dateValue)) {
        result = utcRegex.test(dateValue.trim());
      }
      if (
        !result &&
        (dateValue.split("/").length === 3 || dateValue.split("-").length === 3)
      ) {
        //Các trường hợp còn lại
        const value =
          dateValue.length > 10 ? dateValue.slice(0, 10).trim() : dateValue;

        switch (true) {
          case moment(value, "YYYY-MM-DD", true).isValid():
          case moment(value, "YYYY-DD-MM", true).isValid():
          case moment(value, "YYYY/DD/MM", true).isValid():
          case moment(value, "YYYY/MM/DD", true).isValid():
          case moment(value, "MM/DD/YYYY", true).isValid():
          case moment(value, "MM-DD-YYYY", true).isValid():
          case moment(value, moment.ISO_8601, true).isValid(): {
            result = true;
            break;
          }
          default:
            break;
        }
      }
    }
    if (this.typeOf(dateValue) === "number")
      result = Date.parse(dateValue) >= 0;
    return result;
  };
}

export default Config;
