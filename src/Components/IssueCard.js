import "../css/issuecard.css";

const IssueCard = ({ issue }) => {
  function ExcelDateToJSDate(date) {
    var hmm = new Date(Math.round((date - 25569) * 86400 * 1000));
    return hmm;
  }

  // {`${ExcelDateToJSDate(issue[2]).toISOString().slice(0, 10)}`}
  // console.log(ExcelDateToJSDate(issue[Object.keys(issue)[1]]));
  return (
    <div className="issue-container">
      {issue[Object.keys(issue)[0]]} {issue[Object.keys(issue)[1]]}
      {`${ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(0, 15)}`}{" "}
      {/* {`${ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toISOString().slice(0, 10)}`} */}
      {issue[Object.keys(issue)[2]]} {issue[Object.keys(issue)[3]]}{" "}
      {/* {issue[0]}
      <div className="break"></div>
      {issue[1]}
      <div className="break"></div>
      {issue[2]}
      <div className="break"></div>
      {issue[3]}
      <div className="break"></div>
      {issue[4]}
      <div className="break"></div>
      {issue[5]}
      <div className="break"></div> */}
    </div>
  );
};

export default IssueCard;
