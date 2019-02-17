import React, { Component } from "react";
import { Link } from "react-router-dom";

import InputField from "../../utils/InputField";
import { Spinner, firebaseLooper } from "../../utils/misc";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaseAdult, firebaseJunior, firebaseElem } from "../../../firebase";

class Sunday extends Component {
  state = {
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
    adult: {
      id: "",
      title: "",
      memoryVerse: "",
      number: "",
      reference: ""
    },
    junior: {
      id: "",
      title: "",
      memoryVerse: "",
      number: "",
      reference: ""
    },
    elem: {
      id: "",
      title: "",
      memoryVerse: "",
      number: "",
      reference: ""
    },
    adultLessons: [],
    juniorLessons: [],
    elemLessons: [],
    isSearchAdult: false,
    isSearchElem: false,
    isSearchJunior: false,
    searchElem: [],
    searchJunior: [],
    searchAdult: []
  };

  componentDidMount() {
    // let lessonID = thisWeek(9);
    // let elemID = thisWeek(3);

    this.queryDatabase();

    firebaseAdult
      .child("en")
      .orderByChild("number")
      .equalTo("213")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(userSnapshot => {
          const title = userSnapshot.val().title;
          const number = userSnapshot.val().number;
          const reference = userSnapshot.val().reference;
          const memoryVerse = userSnapshot.val().memoryVerse;
          let id = userSnapshot.key;
          this.setState({
            adult: {
              title,
              memoryVerse,
              number,
              reference,
              id
            },
            isLoading: false
          });
        });
      })

      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });

    firebaseJunior
      .child("en")
      .orderByChild("number")
      .equalTo("27")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(userSnapshot => {
          const title = userSnapshot.val().title;
          const number = userSnapshot.val().number;
          const reference = userSnapshot.val().reference;
          const memoryVerse = userSnapshot.val().memoryVerse;
          let id = userSnapshot.key;
          this.setState({
            junior: {
              title,
              memoryVerse,
              number,
              reference,
              id
            },
            isLoading: false
          });
        });
      })

      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });

    firebaseElem
      .child("en")
      .orderByChild("number")
      .equalTo("1")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(userSnapshot => {
          const title = userSnapshot.val().title;
          const number = userSnapshot.val().number;
          const reference = userSnapshot.val().reference;
          const memoryVerse = userSnapshot.val().memoryVerse;
          let id = userSnapshot.key;
          this.setState({
            elem: {
              title,
              memoryVerse,
              number,
              reference,
              id
            },
            isLoading: false
          });
        });
      })

      .catch(e => {
        this.setState({ error: true, isLoading: false });
      });
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
      .child("en")
      .once("value")
      .then(snapshot => {
        const adultLessons = firebaseLooper(snapshot);
        this.setState({
          adultLessons,
          isLoading: false
        });
      });

    firebaseJunior
      .child("en")
      .once("value")
      .then(snapshot => {
        const juniorLessons = firebaseLooper(snapshot);
        this.setState({
          juniorLessons,
          isLoading: false
        });
      });

    firebaseElem
      .child("en")
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
      isLoading: true,
      adult: "",
      junior: "",
      elem: ""
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
    } else {
      this.setState({ error: "Unable to connect", isLoading: false });
    }

    if (this.state.juniorLessons) {
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
    } else {
      this.setState({ error: "Unable to connect", isLoading: false });
    }

    if (this.state.elemLessons) {
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

  showLessons = (lesson, type = "") => (
    <div>
      <Link
        to={
          type !== "" ? `/lesson_${type}/${lesson.id}` : `/lesson/${lesson.id}`
        }
      >
        <div>{lesson.number}</div>
        <div>{lesson.title}</div>
      </Link>
      <div>{lesson.reference}</div>
      <div>{lesson.memoryVerse}</div>
    </div>
  );

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
    console.log(this.state);
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
          <button sty1le={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Search
          </button>
        </form>
        {this.state.isLoading ? <Spinner /> : ""}
        <div>Senior Lesson</div>
        {this.state.isSearchAdult
          ? this.showSearch(this.state.searchAdult)
          : this.showLessons(this.state.adult)}
        <div>Junior Lesson</div>
        {this.state.isSearchJunior
          ? this.showSearch(this.state.searchJunior, "junior")
          : this.showLessons(this.state.junior, "junior")}
        <div>Elementary Lesson</div>
        {this.state.isSearchElem
          ? this.showSearch(this.state.searchElem, "elem")
          : this.showLessons(this.state.elem, "elem")}
        <Link to="/books" className="btn-floating btn-large red">
          <i className="material-icons">add</i>
        </Link>
      </div>
    );
  }
}

export default Sunday;
