import "../css/issuecard.css";

const IssueCard = ({ issue }) => {
  function ExcelDateToJSDate(date) {
    var hmm = new Date(Math.round((date - 25569) * 86400 * 1000));
    return hmm;
  }

  return (
    <div className="issue-container">
      <span className="issue-element">{issue["NO."]}</span>{" "}
      <span className="issue-element">{`${ExcelDateToJSDate(issue.Date)
        .toString()
        .slice(0, 15)}`}</span>
      <span className="issue-element">{issue.Shift}</span>
      <span className="issue-element"> {issue.MES}</span>
      <span className="issue-element">{issue.Station}</span>
      <span className="issue-element">{issue.Category}</span>
      <span className="issue-element">{issue.sub_category}</span>
    </div>
  );
};

export default IssueCard;
