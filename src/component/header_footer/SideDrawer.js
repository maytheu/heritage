import React from "react";
import { NavLink } from "react-router-dom";

import { firebase } from "../../firebase";

const SideDrawer = props => {
  let attachedCSS = ["sideDrawer", "close"];
  const adminLists = [
    { name: "Cgs", linkTo: "/admin/cgs" },
    { name: "Add Cgs", linkTo: "/admin/cgs_edit" },
    { name: "Sunday School", linkTo: "/admin/lessons" },
    { name: "Add Sunday School", linkTo: "/admin/lessons_edit" },
    { name: "Location", linkTo: "/admin/location" },
    { name: "Add Location", linkTo: "/admin/location_edit" },
    { name: "Bible Study", linkTo: "/admin/study" },
    { name: "Add Bile Study", linkTo: "/admin/study_edit" },
    { name: "Tracts", linkTo: "/admin/track" },
    { name: "Add Tracts", linkTo: "/admin/track_edit" }
  ];
  const lists = [
    { name: "About Us", linkTo: "/about" },
    { name: "Church Address", linkTo: "/locate" },
    { name: "Steps To Deliverance", linkTo: "/steps" },
    { name: "Sunday School", linkTo: "/lessons" },
    { name: "Bible Study", linkTo: "/study" },
    { name: "Cgs", linkTo: "/cgs" },
    { name: "Tracts", linkTo: "/tracts" }
  ];
  const logoutHandler = () => {
    firebase.auth().signOut();
  };
  if (props.show) {
    attachedCSS = ["sideDrawer", "open"];
  }
  return (
    <div className={attachedCSS.join(" ")} onClick={props.closed}>
      <div>
        {!props.user ? (
          <ul className="navigationItems">
            {lists.map(list => (
              <li className="link" key={list.name}>
                <NavLink to={list.linkTo} exact activeClassName="active">
                  {list.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <ul className="navigationItems">
              {adminLists.map(list => (
                <li className="link" key={list.name}>
                  <NavLink to={list.linkTo} exact activeClassName="active">
                    {list.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button onClick={() => logoutHandler()}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;
