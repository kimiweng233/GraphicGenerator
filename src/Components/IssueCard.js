const IssueCard = ({ issue }) => {
  function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  return (
    <div className="issue-container">
      Issue Date:
      {`${ExcelDateToJSDate(issue[2]).toISOString().slice(0, 10)}`} {issue[4]} {issue[6]}
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
