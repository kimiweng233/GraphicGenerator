import "./App.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import IssueCard from "./Components/IssueCard";

function App() {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFileAsync = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    setSheetData(jsonData);
  };

  const handleStartDateOnChange = (e) => {
    setStartDate(e.target.value);
  };
  const handleEndDateOnChange = (e) => {
    setEndDate(e.target.value);
  };

  const xport = React.useCallback(async () => {
    /* Create worksheet from HTML DOM TABLE */
    const table = document.getElementById("Table2XLSX");
    const wb = XLSX.utils.table_to_book(table);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, "SheetJSTable.xlsx");
  });

  function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  console.log(sheetData);

  return (
    <div className="App">
      <Helmet>
        {" "}
        <script
          src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"
          type="text/javascript"
        />
      </Helmet>
      <input type="file" onChange={(e) => handleFileAsync(e)} />
      <p>
        FileName: <span>{fileName}</span>
      </p>
      Select start date to filter:
      <input type="date" className="start-date" onChange={handleStartDateOnChange} />
      {startDate}
      <div className="break"></div>
      Select end date to filter:
      <input type="date" className="end-date" onChange={handleEndDateOnChange} />
      {endDate}
      {sheetData.length > 0 &&
        sheetData
          .reverse()
          .splice(1, 5000)
          .map((issue) => {
            return <IssueCard issue={issue} />;
          })}
      <table id="Table2XLSX">
        <tbody>
          <tr>
            <td colSpan="3">SheetJS Table Export</td>
          </tr>
          <tr>
            <td>Author</td>
            <td>ID</td>
            <td>Note</td>
          </tr>
          <tr>
            <td>SheetJS</td>
            <td>7262</td>
            <td>Hi!</td>
          </tr>
          <tr>
            <td colSpan="3">
              <a href="//sheetjs.com">Powered by SheetJS</a>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={xport}>
        <b>Export XLSX!</b>
      </button>
    </div>
  );
}

export default App;
