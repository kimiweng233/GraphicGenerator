function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

function getMonthFromString(mon) {
  var months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.indexOf(mon);
}

function hmm(num, startDate, endDate) {
  console.log(
    ExcelDateToJSDate(num).toString().slice(11, 15) >= startDate.slice(0, 4) &&
      ExcelDateToJSDate(num).toString().slice(11, 15) <= endDate.slice(0, 4) &&
      //month
      getMonthFromString(ExcelDateToJSDate(num).toString().slice(4, 7)) >=
        startDate.slice(5, 7) &&
      getMonthFromString(ExcelDateToJSDate(num).toString().slice(4, 7)) <=
        endDate.slice(5, 7) &&
      //day
      ExcelDateToJSDate(num).toString().slice(8, 10) >= startDate.slice(8) &&
      ExcelDateToJSDate(num).toString().slice(8, 10) <= endDate.slice(8)
  );
}
