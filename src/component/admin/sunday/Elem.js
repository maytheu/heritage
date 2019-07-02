import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { firebaseElem } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";

class Elem extends Component {
  state = {
    lessons: [],
    isLoading: true,
    error: false
  };

  componentDidMount() {
    firebaseElem
      .child(this.props.lang.lang)
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
  }

  render() {
    return (
      <div className="container" style={{ minHeight: "33vh" }}>
        <div>
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Lesson Number</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {this.state.lessons
                ? this.state.lessons.map(lesson => (
                    <tr key={lesson.id}>
                      <td>{lesson.book}</td>
                      <td>
                        <Link to={`/admin/lessons/edit_elem/${lesson.id}`}>
                          {lesson.number}
                        </Link>
                      </td>
                      <td>{lesson.title}</td>
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
export default connect(mapStateToProps)(Elem);
