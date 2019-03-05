import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      Apostolic Faith, West and Central Africa
      <div>1, Campground Road, Anthony Village Lagos</div>
      <div>
        <Link to="/signin">Visit Webmaster</Link>
      </div>
    </footer>
  );
};

export default Footer;
