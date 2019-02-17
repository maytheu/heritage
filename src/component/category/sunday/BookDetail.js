import React, { Component } from "react";
import { Link } from "react-router-dom";

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
    const lessonID = this.props.match.params.id;
    firebaseAdult
      .child("en")
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
      .child("en")
      .orderByChild("book")
      .equalTo(lessonID)
      .once("value")
      .then(snapshot => {
        const lessonJunior = firebaseLooper(snapshot);
        this.setState({
          lessonJunior,
          isLoading: false,
        });
      })
      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });
  }

  showLessons = (lessons, type = false) =>
    lessons
      ? lessons.map(lesson => (
          <div key={lesson.id}>
            <Link
              to={
                type 
                  ? `/lesson_junior/${lesson.id}`
                  : `/lesson/${lesson.id}`
              }
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

export default BookDetail;
