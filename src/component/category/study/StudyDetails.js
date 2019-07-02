import React, { Component } from "react";
import { connect } from "react-redux";

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
    number: "",
    error: false
  };

  componentDidMount() {
    document.title = `AFM - Study`;
    const studyID = this.props.match.params.id;
    if (studyID) {
      firebaseStudy
        .child(this.props.lang.lang)
        .child(studyID)
        .once("value")
        .then(snapshot => {
          const outline = snapshot.val().lesson;
          const number = snapshot.val().number;
          const title = snapshot.val().title;
          const verse = snapshot.val().verse;
          const classType = snapshot.val().classType;
          const memoryVerse = snapshot.val().memoryVerse;
          this.setState({
            outline,
            verse,
            title,
            number,
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

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      firebaseStudy
        .child(this.props.lang.lang)
        .orderByChild("number")
        .equalTo(this.state.number)
        .once("value", snapshot => {
          snapshot.forEach(childSnapshot => {
            const outline = childSnapshot.val().lesson;
            const title = childSnapshot.val().title;
            const verse = childSnapshot.val().verse;
            const classType = childSnapshot.val().classType;
            const memoryVerse = childSnapshot.val().memoryVerse;
            this.setState({
              outline,
              verse,
              title,
              memoryVerse,
              classType,
              isLoading: false
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
        <div className="number">{this.state.classType}</div>
        <div className="title">{this.state.title}</div>
        <div className="">{this.state.verse}</div>
        <div className="">{this.state.memoryVerse}</div>
        <div className="">
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.outline
            }}
          />
        </div>
      </div>
    );
    return <div className="container">{content}</div>;
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(StudyDetails);
