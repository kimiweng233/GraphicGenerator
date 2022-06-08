import "./App.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import IssueCard from "./Components/IssueCard";

function App() {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);

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
      console.log(filtered);
      console.log(
        ExcelDateToJSDate(sheetData[3][Object.keys(sheetData[3])[1]])
          .toString()
          .slice(8, 10)
      );
      console.log(startDate.slice(8));
      console.log(endDate);
    }
  };

  function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
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
        FileName: <span>{fileName}</span>
      </p>
      Select start date to filter:{" "}
      <input type="date" className="start-date" onChange={handleStartDateOnChange} />
      {startDate}
      <div className="break"></div>
      Select end date to filter:{"   "}
      <input type="date" className="end-date" onChange={handleEndDateOnChange} />
      {endDate}
      <div className="break"></div>
      <button type="button" onClick={handleOnSubmit}>
        Search
      </button>
      <div className="log-display">
        {dateFiltered.length > 0 &&
          dateFiltered.reverse().map((issue) => {
            return <IssueCard issue={issue} />;
          })}
      </div>
    </div>
  );
}

export default App;
