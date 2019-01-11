import React from "react";

import HeaderPages from "../header_footer/HeaderPages";

const Pages = props => {
  return (
    <div>
      <HeaderPages />
      {props.children}
    </div>
  );
};

export default Pages;
