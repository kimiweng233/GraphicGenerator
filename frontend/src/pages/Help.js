import "../css/help.css";

const Help = () => {
  return (
    <div className="help-container">
      <h1>How to use Maintenance Log Graphic Generator</h1>
      <a href="/">&#x2190;</a>
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
    </div>
  );
};

export default Help;
