import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import InputField from "../../utils/InputField";
import { Spinner } from "../../utils/misc";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaseTract, firebaseDB } from "../../../firebase";

class AddEditTrack extends Component {
  state = {
    tractId: "",
    tract: [],
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
      number: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Tract Number"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          maxLength: 3,
          minRange: 1,
          MaxRange: 100
        },
        valid: false,
        touch: false
      },
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Tract Title"
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
          placeholder: "Tract Details"
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
      tractId: id,
      isPage: type
    });
  };

  componentDidMount() {
    const tractID = this.props.match.params.id;
    if (!tractID) {
      this.setState({
        isPage: "Add Tract"
      });
    } else {
      firebaseDB
        .ref(`tract/${this.props.lang.lang}/${tractID}`)
        .once("value")
        .then(snapshot => {
          const tractData = snapshot.val();
          this.updateField(tractData, tractID, "Edit Tract");
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
      if (this.state.isPage === "Edit Tract") {
        let noteDetails = {
          title: submitData.title,
          notes: submitData.notes
        };
        firebaseDB
          .ref(`tract/${this.props.lang.lang}/${this.state.tractId}`)
          .update(noteDetails)
          .then(() => {
            this.setState({ formSuccess: "Success", isLoading: false });
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else {
        let noteDetails = {
          title: submitData.title,
          number: submitData.number,
          notes: submitData.notes
        };
        firebaseTract
          .child(submitData.language)
          .orderByChild("number")
          .equalTo(submitData.number)
          .once("value")
          .then(snapshot => {
            if (snapshot.val() === null) {
              firebaseTract.child(submitData.language).push(noteDetails);
              this.setState({ isLoading: false });
              this.props.history.push("/admin/track");
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
    const notes = this.state.formData.notes;
    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          {this.state.isPage === "Add Tract" ? (
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
            id={"title"}
            elementType={title.elementType}
            elementConfig={title.elementConfig}
            value={title.value}
            invalid={!title.valid}
            touched={title.touch}
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
            <Link to="/">Go to Home</Link>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(AddEditTrack);
