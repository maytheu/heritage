import React, { Component } from "react";

import InputField from "../../utils/InputField";
import { firebaseHymn } from "../../../firebase";
import { checkValidityInput } from "../../utils/checkValidity";
import { Spinner } from "../../utils/misc";

class AddHymnal extends Component {
  state = {
    formData: {

      hymn: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Add Hymn"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      }
    },
    formError: false,
    isLoading: false
  };

  componentDidMount(){document.title = "Admin - Add Hymn";
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
    let submitData = this.state.formData.hymn.value;
    if (this.state.isValidForm) {
      firebaseHymn
        .push({hymn: submitData})
        .then(() => {
          this.setState({ isLoading: false });
          this.props.history.push("/admin/hymn");
        })
        .catch(e => {
          this.setState({ formError: true });
        });
    }
  };

  render() {
    const hymn = this.state.formData.hymn;
    return (
      <div className="container">
        <form onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"hymn"}
            elementType={hymn.elementType}
            elementConfig={hymn.elementConfig}
            value={hymn.value}
            invalid={!hymn.valid}
            touched={hymn.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          {this.state.formError ? <div>Error submitting form</div> : null}
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <button
              style={{ flexGrow: "1" }}
              disabled={!this.state.isValidForm}
            >
              Add Hymn
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default AddHymnal;
