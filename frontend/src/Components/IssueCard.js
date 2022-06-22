import "../css/issuecard.css";
import * as config from "../Components/Config";

const IssueCard = ({ issue }) => {
  function ExcelDateToJSDate(date) {
    var hmm = new Date(Math.round((date - 25569) * 86400 * 1000));
    return hmm;
  }

  return (
    <div className="issue-container">
      <span className="issue-element">{issue[config.NUMBER_TEXT]}</span>{" "}
      <span className="issue-element">{`${ExcelDateToJSDate(issue[config.DATE_TEXT])
        .toString()
        .slice(0, 15)}`}</span>
      <span className="issue-element">{issue[config.SHIFT_TEXT]}</span>
      <span className="issue-element"> {issue[config.OPERATOR_TEXT]}</span>
      <span className="issue-element">{issue[config.STATION_TEXT]}</span>
      <span className="issue-element">{issue[config.CATEGORY_TEXT]}</span>
      <span className="issue-element">{issue[config.SUBCATEGORY_TEXT]}</span>
    </div>
  );
};

export default IssueCard;
