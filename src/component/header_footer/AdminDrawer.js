import React from "react";
import { connect} from 'react-redux'
import { NavLink } from "react-router-dom";

import { signOut } from "../../actions/auth";

const AdminDrawer = props => {
  let attachedCSS = ["sideDrawer", "close"];
  if (props.show) {
    attachedCSS = ["sideDrawer", "open"];
  }
  const lists = [
    { name: "Cgs", linkTo: "/admin/cgs" },
    { name: "Add Cgs", linkTo: "/admin/cgs_edit" },
    { name: "Lessons", linkTo: "/admin/lessons" },
    { name: "Add Lesson", linkTo: "/admin/lessons_edit" },
    { name: "Location", linkTo: "/admin/location" },
    { name: "Add Location", linkTo: "/admin/location_edit" },
    { name: "Bible Study", linkTo: "/admin/study" },
    { name: "Add Bile Study", linkTo: "/admin/study_edit" },
    { name: "Tracts", linkTo: "/admin/track" },
    { name: "Add Tracts", linkTo: "/admin/track_edit" },
  ];
 
  return (
    <div className={attachedCSS.join(" ")}>
      <div onClick={props.closed}>
        <nav>
          {lists.map(list => (
            <ul className="navigationItems" key={list.name}>
              <li className="link">
                <NavLink to={list.linkTo} exact activeClassName="active">
                  {list.name}
                </NavLink>
              </li>
            </ul>
          ))}
          <button onClick={props.dispatch(signOut)}>Logout</button>
        </nav>
      </div>
    </div>
  );
};

export default connect()(AdminDrawer);
