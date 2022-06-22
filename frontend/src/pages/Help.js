import "../css/help.css";

const Help = () => {
  return (
    <div className="help-container">
      <h1>How to use Maintenance Log Graphic Generator</h1>
      <a href="/">&#x2190;</a>
      <h2>View and Download Report</h2>
      <p>
        1) Click the <button className="fake-button">Choose File</button> button and
        select a valid maintenance log file (Microsoft Excel Worksheet xlsx).
      </p>
      <img src="https://i.imgur.com/d5Ha4s1.png?1" title="source: imgur.com" />
      <p>
        {" "}
        2) Select a valid start and end date to filter only the entries in between those
        dates.
      </p>
      <img src="https://i.imgur.com/2LS5P6a.png?2" title="source: imgur.com" />
      <p></p>
      <img src="https://i.imgur.com/hUQqlEj.png?1" title="source: imgur.com" />
      <p>
        3) Click the <button className="fake-button">Search</button> button to view
        entries and graph visualizer.
      </p>
      <img src="https://i.imgur.com/A2pc4VK.png?1" title="source: imgur.com" />
      <p>
        4) After <h3>All Categories</h3> graph is generated, select a category from the
        dropdown menu to generate an additional graph of total subcategory entries based
        on the selected category.
      </p>
      <img src="https://i.imgur.com/2N2afbS.png?1" title="source: imgur.com" />
      <p>
        5) Click the <button className="fake-button">Generate PDF</button> button to
        download a separate report that displays statistics, category data, and graphs of
        entries in the selected time frame
      </p>
      <img src="https://i.imgur.com/t8k1iic.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <p>6) Click the downloaded PDF file to open and view report.</p>
      <img src="https://i.imgur.com/VP9LNcc.png?1" title="source: imgur.com" />
      <div className="long-break"></div>
      <img src="https://i.imgur.com/Rcux7hz.png?1" title="source: imgur.com" />
    </div>
  );
};

export default Help;
