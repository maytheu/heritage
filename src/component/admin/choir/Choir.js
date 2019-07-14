import React, { Component } from "react";
import { Link } from "react-router-dom";

import { firebaseHymn } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";

class Choir extends Component {
  state = {
    isLoading: true,
    hymnal: []
  };
  componentDidMount() {
    document.title = "Admin - Hymnal";
    firebaseHymn
      .orderByChild("hymn")
      .once("value")
      .then(snapshot => {
        const hymnal = firebaseLooper(snapshot);
        this.setState({
          hymnal,
          isLoading: false
        });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.hymnal
            ? this.state.hymnal.map(hymn => (
                <div
                  className="col-md-4"
                  key={hymn.id}
                  style={{ margin: "16px" }}
                >
                  <Link to={`/admin/hymn/hymn/${hymn.id}`}>{hymn.hymn}</Link>
                </div>
              ))
            : ""}
        </div>
        {this.state.isLoading ? <Spinner /> : ""}
        <div style={{margin: '16px'}}>
          <Link to="/admin/hymn/add_hymn">Add New Hymn</Link>
        </div>
      </div>
    );
  }
}

export default Choir;
