import React, { Component } from "react";

import { firebaseTract } from "../../../firebase";
import { Spinner } from "../../utils/misc";

class TractDetails extends Component {
  state = {
    tractId: "",
    tract: "",
    number: "",
    title: "",
    isLoading: true,
    error: false
  };

  componentDidMount() {
    const tractID = this.props.match.params.id;
    if (tractID) {
      firebaseTract
        .child("en")
        .child(tractID)
        .once("value")
        .then(snapshot => {
          const tract = snapshot.val().notes;
          const title = snapshot.val().title;
          const number = snapshot.val().number;
          this.setState({
            tract,
            number,
            title,
            isLoading: false,
            tractId: tractID
          });
        })
        .catch(e => {
          this.setState({ isLoading: false, error: e });
        });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    let content = this.state.isLoading ? (
      <Spinner />
    ) : this.state.error ? (
      <div>Error Occur</div>
    ) : (
      <div>
        <div className="title">
          <div className="number">{this.state.number}.</div>
          {this.state.title}
        </div>
        <div className="">{this.state.tract}</div>
      </div>
    );
    return <div className="container">{content}</div>;
  }
}

export default TractDetails;
