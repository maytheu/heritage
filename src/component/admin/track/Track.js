import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { firebaseTract } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";

class Track extends Component {
  state = {
    tract: [],
    isLoading: true
  };

  componentDidMount() {
    firebaseTract
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const tract = firebaseLooper(snapshot);
        this.setState({
          tract,
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
                <th>Number</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tract
                ? this.state.tract.map(outline => (
                    <tr key={outline.id}>
                      <td>{outline.number}</td>
                      <td>
                        <Link to={`/admin/track_edit/${outline.id}`}>
                          {outline.title}
                        </Link>
                      </td>
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

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Track);
