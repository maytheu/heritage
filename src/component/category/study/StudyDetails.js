import React, { Component } from "react";

import { firebaseStudy } from "../../../firebase";
import { Spinner } from "../../utils/misc";

class StudyDetails extends Component {
  state = {
    outline: "",
    verse: "",
    title: "",
    classType: "",
    memoryVerse: "",
    isLoading: true,
    error: false
  };

  componentDidMount() {
    const studyID = this.props.match.params.id;
    if (studyID) {
      firebaseStudy
        .child("en")
        .child(studyID)
        .once("value")
        .then(snapshot => {
          const outline = snapshot.val().lesson;
          const title = snapshot.val().title;
          const verse = snapshot.val().verse;
          const classType = snapshot.val().classType;
          const memoryVerse = snapshot.val().memoryVerse;
          this.setState({
            outline,
            verse,
            title,
            memoryVerse,
            classType,
            isLoading: false
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
        <div className="number">{this.state.classType}</div>
        <div className="title">{this.state.title}</div>
        <div className="">{this.state.verse}</div>
        <div className="">{this.state.memoryVerse}</div>
        <div className="">{this.state.outline}</div>
      </div>
    );
    return <div className="container">{content}</div>;
  }
}

export default StudyDetails;
