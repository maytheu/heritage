import "materialize-css/dist/css/materialize.min.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import InputField from "../../utils/InputField";
import { Spinner, firebaseLooper, thisWeek } from "../../utils/misc";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaseAdult, firebaseJunior, firebaseElem } from "../../../firebase";

class Sunday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        search: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Search for Lessons"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touch: false
        }
      },
      isValidForm: false,
      isLoading: true,
      adultLessons: [],
      juniorLessons: [],
      elemLessons: [],
      isSearchAdult: false,
      isSearchElem: false,
      isSearchJunior: false,
      searchElem: [],
      searchJunior: [],
      searchAdult: [],
      lessonID: "",
      elemID: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = `AFM - Lesson of the week`;
    let lessonID = thisWeek(9);
    let elemID = thisWeek(3);
    this.setState({ lessonID, elemID });
    this.queryDatabase();
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      this.queryDatabase();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  valueChangedHandler = element => {
    const updatedOrderForm = {
      ...this.state.formData
    };
    const updatedFormElement = {
      ...updatedOrderForm[element.id]
    };
    updatedFormElement.value = element.event.target.value;
    updatedFormElement.valid = checkValidityInput(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touch = true;
    updatedOrderForm[element.id] = updatedFormElement;

    let formValid = true;
    formValid = updatedOrderForm[element.id].valid && formValid;

    this.setState({ formData: updatedOrderForm, isValidForm: formValid });
  };

  queryDatabase = () => {
    firebaseAdult
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const adultLessons = firebaseLooper(snapshot);
        this.setState({
          adultLessons,
          isLoading: false
        });
      });

    firebaseJunior
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const juniorLessons = firebaseLooper(snapshot);
        this.setState({
          juniorLessons,
          isLoading: false
        });
      });

    firebaseElem
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const elemLessons = firebaseLooper(snapshot);
        this.setState({
          elemLessons,
          isLoading: false
        });
      });
  };

  submitForm = event => {
    this.setState({
      isLoading: true
    });
    event.preventDefault();
    const value = this.state.formData.search.value;

    if (this.state.adultLessons) {
      let searchAdult = this.state.adultLessons.filter(search => {
        return search.title.indexOf(value) !== -1;
      });
      if (searchAdult.length === 0) {
        this.setState({
          searchAdult: {
            id: "404",
            number: "The song numbber does not exist",
            title: "Try again with different Keyword"
          },
          isLoading: false
        });
      } else {
        this.setState({ searchAdult, isSearchAdult: true, isLoading: false });
      }
    } else if (this.state.juniorLessons) {
      let searchJunior = this.state.juniorLessons.filter(search => {
        return search.title.indexOf(value) !== -1;
      });
      if (searchJunior.length === 0) {
        this.setState({
          searchJunior: {
            id: "404",
            number: "The song numbber does not exist",
            title: "Try again with different Keyword"
          },
          isLoading: false
        });
      } else {
        this.setState({ searchJunior, isLoading: false, isSearchJunior: true });
      }
    } else if (this.state.elemLessons) {
      let searchElem = this.state.elemLessons.filter(search => {
        return search.title.indexOf(value) !== -1;
      });
      if (searchElem.length === 0) {
        this.setState({
          searchElem: {
            id: "404",
            number: "The song numbber does not exist",
            title: "Try again with different Keyword"
          },
          isLoading: false
        });
      } else {
        this.setState({ searchElem, isSearchElem: true, isLoading: false });
      }
    } else {
      this.setState({ error: "Unable to connect", isLoading: false });
    }
  };

  weekLesson = (lesson, lessonNumber) => {
    return lesson.filter(search => {
      return search.number.indexOf(lessonNumber) !== -1;
    });
  };

  showLessons = (lesson, lessonNumber, type = "") => {
    let week = this.weekLesson(lesson, lessonNumber);
    return (
      <div>
        <Link
          to={
            type !== ""
              ? `/lesson_${type}/${week[0].id}`
              : `/lesson/${week[0].id}`
          }
        >
          <div>{week[0].number}</div>
          <div>{week[0].title}</div>
        </Link>
        <div>{week[0].reference}</div>
        <div>{week[0].memoryVerse}</div>
      </div>
    );
  };

  showSearch = (lessons, type = "") =>
    lessons.map(lesson => (
      <div key={lesson.id}>
        <Link
          to={
            type !== ""
              ? `/lesson_${type}/${lesson.id}`
              : `/lesson/${lesson.id}`
          }
        >
          <div>{lesson.number}</div>
          <div>{lesson.title}</div>
        </Link>
        <div>{lesson.reference}</div>
        <div>{lesson.memoryVerse}</div>
      </div>
    ));

  render() {
    const lessons = this.state.formData.search;
    return (
      <div className="container">
        <form className="form" onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"search"}
            elementType={lessons.elementType}
            elementConfig={lessons.elementConfig}
            value={lessons.value}
            invalid={!lessons.valid}
            touched={lessons.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Search
          </button>
        </form>
        {this.state.isLoading ? <Spinner /> : ""}
        {this.state.adultLessons.length !== 0 &&
        this.state.elemLessons.length !== 0 &&
        this.state.juniorLessons.length !== 0 ? (
          <div>
            <div>Senior Lesson</div>
            {this.state.isSearchAdult
              ? this.showSearch(this.state.searchAdult)
              : this.showLessons(this.state.adultLessons, this.state.lessonID)}
            <div>Junior Lesson</div>
            {this.state.isSearchJunior
              ? this.showSearch(this.state.searchJunior, "junior")
              : this.showLessons(
                  this.state.juniorLessons,
                  this.state.lessonID,
                  "junior"
                )}
            <div>Elementary Lesson</div>
            {this.state.isSearchElem
              ? this.showSearch(this.state.searchElem, "elem")
              : this.showLessons(
                  this.state.elemLessons,
                  this.state.elemID,
                  "elem"
                )}
          </div>
        ) : (
          ""
        )}
        <div className="fixed-action-btn" style={{ bottom: "116px" }}>
          <Link
            to="/books"
            className="btn-floating btn-large "
            style={{ backgroundColor: "rgba(32, 87, 187, 0.59)" }}
          >
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Sunday);
