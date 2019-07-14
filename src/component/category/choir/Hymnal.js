import React, { Component } from "react";
import { Link } from "react-router-dom";

import { firebaseHymn } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";

class Hymnal extends Component {
  state = {
    isLoading: true,
    hymnal: []
  };

  componentDidMount() {
    document.title = "AFM - Hymnal";
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
                  <Link to={`/hymn/${hymn.id}`}>{hymn.hymn}</Link>
                </div>
              ))
            : ""}
        </div>
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

export default Hymnal;
