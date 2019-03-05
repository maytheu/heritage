import React, { Component } from "react";
import { Link } from "react-router-dom";
import {connect} from 'react-redux'

import InputField from "../../utils/InputField";
import { firebaseDB } from "../../../firebase";
import { Spinner } from "../../utils/misc";
import { checkValidityInput } from "../../utils/checkValidity";

class EditChorus extends Component {
  state = {
    chorusId: "",
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
          placeholder: "Song Number"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          maxLength: 3,
          minRange: 1,
          MaxRange: 700
        },
        valid: false,
        touch: false
      },
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Song Title"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      song: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Song Details"
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
      chorusId: id,
      isPage: type
    });
  };

  componentDidMount() {
    const chorusID = this.props.match.params.id;
    if (chorusID) {
      firebaseDB
        .ref(`chorus/${this.props.lang.lang}/${chorusID}`)
        .once("value")
        .then(snapshot => {
          const songData = snapshot.val();
          this.updateField(songData, chorusID, "Edit Chorus");
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
      let songDetails = {
        title: submitData.title,
        song: submitData.song
      };
      firebaseDB
        .ref(`chorus/en/${this.state.chorusId}`)
        .update(songDetails)
        .then(() => {
          this.setState({ formSuccess: "Success", isLoading: false });
        })
        .catch(e => {
          this.setState({ formError: true, isLoading: false });
        });
    }
  };

  render() {
    const lang = this.state.formData.language;
    const title = this.state.formData.title;
    const number = this.state.formData.number;
    const song = this.state.formData.song;
    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          {this.state.chorusId === "" ? (
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
            id={"song"}
            elementType={song.elementType}
            elementConfig={song.elementConfig}
            value={song.value}
            invalid={!song.valid}
            touched={song.touch}
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
            <Link to="/admin/cgs">Go to Home</Link>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(EditChorus);
