import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { firebaseAdult, firebaseJunior } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";

class BookDetail extends Component {
  state = {
    isLoading: true,
    lessons: [],
    lessonJunior: [],
    error: false,
    junior: true
  };

  componentDidMount() {
    document.title = `AFM - Lessons`;
    const lessonID = this.props.match.params.id;
    this.queryDatabase(lessonID);
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      const lessonID = this.props.match.params.id;
      this.queryDatabase(lessonID);
    }
  }

  queryDatabase = lessonID => {
    firebaseAdult
      .child(this.props.lang.lang)
      .orderByChild("book")
      .equalTo(lessonID)
      .once("value")
      .then(snapshot => {
        const lessons = firebaseLooper(snapshot);
        this.setState({
          lessons,
          isLoading: false
        });
      })
      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });

    firebaseJunior
      .child(this.props.lang.lang)
      .orderByChild("book")
      .equalTo(lessonID)
      .once("value")
      .then(snapshot => {
        const lessonJunior = firebaseLooper(snapshot);
        this.setState({
          lessonJunior,
          isLoading: false
        });
      })
      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });
  };

  showLessons = (lessons, type = false) =>
    lessons
      ? lessons.map(lesson => (
          <div key={lesson.id}>
            <Link
              to={type ? `/lesson_junior/${lesson.id}` : `/lesson/${lesson.id}`}
            >
              <div>{lesson.number}</div>
              <div>{lesson.title}</div>
            </Link>
            <div>{lesson.reference}</div>
          </div>
        ))
      : "";

  render() {
    return (
      <div className="container">
        {this.state.isLoading ? <Spinner /> : ""}
        <div>Senior Lessons</div>
        {this.showLessons(this.state.lessons)}
        <div>junior Lessons</div>
        {this.showLessons(this.state.lessonJunior, this.state.junior)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(BookDetail);
