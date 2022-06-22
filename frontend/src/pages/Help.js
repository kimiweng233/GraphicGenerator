import "../css/help.css";

const Help = () => {
  return (
    <div className="help-container">
      <h1>How to use Maintenance Log Graphic Generator</h1>
      <a href="/" className="back-button">
        &#x2190;
      </a>
      <a href="#view-report">View and Download Report</a>
      <a href="#change-report">
        Modify Source Code to Adapt to new Spreadsheet Configuration
      </a>
      <h2 id="#view-report">View and Download Report</h2>
      <p>
        1) <span>Click</span> the <button className="fake-button">Choose File</button>{" "}
        button and <span>select</span> a valid maintenance log file (Microsoft Excel
        Worksheet xlsx).
      </p>
      <img src="https://i.imgur.com/d5Ha4s1.png?1" title="source: imgur.com" />
      <p>
        <div className="long-break"></div> 2) <span>Select</span> a valid start and end
        date to filter only the entries in between those dates.
      </p>
      <img src="https://i.imgur.com/2LS5P6a.png?2" title="source: imgur.com" />
      <p></p>
      <img src="https://i.imgur.com/hUQqlEj.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <p>
        3) <span>Click</span> the <button className="fake-button">Search</button> button
        to view entries and graph visualizer.
      </p>
      <img src="https://i.imgur.com/A2pc4VK.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <p>
        4) After <h3>All Categories</h3> graph is generated, <span>select</span> a
        category from the dropdown menu to generate an additional graph of total
        subcategory entries based on the selected category.
      </p>
      <img src="https://i.imgur.com/2N2afbS.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <p>
        5) <span>Click</span> the <button className="fake-button">Generate PDF</button>{" "}
        button to download a separate report that displays statistics, category data, and
        graphs of entries in the selected time frame.
      </p>
      <img src="https://i.imgur.com/t8k1iic.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <p>
        6) <span>Click</span> the downloaded PDF file to open and view report.
      </p>
      <img src="https://i.imgur.com/VP9LNcc.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <img src="https://i.imgur.com/Rcux7hz.png?1" title="source: imgur.com" />
      <div className="x-long-break" id="change-report"></div>
      <h2>Modify Source Code to Adapt to new Spreadsheet Configuration</h2>
      <p>1) Go to Config.js file located in frontend/src/Components/Config.js </p>
      <p>
        2) To modify the processed spreadsheet, change SPREADSHEET_NAME const variable
      </p>
      <p>
        3) To modify the column names, <span>change</span> appropriate variable for the
        corresponding column name(s) (ex. CATEGORY_TEXT, SUBCATEGORY_TEXT, etc...)
      </p>
      <img src="https://i.imgur.com/VpbgoD5.png" title="source: imgur.com"></img>
      <div className="long-break"></div>
      <p>
        4) To modify main category field, <span>change</span> the key of the children
        javascript object key located in the function{" "}
        <span>generateTempDataStructure</span> (ex. "MES").
      </p>
      <p>
        5) To modify sub category fields, <span>change</span> the values of the data field
        in the child javascript object key located in the function{" "}
        <span>generateTempDataStructure</span> (ex. "MES signal didn't send/clear").
      </p>
      <img src="https://i.imgur.com/oklxFUZ.png" title="source: imgur.com"></img>
      <div className="long-break"></div>
    </div>
  );
};

export default Help;
