import React, { Component } from "react";
import { connect } from "react-redux";

import { firebaseAdult } from "../../../firebase";
import { Spinner } from "../../utils/misc";

class Adult extends Component {
  state = {
    isLoading: true,
    title: "",
    number: "",
    notes: "",
    reference: "",
    memoryVerse: ""
  };

  componentDidMount() {
    const getLesson = (title, notes, number, reference, memoryVerse) => {
      this.setState({
        title,
        number,
        reference,
        notes,
        memoryVerse,
        isLoading: false
      });
    };
    const lessonID = this.props.match.params.id;
    firebaseAdult
      .child(this.props.lang.lang)
      .child(lessonID)
      .once("value", function(snapshot) {
        const title = snapshot.val().title;
        const number = snapshot.val().number;
        const reference = snapshot.val().reference;
        const notes = snapshot.val().notes;
        const memoryVerse = snapshot.val().memoryVerse;
        getLesson(title, notes, number, reference, memoryVerse);
      });
  }

  showLesson = () =>
    !this.state.isLoading ? (
      <div>
        <div>{this.state.number}</div>
        <div>{this.state.title}</div>
        <div>{this.state.reference}</div>
        <div>{this.state.memoryVerse}</div>
        <div>{this.state.notes}</div>
        <div />
      </div>
    ) : (
      <Spinner />
    );

  render() {
    return <div className="container">{this.showLesson()}</div>;
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Adult);
