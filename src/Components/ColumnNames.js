import "../css/columnnames.css";

const ColumnNames = () => {
  return (
    <div className="columnnames-container">
      <h3 className="cn-no">{"No"}</h3>
      <h3 className="cn-date">{"Date"}</h3>
      <h3 className="cn-shiftno">{"Shift"}</h3>
      <h3 className="cn-recorder">{"Recorder"}</h3>
      <h3 className="cn-station">{"Station"}</h3>
      <h3 className="cn-category">{"Category"}</h3>
      <h3 className="cn-subcategory">{"Sub Category"}</h3>
    </div>
  );
};

export default ColumnNames;
