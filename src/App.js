import "./App.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ColumnNames from "./Components/ColumnNames";
import IssueCard from "./Components/IssueCard";
import ReactTooltip from "react-tooltip";

function App() {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("None");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);
  const [load, setLoad] = useState("log-display-load");
  const [hideLabels, setHideLabels] = useState("log-display-load");

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
    setSheetData(jsonData);
  };

  const handleStartDateOnChange = (e) => {
    setStartDate(e.target.value);
  };
  const handleEndDateOnChange = (e) => {
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

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please enter both start and end dates");
    } else if (startDate > endDate) {
      alert("Please make sure to set correct dates");
    } else if (sheetData.length === 0) {
      alert("Please upload a valid excel file");
    } else {
      console.log(ExcelDateToJSDate(sheetData[0]["Date"]));
      console.log(startDate);
      var filtered = sheetData.filter((issue) => {
        return (
          //year
          ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(11, 15) >=
            startDate.slice(0, 4) &&
          ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(11, 15) <=
            endDate.slice(0, 4) &&
          //month
          getMonthFromString(
            ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(4, 7)
          ) >= startDate.slice(5, 7) &&
          getMonthFromString(
            ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(4, 7)
          ) <= endDate.slice(5, 7) &&
          //day
          ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(8, 10) >=
            startDate.slice(8) &&
          ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(8, 10) <=
            endDate.slice(8)
        );
      });
      setDateFiltered(filtered);
      setLoad("log-display");
      setHideLabels("label-display");
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
    </div>
  );
}

export default App;
