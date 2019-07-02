import React, { Component } from "react";
import { connect } from "react-redux";

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
    document.title = `AFM - Tract ${this.state.number}`;
    const tractID = this.props.match.params.id;
    if (tractID) {
      firebaseTract
        .child(this.props.lang.lang)
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

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      firebaseTract
        .child(this.props.lang.lang)
        .orderByChild("number")
        .equalTo(this.state.number)
        .once("value", snapshot => {
          snapshot.forEach(childSnapshot => {
            const tract = childSnapshot.val().notes;
            const title = childSnapshot.val().title;
            const number = childSnapshot.val().number;
            this.setState({
              tract,
              number,
              title,
              isLoading: false,
            });
          });
        })
        .catch(e => {
          this.setState({ isLoading: false, error: e });
        });
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

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(TractDetails);
