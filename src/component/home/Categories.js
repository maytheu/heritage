import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Categories = () => {
  return (
    <div className="container">
      <div className="category">
        <div className="item">
          <Link to="/lessons">
            <div>
              <i className="material-icons large">import_contacts</i>
            </div>
            <div>Sunday School </div>
            <div>Lessons</div>
          </Link>
        </div>
        <div className="item">
          <Link to="/cgs">
            <div>
              <i className="material-icons large">music_note</i>
            </div>
            <div>Cgs</div>
          </Link>
        </div>
        <div className="item">
          <Link to="/locate">
            <div>
              <i className="material-icons large">location_on</i>
            </div>
            <div>Locate a Branch</div>
          </Link>
        </div>
      </div>
      <div className="category">
        <div className="item">
          <Link to="/hymn">
            <div>
              <i className="material-icons large">book</i>
            </div>
            <div>Hymn</div>
          </Link>
        </div>
        <div className="item">
          <Link to="/study">
            <div>
              <i className="material-icons large">compare</i>
            </div>
            <div>Bible Study</div>
          </Link>
        </div>
        <div className="item">
          <Link to="/tracts">
            <div>
              <i className="material-icons large">insert_drive_file</i>
            </div>
            <div>Tracts</div>
          </Link>
        </div>
      </div>
      <div />
    </div>
  );
};

export default Categories;
