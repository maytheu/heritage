import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import InputField from "../../utils/InputField";
import { Spinner } from "../../utils/misc";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaseStudy, firebaseDB } from "../../../firebase";

class AddEditStudy extends Component {
  state = {
    studyId: "",
    isPage: "",
    formSuccess: "",
    outline: [],
    formError: false,
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
      classType: {
        elementType: "select",
        value: "",
        elementConfig: {
          type: "select",
          placeholder: "select outline class",
          options: [
            { key: "adult", value: "Adult" },
            { key: "junior", value: "Junior" }
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
          placeholder: "Study Number"
        },
        value: "",
        validation: {
          required: true,
          minLength: 1,
          maxLength: 3,
          minRange: 1
        },
        valid: false,
        touch: false
      },

      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Outline Title"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      verse: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Bible verse"
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
      }
    }
  };

  updateField = (data, editorState, id, type) => {
    const newFormData = { ...this.state.formData };
    for (let key in newFormData) {
      newFormData[key].value = data[key];
      newFormData[key].valid = true;
    }

    this.setState({
      formData: newFormData,
      editorState,
      studyId: id,
      isPage: type
    });
  };

  componentDidMount() {
    document.title = "Add New Study Outline";
    const studyID = this.props.match.params.id;

    if (!studyID) {
      this.setState({
        isPage: "Add Outline"
      });
    } else {
      document.title='Ediit Study Outliine'
      firebaseDB
        .ref(`study/${this.props.lang.lang}/${studyID}`)
        .once("value")
        .then(snapshot => {
          const studyData = snapshot.val();
          const contentState = ContentState.createFromBlockArray(
            htmlToDraft(studyData.song).contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          this.updateField(studyData, editorState, studyID, "Edit Outline");
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
      const studyDetails = {
        title: submitData.title,
        classType: submitData.classType,
        number: submitData.number,
        memoryVerse: submitData.memoryVerse,
        verse: submitData.verse,
        lesson: convertedData
      };
      if (this.state.isPage === "Edit Outline") {
        firebaseDB
          .ref(`study/${this.props.lang.lang}/${this.state.studyId}`)
          .update(studyDetails)
          .then(() => {
            this.setState({ formSuccess: "Success", isLoading: false });
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else {
        firebaseStudy
          .child(submitData.language)
          .push(studyDetails)
          .then(() => {
            this.props.history.push("/admin/study");
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      }
    } else {
      this.setState({ formError: true, isLoading: false });
    }
  };

  render() {
    const lang = this.state.formData.language;
    const classType = this.state.formData.classType;
    const title = this.state.formData.title;
    const { editorState } = this.state;
    const verse = this.state.formData.verse;
    const memoryVerse = this.state.formData.memoryVerse;
    const number = this.state.formData.number;

    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          {this.state.isPage === "Add Outline" ? (
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
            id={"classType"}
            elementType={classType.elementType}
            elementConfig={classType.elementConfig}
            value={classType.value}
            invalid={!classType.valid}
            touched={classType.touch}
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
            id={"verse"}
            elementType={verse.elementType}
            elementConfig={verse.elementConfig}
            value={verse.value}
            invalid={!verse.valid}
            touched={verse.touch}
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
            <Link to="/admin/study">Go to Home</Link>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(AddEditStudy);
