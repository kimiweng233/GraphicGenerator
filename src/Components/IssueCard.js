import "../css/issuecard.css";

const IssueCard = ({ issue }) => {
  function ExcelDateToJSDate(date) {
    var hmm = new Date(Math.round((date - 25569) * 86400 * 1000));
    return hmm;
  }

  return (
    <div className="issue-container">
      {issue[Object.keys(issue)[0]]} {issue[Object.keys(issue)[1]]}
      {`${ExcelDateToJSDate(issue[Object.keys(issue)[1]]).toString().slice(0, 15)}`}{" "}
      {issue[Object.keys(issue)[2]]} {issue[Object.keys(issue)[3]]}{" "}
    </div>
  );
};

export default IssueCard;
