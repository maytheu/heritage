import React, { Component } from "react";
import { Link } from "react-router-dom";

import { firebaseStudy } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";

class Study extends Component {
  state = {
    study: [],
    isLoading: true
  };

  componentDidMount() {
    firebaseStudy
      .child("en")
      .orderByKey()
      .limitToLast(20)
      .once("value")
      .then(snapshot => {
        const study = firebaseLooper(snapshot);
        this.setState({
          study,
          isLoading: false
        });
      });
  }

  render() {
    return (
      <div className="container">
        <div>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Title</th>
                <th>Bible Verse</th>
              </tr>
            </thead>
            <tbody>
              {this.state.study
                ? this.state.study.map(outline => (
                    <tr key={outline.id}>
                      <td>{outline.classType}</td>
                      <td>
                        <Link to={`/admin/study_edit/${outline.id}`}>
                          {outline.title}
                        </Link>
                      </td>
                      <td>{outline.verse}</td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>

        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

export default Study;
