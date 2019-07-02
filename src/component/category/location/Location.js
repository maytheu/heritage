import React, { Component } from "react";

import { checkValidityInput } from "../../utils/checkValidity";
import InputField from "../../utils/InputField";
import { firebaselocation } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";

class Location extends Component {
  state = {
    formData: {
      search: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Search for Church Location Nearest to You"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      }
    },
    location: [],
    isValidForm: false,
    isLoading: false
  };

  componentDidMount() {
    document.title = "AFM - Address";
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

  submitForm = (event, type) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const value = this.state.formData.search.value;
    if (this.state.isValidForm) {
      firebaselocation
        .orderByChild("address")
        .equalTo(value)
        .once("value")
        .then(snapshot => {
          const location = firebaseLooper(snapshot);
          this.setState({
            location,
            isLoading: false
          });
        });
    }
  };

  render() {
    const location = this.state.formData.search;
    return (
      <div className="container">
        <form className="form" onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"search"}
            elementType={location.elementType}
            elementConfig={location.elementConfig}
            value={location.value}
            invalid={!location.valid}
            touched={location.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Search
          </button>
        </form>
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.location && this.state.location.length > 0 ? (
          this.state.location.map(locate => (
            <div key={locate.id}>
              <div>{locate.region}</div>
              {locate.address}
            </div>
          ))
        ) : (
          <div>Try other keyword and uppercase</div>
        )}
      </div>
    );
  }
}

export default Location;
