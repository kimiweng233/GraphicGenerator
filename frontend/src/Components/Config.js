export const SPREADSHEET_NAME = "Daily Report";

export const CATEGORY_TEXT = "Category";
export const SUBCATEGORY_TEXT = "sub_category";
export const OPERATOR_TEXT = "MES";
export const SHIFT_TEXT = "Shift";
export const STATION_TEXT = "Station";
export const DATE_TEXT = "Date";
export const NUMBER_TEXT = "NO.";

export function generateTempDataStructure() {
    return {
        "MES": {
          "total": 0,
          "data": {
            "MES signal didn't send/clear": 0,
            "work order status not correct": 0,
            "Pisces website not working (9190 rebuild)": 0,
            "data configuration not correct": 0,
            "manually insert WO": 0,
            "Erroneous/Missing": 0,
          },
        },
        "PLC": {
          "total": 0,
          "data": {
            "PLC signal didn't send/clear": 0,
            "Camera/sensor/clip not working": 0,
            "RFID not reading carrier number": 0,
            "PLC hardware failure": 0,

            
            "Erroneous/Missing": 0,
          },
        },
        "Operational assist": {
          "total": 0,
          "data": {
            "rebuild request": 0,
            "reset station": 0,
            "reprint label": 0,
            "problem solved before arrival": 0,
            "install wrong part": 0,
            "lost part or label": 0,
            "unmarried": 0,
            "Kitting sequencing/verification": 0,
            "Erroneous/Missing": 0,
          },
        },
        "IT": {
          "total": 0,
          "data": {
            "printer failure": 0,
            "PC failure": 0,
            "server failure": 0,
            "cables tangled/disconnect": 0,
            "install wrong part": 0,
            "replace paper": 0,
            "Erroneous/Missing": 0,
          },
        },
        "Material": {
          "total": 0,
          "data": {
            "part revision": 0,
            "wrong part": 0,
            "bad part": 0,
            "no part": 0,
            "Erroneous/Missing": 0,
          },
        },
        "Customer": {
          "total": 0,
          "data": {
            "cancelled unit": 0,
            "short/partial shipping": 0,
            "Erroneous/Missing": 0,
          },
        },
        "MES_PLC communication": {
          "total": 0,
          "data": { "handshake": 0, "Erroneous/Missing": 0 },
        },
        "Others": { "total": 0, "data": { "TBD": 0, "Erroneous/Missing": 0 } },
      };
}

export function getCategories() {
    return Object.keys(generateTempDataStructure());
}