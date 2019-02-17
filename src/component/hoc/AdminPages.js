import React from "react";

import HeaderAdmin from "../header_footer/HeaderAdmin";


const AdminPages = (props) => {
  return (
    <div>
      <HeaderAdmin />
      {props.children}
    </div>
  );
};


export default AdminPages;
