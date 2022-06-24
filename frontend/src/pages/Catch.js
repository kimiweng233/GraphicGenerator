import "../css/catch.css";
import React, { useEffect } from "react";

const Help = () => {
  useEffect(() => {
    document.title = "Oops!";
  }, []);

  return (
    <div className="help-container">
      <h1>404</h1>
      <div className="break"></div>
      <p>
        You have visited a page that's yet to be developed! Click on below to go to the
        working pages!
      </p>
      <p></p>
      <a href="/">Maintenance Log Graphic Generator</a>
      <a href="/help">Instructions</a>
    </div>
  );
};

export default Help;
