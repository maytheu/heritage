import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import { firebaseAdult } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";
import Modal from "../../utils/Modal";
import Junior from "./Junior";
import Elem from "./Elem";

class Sunday extends Component {
  state = {
    lessons: [],
    isLoading: true,
    error: false,
    isShowJunior: false,
    isShowElem: false
  };

  componentDidMount() {
    document.title = "Sunday School Lessons";
    this.queryDatabase();
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      this.queryDatabase();
    }
  }

  queryDatabase = () => {
    firebaseAdult
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
  };
  showJunior = () => {
    this.setState({ isShowJunior: true });
  };

  showElem = () => {
    this.setState({ isShowElem: true });
  };

  closeModal = () => {
    this.setState({ isShowJunior: false, isShowElem: false });
  };

  render() {
    return (
      <div className="container">
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
                        <Link to={`/admin/lesson_edit/${lesson.id}`}>
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
        <Modal
          display={this.state.isShowJunior || this.state.isShowElem}
          close={this.closeModal}
          header={
            this.state.isShowJunior ? "Junior Lessons" : "Elementary Lessons"
          }
          link={
            this.state.isShowJunior
              ? "/admin/lessons/edit_junior"
              : "/admin/lessons/edit_elem"
          }
          footer={"Add New Lessons"}
        >
          {this.state.isShowJunior ? <Junior /> : <Elem />}
        </Modal>
        <div>
          {!this.state.isShowJunior && !this.state.isShowElem ? (
            <Row>
              <Col sm="5">
                <button onClick={this.showJunior}>View Junior Lesson</button>
              </Col>
              <Col sm="2" />
              <Col sm="5">
                <button onClick={this.showElem}>View Elementary Lesson</button>
              </Col>
            </Row>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Sunday);
