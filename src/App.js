import "./App.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ColumnNames from "./Components/ColumnNames";
import IssueCard from "./Components/IssueCard";
import DoughnutChart from "./Charts/Doughnut";

function App() {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("None");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);
  const [load, setLoad] = useState("log-display-load");
  const [hideLabels, setHideLabels] = useState("log-display-load");

  const [categories, setCategories] = useState({
    MES: 0,
    PLC: 0,
    "Operational Assistance": 0,
    IT: 0,
    Material: 0,
    Customer: 0,
    "MES-PLC Communication": 0,
    Others: 0,
  });
  const [subCategory, setSubCategory] = useState("MES");
  const [hideGraph, setHideGraph] = useState(true);

  const handleFileAsync = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets["Daily Report"];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    //adjust for 1 day negative offset
    for (var i = 0; i < jsonData.length; i++) {
      jsonData[i][Object.keys(jsonData[i])[1]] += 1;
    }
    console.log(jsonData);
    setSheetData(jsonData);
  };

  const handleStartDateOnChange = (e) => {
    console.log(e.target.value);
    setStartDate(e.target.value);
  };
  const handleEndDateOnChange = (e) => {
    console.log(e.target.value);
    setEndDate(e.target.value);
  };

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

  function dateFiltering(numb) {
    const year_num = ExcelDateToJSDate(numb).toString().slice(11, 15);
    const month_num = getMonthFromString(ExcelDateToJSDate(numb).toString().slice(5, 7));
    const day_num = ExcelDateToJSDate(numb).toString().slice(8, 10);
    const startDateYear = startDate.slice(0, 4);
    const endDateYear = endDate.slice(0, 4);
    const startDateMonth = startDate.slice(5, 7);
    const endDateMonth = endDate.slice(5, 7);
    const startDateDay = startDate.slice(8);
    const endDateDay = endDate.slice(8);

    // year check
    if (year_num >= startDateYear && year_num <= endDateYear) {
      if (month_num >= startDateMonth && month_num <= endDateMonth) {
        if (year_num == startDateYear && month_num < startDateMonth) {
          return false;
        }
        if (year_num == endDateYear && month_num > endDateMonth) {
          return false;
        }
        if (day_num >= startDateDay && day_num <= endDateDay) {
          if (month_num == startDateMonth && day_num < startDateDay) {
            return false;
          }
          if (month_num == endDateMonth && day_num < endDateDay) {
            return false;
          }
          return true;
        }
      }
    }
    return false;
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please enter both start and end dates");
    } else if (startDate > endDate) {
      alert("Please make sure to set correct dates");
    } else if (sheetData.length === 0) {
      alert("Please upload a valid excel file");
    } else {
      var filtered = sheetData.filter((issue) => {
        var startDateJS = new Date(startDate);
        var endDateJS = new Date(endDate);
        return (
          ExcelDateToJSDate(issue.Date) >= startDateJS &&
          ExcelDateToJSDate(issue.Date) <= endDateJS
        );
        // //year
        // ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(11, 15) >=
        //   startDate.slice(0, 4) &&
        // ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(11, 15) <=
        //   endDate.slice(0, 4) &&
        // //month
        // getMonthFromString(
        //   ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(4, 7)
        // ) >= startDate.slice(5, 7) &&
        // getMonthFromString(
        //   ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(4, 7)
        // ) <= endDate.slice(5, 7) &&
        // //day
        // ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(8, 10) >=
        //   startDate.slice(8) &&
        // ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(8, 10) <=
        //   endDate.slice(8)
      });
      setDateFiltered(filtered);
      setLoad("log-display");
      setHideLabels("label-display");
      var categories_temp = {
        MES: {
          total: 0,
          data: {
            total: 0,
            "MES signal didn't send/clear": 0,
            "work order status not correct": 0,
            "Pisces website not working (9190 rebuild)": 0,
            "data configuration not correct": 0,
            "manually insert WO": 0,
            "N/A": 0,
            Others: 0,
          },
        },
        PLC: {
          total: 0,
          data: {
            "PLC signal didn't send/clear": 0,
            "Camera/sensor/clip not working": 0,
            "RFID not reading carrier number": 0,
            "PLC hardware failure": 0,
            "N/A": 0,
            Others: 0,
          },
        },
        "Operational assist": {
          total: 0,
          data: {
            "rebuild request": 0,
            "reset station": 0,
            "reprint label": 0,
            "problem solved before arrival": 0,
            "install wrong part": 0,
            "lost part or label": 0,
            unmarried: 0,
            "Kitting sequencing/verification": 0,
            "N/A": 0,
            Others: 0,
          },
        },
        IT: {
          total: 0,
          data: {
            "printer failure": 0,
            "PC failure": 0,
            "server failure": 0,
            "cables tangled/disconnect": 0,
            "install wrong part": 0,
            "replace paper": 0,
            "N/A": 0,
            Others: 0,
          },
        },
        Material: {
          total: 0,
          data: {
            "part revision": 0,
            "wrong part": 0,
            "bad part": 0,
            "no part": 0,
            "N/A": 0,
            Others: 0,
          },
        },
        Customer: {
          total: 0,
          data: { "cancelled unit": 0, "short/partial shipping": 0, "N/A": 0, Others: 0 },
        },
        "MES_PLC communication": {
          total: 0,
          data: { handshake: 0, "N/A": 0, Others: 0 },
        },
        Others: { total: 0, data: { TBD: 0, "N/A": 0, Others: 0 } },
      };
      filtered.map((entry) => {
        if ("Category" in entry) {
          categories_temp[entry["Category"]]["total"] += 1;
          if ("sub_category" in entry) {
            if (entry["sub_category"] in categories_temp[entry["Category"]]["data"]) {
              categories_temp[entry["Category"]]["data"][entry["sub_category"]] += 1;
            } else {
              categories_temp[entry["Category"]]["data"]["Others"] += 1;
            }
          } else {
            categories_temp[entry["Category"]]["data"]["N/A"] += 1;
          }
        }
      });
      setCategories(categories_temp);
      setHideGraph(false);
    }
  };

  function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  function mode(array, specifier) {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0][specifier],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i][specifier];
      if (el != null && el != "") {
        if (modeMap[el] == null || "") modeMap[el] = 1;
        else modeMap[el]++;
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
    }
    return (
      <span className="stats-subtext">
        {maxEl} - {maxCount} entries
      </span>
    );
  }

  return (
    <div className="log-container">
      <Helmet>
        {" "}
        <script
          src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"
          type="text/javascript"
        />
      </Helmet>
      <h1> Maintenance Log Graphic Generator </h1>
      <input type="file" onChange={(e) => handleFileAsync(e)} />
      <p>
        File Uploaded: <span>{fileName}</span>
      </p>
      Select start date to filter:{" "}
      <input type="date" className="start-date" onChange={handleStartDateOnChange} />
      <div className="break"></div>
      Select end date to filter:{"   "}
      <input type="date" className="end-date" onChange={handleEndDateOnChange} />
      <div className="break"></div>
      <button type="button" className="search-button" onClick={handleOnSubmit}>
        Search
      </button>
      <div className={load}>
        <span className="fixed-text">
          <div className="stats">
            <h3>
              Total Entries Found:{" "}
              <span className="stats-subtext">{dateFiltered.length}</span>
            </h3>
            <h3>&#8226;</h3>
            <h3>Busiest Shift: {mode(dateFiltered, "Shift")}</h3>
            <h3>&#8226;</h3>
            <h3>Most Entries Recorded: {mode(dateFiltered, "MES")}</h3>
            <h3>&#8226;</h3>
            <h3>Most Frequent Station: {mode(dateFiltered, "Station")}</h3>
          </div>
          <ColumnNames />
        </span>
        <div className="entries-container">
          {dateFiltered.length > 0 &&
            dateFiltered.reverse().map((issue) => {
              return <IssueCard issue={issue} />;
            })}
        </div>
      </div>
      {!hideGraph && (
        <div style={{ width: "700px", height: "350px", margin: "0 auto" }}>
          <select type="select" onChange={(e) => setSubCategory(e.target.value)}>
            <DoughnutChart
              data_in={Object.values(categories).map((cat) => cat["total"])}
              labels_in={Object.keys(categories)}
            />
            {Object.keys(categories).map((cat) => {
              return <option value={cat}>{cat}</option>;
            })}
          </select>
          <DoughnutChart
            data_in={Object.values(categories[subCategory]["data"])}
            labels_in={Object.keys(categories[subCategory]["data"])}
          />
        </div>
      )}
    </div>
  );
}

export default App;
