import './App.css';
import React from 'react';
import {Helmet} from "react-helmet";

function App() {
  const XLSX = require("xlsx");

  const xport = React.useCallback(async () => {
      /* Create worksheet from HTML DOM TABLE */
      const table = document.getElementById("Table2XLSX");
      const wb = XLSX.utils.table_to_book(table);

      /* Export to file (start a download) */
      XLSX.writeFile(wb, "SheetJSTable.xlsx");
  });

  return (
    <div className="App">
      <Helmet> <script src= "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js" type="text/javascript" /></Helmet>
      <input type="file" id="input_dom_element"></input>

      <table id="Table2XLSX"><tbody>
        <tr><td colSpan="3">SheetJS Table Export</td></tr>
        <tr><td>Author</td><td>ID</td><td>Note</td></tr>
        <tr><td>SheetJS</td><td>7262</td><td>Hi!</td></tr>
        <tr><td colSpan="3">
          <a href="//sheetjs.com">Powered by SheetJS</a>
        </td></tr>
      </tbody></table>
      <button onClick={xport}><b>Export XLSX!</b></button>
      

    </div>
  );
}

export default App;
