import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import InputField from "../../utils/InputField";
import { firebaseCgs, firebaseDB, firebaseChorus } from "../../../firebase";
import { checkValidityInput } from "../../utils/checkValidity";
import { Spinner } from "../../utils/misc";

class AddEditCgs extends Component {
  state = {
    cgsId: "",
    cgs: [],
    chorus: false,
    isPage: true,
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
      cgsId: id,
      isPage: type
    });
  };

  componentDidMount() {
    const songID = this.props.match.params.id;
    if (songID) {
      firebaseDB
        .ref(`cgs/${this.props.lang.lang}/${songID}`)
        .once("value")
        .then(snapshot => {
          const songData = snapshot.val();
          this.updateField(songData, songID, "Edit Cgs");
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
      if (this.state.isPage === "Edit Cgs") {
        let songDetails = {
          title: submitData.title,
          song: submitData.song
        };
        firebaseDB
          .ref(`cgs/${this.props.lang.lang}/${this.state.cgsId}`)
          .update(songDetails)
          .then(() => {
            this.setState({ formSuccess: "Success", isLoading: false });
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else if (this.state.isPage) {
        let songDetails = {
          title: submitData.title,
          number: submitData.number,
          song: submitData.song
        };
        firebaseCgs
          .child(submitData.language)
          .orderByChild("number")
          .equalTo(submitData.number)
          .once("value")
          .then(snapshot => {
            if (snapshot.val() === null) {
              firebaseCgs.child(submitData.language).push(songDetails);
              this.setState({ isLoading: false });
              this.props.history.push("/admin/cgs");
            } else {
              this.setState({ formError: true, isLoading: false });
            }
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else if (!this.state.isPage) {
        let songDetails = {
          title: submitData.title,
          number: submitData.number,
          song: submitData.song
        };
        firebaseChorus
          .child(submitData.language)
          .orderByChild("number")
          .equalTo(submitData.number)
          .once("value")
          .then(snapshot => {
            if (snapshot.val() === null) {
              firebaseChorus.child(submitData.language).push(songDetails);
              this.setState({ isLoading: false });
              this.props.history.push("/admin/cgs");
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

  showChorus = () => {
    this.setState(prevState => {
      return { isPage: !prevState.isPage };
    });
  };

  render() {
    const lang = this.state.formData.language;
    const title = this.state.formData.title;
    const number = this.state.formData.number;
    const song = this.state.formData.song;
    return (
      <div className="container">
        <h3>
          {this.state.cgsId === ""
            ? this.state.isPage
              ? "Add Cgs"
              : "Add Chorus"
            : this.state.isPage}
        </h3>
        <form onSubmit={event => this.submitForm(event)}>
          {this.state.isPage !== "Edit Cgs" ? (
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
              {this.state.cgsId === ""
                ? this.state.isPage
                  ? "Add Cgs"
                  : "Add Chorus"
                : this.state.isPage}
            </button>
          )}
        </form>

        <div>
          {this.state.formSuccess === "Success" ? (
            <Link to="/">Go to Home</Link>
          ) : null}
        </div>
        {this.state.cgsId === "" ? (
          <button style={{ flexGrow: "1" }} onClick={this.showChorus}>
            {this.state.isPage ? "Add Chorus" : "Add Cgs"}
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(AddEditCgs);
