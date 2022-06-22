import "../css/columnnames.css";
import * as config from "../Components/Config";

const ColumnNames = () => {
  return (
    <div className="columnnames-container">
      <h3 className="cn-no">{config.NUMBER_TEXT}</h3>
      <h3 className="cn-date">{config.DATE_TEXT}</h3>
      <h3 className="cn-shiftno">{config.SHIFT_TEXT}</h3>
      <h3 className="cn-recorder">{config.OPERATOR_TEXT}</h3>
      <h3 className="cn-station">{config.STATION_TEXT}</h3>
      <h3 className="cn-category">{config.CATEGORY_TEXT}</h3>
      <h3 className="cn-subcategory">{config.SUBCATEGORY_TEXT}</h3>
    </div>
  );
};

export default ColumnNames;
