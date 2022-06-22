import "./App.css";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ColumnNames from "./Components/ColumnNames";
import IssueCard from "./Components/IssueCard";
import DoughnutChart from "./Charts/Doughnut";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

function App() {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("None");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);
  const [load, setLoad] = useState("log-display-load");
  const [categories, setCategories] = useState({});
  const [subCategory, setSubCategory] = useState(["MES",]);
  const [hideGraph, setHideGraph] = useState(true);

  const handleFileAsync = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets["Daily Report"];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
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
        startDateJS.setDate(startDateJS.getDate() + 1);
        var endDateJS = new Date(endDate);
        endDateJS.setDate(endDateJS.getDate() + 1);
        return (
          ExcelDateToJSDate(issue.Date) >= startDateJS &&
          ExcelDateToJSDate(issue.Date) <= endDateJS
        );
      });
      setDateFiltered(filtered);
      setLoad("log-display");

      var categories_temp = {
        "MES": {
          total: 0,
          data: {
            "MES signal didn't send/clear": 0,
            "work order status not correct": 0,
            "Pisces website not working (9190 rebuild)": 0,
            "data configuration not correct": 0,
            "manually insert WO": 0,
            "Erroneous/Missing": 0,
          },
        },
        "PLC": {
          total: 0,
          data: {
            "PLC signal didn't send/clear": 0,
            "Camera/sensor/clip not working": 0,
            "RFID not reading carrier number": 0,
            "PLC hardware failure": 0,
            "Erroneous/Missing": 0,
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
            "Erroneous/Missing": 0,
          },
        },
        "IT": {
          total: 0,
          data: {
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
          total: 0,
          data: {
            "part revision": 0,
            "wrong part": 0,
            "bad part": 0,
            "no part": 0,
            "Erroneous/Missing": 0,
          },
        },
        "Customer": {
          total: 0,
          data: { "cancelled unit": 0, "short/partial shipping": 0, "Erroneous/Missing": 0 },
        },
        "MES_PLC communication": {
          total: 0,
          data: { handshake: 0, "Erroneous/Missing": 0 },
        },
        "Others": { total: 0, data: { TBD: 0, "Erroneous/Missing": 0} },
        "Erroneous/Missing": { total: 0 },
      };
      filtered.map((entry) => {
        if ("Category" in entry && Object.keys(categories_temp).includes(entry["Category"])) {
          categories_temp[entry["Category"]]["total"] += 1;
          if ("sub_category" in entry && entry["sub_category"] in categories_temp[entry["Category"]]["data"]) {
            categories_temp[entry["Category"]]["data"][entry["sub_category"]] += 1;
          } else {
            categories_temp[entry["Category"]]["data"]["Erroneous/Missing"] += 1;
          } 
        } else {
          categories_temp["Erroneous/Missing"]["total"] += 1;
        }
      });
      setCategories(categories_temp);
      setHideGraph(false);
    }
  };

  function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  async function generatePDF(e) {
    const pdf = new jsPDF();
    const title = "Maintenance Log Data Report from " + startDate + " to " + endDate;
    pdf.text(title, 30, 13);
    let place_holder_main_canvas = await html2canvas(window.document.getElementsByClassName("generateGraph")[0])
    const img = place_holder_main_canvas.toDataURL();
    pdf.addImage(img, "png", 5, 20, 200, 100);

    pdf.text("Statistics", 15, 130);
    const analytics = {
      startY: 135,
      drawHeader: false,
      theme: "plain",
      body: [["Starting Date", startDate],
      ["Ending Date", endDate],
      ["Total Entries", dateFiltered.length],
      ["MES", categories["MES"]["total"]],
      ["PLC", categories["PLC"]["total"]],
      ["Operational assist ", categories["Operational assist"]["total"]],
      ["IT", categories["IT"]["total"]],
      ["Material", categories["Material"]["total"]],
      ["Customer", categories["Customer"]["total"]],
      ["MES_PLC communication", categories["MES_PLC communication"]["total"]],
      ["Others", categories["Others"]["total"]],
      ["Erroneous/Missing", categories["Erroneous/Missing"]["total"]]],
    };
    autoTable(pdf, analytics);

    pdf.addPage();

    let elements = window.document.getElementsByClassName("subGraphs")
    for (var i=0, yPlacement=20; i<elements.length; i++) {
      const categoryName = elements[i].className.substring(elements[i].className.indexOf(' ') + 1);
      const tempData = categories[categoryName]["data"]
      pdf.text(categoryName + " Category Data", 16, yPlacement);
      const graphBody = Object.keys(tempData).map((key) => [key, tempData[key]])
      const subGraphAnalytics = {
        startY: yPlacement + 10,
        drawHeader: false,
        tableWidth: 80,
        theme: "plain",
        body: graphBody,
      };
      autoTable(pdf, subGraphAnalytics);
      let place_holder_canvas = await html2canvas(elements[i]);
      pdf.addImage(place_holder_canvas.toDataURL(), "png", 105, yPlacement + 5, 100, 50, `img${i}`);
      yPlacement += (8 * graphBody.length + 20 > 70) ? 8 * graphBody.length + 20 : 70;
      if (yPlacement + 70 >= pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        yPlacement = 20;
      }
    }
    pdf.save("report.pdf")
  };

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
        <h1>Log Viewer</h1>
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
        </span>
        <div className="entries-container">
          <ColumnNames />
          {dateFiltered.length > 0 &&
            dateFiltered.reverse().map((issue) => {
              return <IssueCard issue={issue} />;
            })}
        </div>
      </div>
      {!hideGraph && (
        <div className="graph">
          <h1>Graph Viewer</h1>
          <span style={{ width: "700px", height: "350px", margin: "0 auto" }}>
            <div className="generateGraph">
              <DoughnutChart
                data_in={Object.values(categories).map((cat) => cat["total"])}
                labels_in={Object.keys(categories)}
                title_in="All Categories"
              />
            </div>
            <select
              className="select-category"
              type="select"
              onChange={(e) => {
                setSubCategory((existingItems) => [
                  ...existingItems.slice(0, 0),
                  ...e.target.value.split(","),
                ]);
              }}
            >
              {Object.keys(categories).map((cat) => {
                if (cat != "Erroneous/Missing")
                return <option value={cat}>{cat}</option>;
              })}
              <option value={Object.keys(categories).slice(0, Object.keys(categories).length-1)}>All Categories</option>
            </select>        
            {subCategory.map((cat) => {
              let tempClassName = "subGraphs " + cat;
              return <div className={tempClassName}>
                <DoughnutChart
                  data_in={Object.values(categories[cat]["data"])}
                  labels_in={Object.keys(categories[cat]["data"])}
                  title_in={`${cat} Sub Categories`}
                />
              </div>
            })}
          </span>
          <button onClick={(e) => generatePDF(e)}>Generate PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
