import React, { Component } from "react";

import InputField from "../utils/InputField";
import { checkValidityInput } from "../utils/checkValidity";
import { firebase } from "../../firebase";

class SignIn extends Component {
  state = {
    formError: false,
    formSuccess: "",
    isValidForm: false,
    formData: {
      email: {
        elementType: "input",
        value: "",
        elementConfig: {
          type: "email",
          placeholder: "Enter your email"
        },
        validation: {
          requirred: true,
          email: true
        },
        valid: false,
        touch: false
      },
      password: {
        elementType: "input",
        value: "",
        elementConfig: {
          type: "password",
          placeholder: "Enter your password"
        },
        validation: {
          requirred: true,
          minLength: 6
        },
        valid: false,
        touch: false
      }
    }
  };

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
      firebase
        .auth()
        .signInWithEmailAndPassword(submitData.email, submitData.password)
        .then(() => {
            this.props.history.push('/admin/dashboard')
        })
        .catch(err => {
          this.setState({ formError: true });
        });
    } else {
      this.setState({ formError: true });
    
    }
  };

  render() {
    const email = this.state.formData.email;
    const password = this.state.formData.password;
    return (
      <div className="container">
        <form className="form" onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"email"}
            elementType={email.elementType}
            elementConfig={email.elementConfig}
            value={email.value}
            invalid={!email.valid}
            touched={email.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <InputField
            id={"password"}
            elementType={password.elementType}
            elementConfig={password.elementConfig}
            value={password.value}
            invalid={!password.valid}
            touched={password.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Open
          </button>
        </form>
      </div>
    );
  }
}



export default SignIn;
