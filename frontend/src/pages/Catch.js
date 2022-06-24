import "../css/help.css";
import React, { useEffect } from "react";

const Help = () => {
  useEffect(() => {
    document.title = "Oops!";
  }, [])

  return (
    <div className="help-container">
      <h1>You have visited a page that's yet to be developed! Click on below to go to the working pages!</h1>
      <p></p>
      <a href="/">Graphics Generator</a>
      <a href="/help">Instructions</a>
    </div>
  );
};

export default Help;
