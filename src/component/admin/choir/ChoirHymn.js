import React, { Component } from "react";
import { Link } from "react-router-dom";

import { firebaseChoir } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";

class ChoirHymn extends Component {
  state = { isLoading: true, hymnal: [], hymn: "" };
  componentDidMount() {
    document.title = "Admin - Hymns";
    const hymn = this.props.match.params.hymn;
    firebaseChoir
      .child(hymn)
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const hymnal = firebaseLooper(snapshot);
        this.setState({
          hymnal,
          hymn,
          isLoading: false
        });
      });
  }
  render() {
    return (
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {!this.state.isLoading
              ? this.state.hymnal.map(hymn => (
                  <tr key={hymn.id}>
                    <td>{hymn.number}</td>
                    <td>
                      <Link
                        to={{
                          pathname: `/admin/hymn/edit/${hymn.id}`,
                          state: { hymn: this.state.hymn }
                        }}
                      >
                        {hymn.title}
                      </Link>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        {this.state.isLoading ? <Spinner /> : ""}
        <div style={{ margin: "16px" }}>
          <Link to="/admin/hymn/add">Add New Piece</Link>
        </div>
      </div>
    );
  }
}

export default ChoirHymn;
