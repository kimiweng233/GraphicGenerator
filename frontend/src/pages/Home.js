import "../css/home.css";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ColumnNames from "../Components/ColumnNames";
import IssueCard from "../Components/IssueCard";
import DoughnutChart from "../Charts/Doughnut";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as config from "../Components/Config";

const Home = () => {
  const [fileName, setFileName] = useState("None");
  const [sheetData, setSheetData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateFiltered, setDateFiltered] = useState([]);
  const [load, setLoad] = useState("log-display-load");
  const [showTableClass, setShowTableClass] = useState("show-table");
  const [categories, setCategories] = useState({});
  const [subCategory, setSubCategory] = useState([config.getCategories()[0]]);
  const [hideGraph, setHideGraph] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    document.title = "Maintenance Log Graphic Generator";
  }, []);

  const handleFileAsync = async (e) => {
    const XLSX = require("xlsx");
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[config.SPREADSHEET_NAME];
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

      var categories_temp = config.generateTempDataStructure();
      categories_temp["Erroneous/Missing"] = { total: 0 };
      filtered.map((entry) => {
        if (
          config.CATEGORY_TEXT in entry &&
          Object.keys(categories_temp).includes(entry[config.CATEGORY_TEXT])
        ) {
          categories_temp[entry[config.CATEGORY_TEXT]]["total"] += 1;
          if (
            config.SUBCATEGORY_TEXT in entry &&
            entry[config.SUBCATEGORY_TEXT] in
              categories_temp[entry[config.CATEGORY_TEXT]]["data"]
          ) {
            categories_temp[entry[config.CATEGORY_TEXT]]["data"][
              entry[config.SUBCATEGORY_TEXT]
            ] += 1;
          } else {
            categories_temp[entry[config.CATEGORY_TEXT]]["data"][
              "Erroneous/Missing"
            ] += 1;
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
    let place_holder_main_canvas = await html2canvas(
      window.document.getElementsByClassName("generateGraph")[0]
    );
    const img = place_holder_main_canvas.toDataURL();
    pdf.addImage(img, "png", 5, 20, 200, 100);

    pdf.text("Statistics", 15, 130);
    let tempBody = Object.keys(categories).map((key) => [key, categories[key]["total"]]);
    tempBody.unshift(
      ["Starting Date", startDate],
      ["Ending Date", endDate],
      ["Total Entries", dateFiltered.length]
    );
    const analytics = {
      startY: 135,
      drawHeader: false,
      theme: "plain",
      body: tempBody,
    };
    autoTable(pdf, analytics);

    pdf.addPage();

    let elements = window.document.getElementsByClassName("subGraphs");
    for (var i = 0, yPlacement = 20; i < elements.length; i++) {
      const categoryName = elements[i].className.substring(
        elements[i].className.indexOf(" ") + 1
      );
      const tempData = categories[categoryName]["data"];
      pdf.text(categoryName + " Category Data", 16, yPlacement);
      const graphBody = Object.keys(tempData).map((key) => [key, tempData[key]]);
      const subGraphAnalytics = {
        startY: yPlacement + 10,
        drawHeader: false,
        tableWidth: 80,
        theme: "plain",
        body: graphBody,
      };
      autoTable(pdf, subGraphAnalytics);
      let place_holder_canvas = await html2canvas(elements[i]);
      pdf.addImage(
        place_holder_canvas.toDataURL(),
        "png",
        105,
        yPlacement + 5,
        100,
        50,
        `img${i}`
      );
      yPlacement += 8 * graphBody.length + 20 > 70 ? 8 * graphBody.length + 20 : 70;
      if (yPlacement + 70 >= pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        yPlacement = 20;
      }
    }
    pdf.save("report.pdf");
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

  const handleChangeViewOnClick = (e) => {
    setShowTable((current) => !current);
    if (setShowTable === false) {
      setShowTableClass("show-table");
    } else {
      setShowTableClass("hide-table");
    }
  };

  return (
    <div className="log-container">
      <Helmet>
        <script
          src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"
          type="text/javascript"
        />
      </Helmet>
      <h1> Maintenance Log Graphic Generator </h1>
      <a href="/help">&#x3f;</a>
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
        <div className="long-break"></div>
        <span className="fixed-text">
          <div className="stats">
            <h3>
              Total Entries Found:{" "}
              <span className="stats-subtext">{dateFiltered.length}</span>
            </h3>
            <h3>&#8226;</h3>
            <h3>Busiest Shift: {mode(dateFiltered, config.SHIFT_TEXT)}</h3>
            <h3>&#8226;</h3>
            <h3>Most Entries Recorded: {mode(dateFiltered, config.OPERATOR_TEXT)}</h3>
            <h3>&#8226;</h3>
            <h3>Most Frequent Station: {mode(dateFiltered, config.STATION_TEXT)}</h3>
          </div>
        </span>
        <div className="entries-container">
          <ColumnNames />
          {dateFiltered.length > 0 &&
            dateFiltered.map((issue) => {
              return <IssueCard issue={issue} key={issue[config.NUMBER_TEXT]} />;
            })}
        </div>
      </div>
      {!hideGraph && (
        <div className="graph">
          <h1>Graph Viewer</h1>
          <button className="display-button" onClick={handleChangeViewOnClick}>
            Display Category Data
          </button>
          <div className="long-break"></div>
          <h3>All Categories</h3>
          <span style={{ width: "700px", height: "350px", margin: "0 auto" }}>
            {showTable && (
              <div className="generateGraph">
                <div className="category-data">
                  <table>
                    <tr>
                      <th>Category</th>
                      <th>Total</th>
                    </tr>

                    {Object.keys(categories).map((key) => (
                      <tr>
                        <td>{key}: </td>{" "}
                        <td>
                          {categories[key]["total"]}
                          <div className="break"></div>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
                <div className="graph-section">
                  <DoughnutChart
                    data_in={Object.values(categories).map((cat) => cat["total"])}
                    labels_in={Object.keys(categories)}
                    title_in="All Categories"
                  />
                </div>
              </div>
            )}
            {!showTable && (
              <div className="graph-section-2">
                <DoughnutChart
                  data_in={Object.values(categories).map((cat) => cat["total"])}
                  labels_in={Object.keys(categories)}
                  title_in="All Categories"
                />
              </div>
            )}
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
                if (cat != "Erroneous/Missing") return <option value={cat}>{cat}</option>;
              })}
              <option
                value={Object.keys(categories).slice(
                  0,
                  Object.keys(categories).length - 1
                )}
              >
                All Categories
              </option>
            </select>

            {subCategory.map((cat) => {
              let tempClassName = "subGraphs " + cat;
              return (
                <div className={tempClassName} key={tempClassName}>
                  <h3>{cat}</h3>
                  <DoughnutChart
                    data_in={Object.values(categories[cat]["data"])}
                    labels_in={Object.keys(categories[cat]["data"])}
                    title_in={`${cat} Sub Categories`}
                  />
                  <div className="x-long-break"></div>
                </div>
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
