import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

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
    editorState: EditorState.createEmpty(),
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
      }
    }
  };

  updateField = (data,editorState, id, type) => {
    const newFormData = { ...this.state.formData };
    for (let key in newFormData) {
      newFormData[key].value = data[key];
      newFormData[key].valid = true;
    }

    this.setState({
      formData: newFormData,
      editorState,
      chorusId: id,
      isPage: type
    });
  };

  componentDidMount() {
    const chorusID = this.props.match.params.id;
    if (chorusID) {
      document.title = "Edit Chorus";
      firebaseDB
        .ref(`chorus/${this.props.lang.lang}/${chorusID}`)
        .once("value")
        .then(snapshot => {
          const songData = snapshot.val();
          const contentState = ContentState.createFromBlockArray(
            htmlToDraft(songData.song).contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          this.updateField(songData, editorState, chorusID, "Edit Chorus");
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

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
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
    let convertedData = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    if (validForm) {
      let songDetails = {
        title: submitData.title,
        song: convertedData
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
    const {title} = this.state.formData;
    const {number} = this.state.formData;
    const {editorState} = this.state
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
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editer-content"
            onBlur={() => this.setState({ valid: true })}
            onEditorStateChange={this.onEditorStateChange}
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
