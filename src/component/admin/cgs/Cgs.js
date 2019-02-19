import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

import { firebaseCgs } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";
import Chorus from "./Chorus";
import Modal from "../../utils/Modal";

class Cgs extends Component {
  state = {
    song: [],
    isLoading: true,
    isShowChorus: false
  };

  componentDidMount() {
    firebaseCgs
      .child(this.props.lang.lang || 'en')
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const song = firebaseLooper(snapshot);
        this.setState({
          song,
          isLoading: false
        });
      });
  }

  showChorus = () => {
    this.setState({ isShowChorus: true });
  };

  closeChorus = () => {
    this.setState({ isShowChorus: false });
  };

  render() {
    console.log(this.props.lang.lang)
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
              {!this.state.isLoading
                ? this.state.song.map(cgs => (
                    <tr key={cgs.id}>
                      <td>{cgs.number}</td>
                      <td>
                        <Link to={`/admin/cgs_edit/${cgs.id}`}>
                          {cgs.title}
                        </Link>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
        {this.state.isLoading ? <Spinner /> : ""}
        <Modal display={this.state.isShowChorus} close={this.closeChorus} >
        <Chorus />
        </Modal>
        {!this.state.isShowChorus ? 
        <button onClick={this.showChorus}>View Chorus</button>
        : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(Cgs);