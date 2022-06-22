import "../css/Home.css";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ColumnNames from "../Components/ColumnNames";
import IssueCard from "../Components/IssueCard";
import DoughnutChart from "../Charts/Doughnut";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Home = () => {
  const XLSX = require("xlsx");

  const [fileName, setFileName] = useState("None");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);
  const [load, setLoad] = useState("log-display-load");
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
  const [subCategory, setSubCategory] = useState(["MES"]);
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
        MES: {
          total: 0,
          data: {
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

  const generatePDF = (e) => {
    let input = window.document.getElementsByClassName("generateGraph")[0];
    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL();
      const pdf = new jsPDF("l", "pt");
      pdf.addImage(img, "png", 20, 0, 800, 500);
      pdf.save("chart.pdf");
    });
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

  useEffect(() => {
    console.log(subCategory);
  }, [subCategory]);

  return (
    <div className="log-container">
      <Helmet>
        <script
          src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"
          type="text/javascript"
        />
      </Helmet>
      <h1> Maintenance Log Graphic Generator </h1>
      <a href="/help">Instructions</a>
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
                return <option value={cat}>{cat}</option>;
              })}
              <option value={Object.keys(categories)}>All Categories</option>
            </select>
            {subCategory.map((cat) => {
              return (
                <DoughnutChart
                  data_in={Object.values(categories[cat]["data"])}
                  labels_in={Object.keys(categories[cat]["data"])}
                  title_in={`${cat} Sub Categories`}
                />
              );
            })}
          </span>
          <button onClick={(e) => generatePDF(e)}>Generate PDF</button>
        </div>
      )}
    </div>
  );
};

export default Home;
