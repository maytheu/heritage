import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { firebaseDB, firebaseElem } from "../../../firebase";
import { checkValidityInput } from "../../utils/checkValidity";
import { Spinner } from "../../utils/misc";
import InputField from "../../utils/InputField";

class AddEditElem extends Component {
  state = {
    lessonId: "",
    isPage: "",
    formSuccess: "",
    formError: false,
    isLoading: false,
    formData: {
      language: {
        elementType: "select",
        value: "",
        elementConfig: {
          type: "select",
          placeholder: "select one language",
          options: [
            { key: "en", value: "en" },
            { key: "fr", value: "fr" },
            { key: "yr", value: "yr" },
            { key: "ef", value: "ef" }
          ]
        },
        validation: {
          requirred: true
        },
        valid: false
      },
      book: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Book Number"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          maxLength: 1,
          minRange: 1,
          MaxRange: 3
        },
        valid: false,
        touch: false
      },
      number: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Lesson Number"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          maxLength: 3,
          minRange: 1,
          MaxRange: 200
        },
        valid: false,
        touch: false
      },
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Lesson Title"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      memoryVerse: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Memory Verse"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      reference: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Bible Reference"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      notes: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Notes"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      }
    }
  };

  updateField = (data, id, type) => {
    const newFormData = { ...this.state.formData };
    for (let key in newFormData) {
      newFormData[key].value = data[key];
      newFormData[key].valid = true;
    }

    this.setState({
      formData: newFormData,
      lessonId: id,
      isPage: type
    });
  };

  componentDidMount() {
    const lessonID = this.props.match.params.id;
    if (!lessonID) {
      this.setState({
        isPage: "Add Elementary Lesson"
      });
    } else {
      firebaseDB
        .ref(`elem/${this.props.lang.lang}/${lessonID}`)
        .once("value")
        .then(snapshot => {
          const lessonData = snapshot.val();
          this.updateField(lessonData, lessonID, "Edit Elementary Lesson");
        });
    }
  }

  valueChangedHandler = (element, content = "") => {
    const updatedOrderForm = {
      ...this.state.formData
    };
    const updatedFormElement = {
      ...updatedOrderForm[element.id]
    };
    let formValid = true;
    if (content === "") {
      updatedFormElement.value = element.event.target.value;
    } else {
      updatedFormElement.value = content;
      formValid = updatedOrderForm.valid && formValid;
    }

    updatedFormElement.valid = checkValidityInput(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touch = true;
    updatedOrderForm[element.id] = updatedFormElement;

    for (let eachInput in updatedOrderForm) {
      formValid = updatedOrderForm[eachInput].valid && formValid;
    }
    this.setState({ formData: updatedOrderForm, isValidForm: formValid });
  };

  submitForm = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    let validForm = true;
    for (let key in this.state.formData) {
      submitData[key] = this.state.formData[key].value;
      validForm = this.state.formData[key].valid && validForm;
    }

    if (validForm) {
      if (this.state.isPage === "Edit Elementary Lesson") {
        let lessonDetails = {
          title: submitData.title,
          memoryVerse: submitData.memoryVerse,
          reference: submitData.reference,
          notes: submitData.notes,
          book: submitData.book
        };
        firebaseDB
          .ref(`elem/${this.props.lang.lang}/${this.state.lessonId}`)
          .update(lessonDetails)
          .then(() => {
            this.setState({ formSuccess: "Success", isLoading: false });
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else {
        let lessonDetails = {
          title: submitData.title,
          number: submitData.number,
          memoryVerse: submitData.memoryVerse,
          reference: submitData.reference,
          notes: submitData.notes,
          book: submitData.book
        };

        firebaseElem
          .child(submitData.language)
          .orderByChild("number")
          .equalTo(submitData.number)
          .once("value")
          .then(snapshot => {
            if (snapshot.val() === null) {
              firebaseElem.child(submitData.language).push(lessonDetails);
              this.setState({ isLoading: false });
              this.props.history.push("/admin/lessons");
            } else {
              this.setState({ formError: true, isLoading: false });
            }
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      }
    }
  };

  render() {
    const lang = this.state.formData.language;
    const title = this.state.formData.title;
    const number = this.state.formData.number;
    const book = this.state.formData.book;
    const memoryVerse = this.state.formData.memoryVerse;
    const reference = this.state.formData.reference;
    const notes = this.state.formData.notes;
    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          {this.state.lessonId === "" ? (
            <div>
              <InputField
                id={"language"}
                elementType={lang.elementType}
                elementConfig={lang.elementConfig}
                value={lang.value}
                invalid={!lang.valid}
                touched={lang.touch}
                changed={element => this.valueChangedHandler(element)}
              />

              <InputField
                id={"number"}
                elementType={number.elementType}
                elementConfig={number.elementConfig}
                value={number.value}
                invalid={!number.valid}
                touched={number.touch}
                changed={element => this.valueChangedHandler(element)}
              />
            </div>
          ) : null}
          <InputField
            id={"book"}
            elementType={book.elementType}
            elementConfig={book.elementConfig}
            value={book.value}
            invalid={!book.valid}
            touched={book.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <InputField
            id={"title"}
            elementType={title.elementType}
            elementConfig={title.elementConfig}
            value={title.value}
            invalid={!title.valid}
            touched={title.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <InputField
            id={"reference"}
            elementType={reference.elementType}
            elementConfig={reference.elementConfig}
            value={reference.value}
            invalid={!reference.valid}
            touched={reference.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <InputField
            id={"memoryVerse"}
            elementType={memoryVerse.elementType}
            elementConfig={memoryVerse.elementConfig}
            value={memoryVerse.value}
            invalid={!memoryVerse.valid}
            touched={memoryVerse.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <InputField
            id={"notes"}
            elementType={notes.elementType}
            elementConfig={notes.elementConfig}
            value={notes.value}
            invalid={!notes.valid}
            touched={notes.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <div>{this.state.formSuccess}</div>
          {this.state.formError ? <div>Error submitting form</div> : null}
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <button
              style={{ flexGrow: "1" }}
              disabled={!this.state.isValidForm}
            >
              {this.state.isPage}
            </button>
          )}
        </form>
        <div>
          {this.state.formSuccess === "Success" ? (
            <Link to="/admin/lessons">Go to Home</Link>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(AddEditElem);
