import ReactTooltip from "react-tooltip";
import React from "react";
const ToolTip = () => {
  return (
    <React.Fragment>
      <i
        className="fa fa-info-circle ml-1 float-right mt-1 d-block"
        aria-hidden="true"
        data-tip
        data-for="tt_client"
      />
      <ReactTooltip id="tt_client" type="dark" effect="solid">
        <span className="tooltip-ts">
          Please select Carrier
       </span>
      </ReactTooltip>
    </React.Fragment>
  );
}

export default ToolTip;