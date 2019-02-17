import React, { Component } from "react";

import InputField from "../../utils/InputField";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaselocation, firebaseDB } from "../../../firebase";

class AddEditLocation extends Component {
  state = {
    formData: {
      region: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Region and District"
        },
        value: "",
        validation: {
          required: true,
          maxLength: 250
        },
        valid: false,
        touch: false
      },
      lga: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Local Government Area"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      address: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Church Address"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      telephone: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Pastor's number"
        },
        value: "",
        validation: {
          required: true,
          maxLength: 11
        },
        valid: false,
        touch: false
      },
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Pastor's Name"
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
    isPage: "",
    formError: false,
    locationId: "",
    formSuccess: ""
  };

  componentDidMount() {
    const locationID = this.props.match.params.address;
    if (!locationID) {
      this.setState({
        isPage: "Add Location"
      });
    } else {
      firebaseDB
        .ref(`location/${locationID}`)
        .once("value")
        .then(snapshot => {
          const locateData = snapshot.val();
          this.updateField(locateData, locationID, "Edit Location");
        });
    }
  }

  updateField = (data, id, type) => {
    const newFormData = { ...this.state.formData };
    for (let key in newFormData) {
      newFormData[key].value = data[key];
      newFormData[key].valid = true;
    }
    this.setState({
      formData: newFormData,
      locationId: id,
      isPage: type
    });
  };

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
    let submitData = {};
    let validForm = true;
    for (let key in this.state.formData) {
      submitData[key] = this.state.formData[key].value;
      validForm = this.state.formData[key].valid && validForm;
    }
    if (validForm) {
      if (this.state.isPage === "Edit Location") {
        firebaseDB
          .ref(`location/${this.state.locationId}`)
          .update(submitData)
          .then(() => {
            this.setState({
              formSuccess: "Update Successfully"
            })
            }).catch(e => {
              this.setState({ formError: true });
          })
      } else {
        firebaselocation
          .push(submitData)
          .then(() => {
            this.props.history.push("/admin/location");
          })
          .catch(e => {
            this.setState({ formError: true });
          });
      }
    } else {
      this.setState({ formError: true });
    }
  };

  render() {
    const region = this.state.formData.region;
    const lga = this.state.formData.lga;
    const address = this.state.formData.address;
    const telephone = this.state.formData.telephone;
    const name = this.state.formData.name;

    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"region"}
            elementType={region.elementType}
            elementConfig={region.elementConfig}
            value={region.value}
            invalid={!region.valid}
            touched={region.touch}
            changed={element => this.valueChangedHandler(element)}
          />

          <InputField
            id={"lga"}
            elementType={lga.elementType}
            elementConfig={lga.elementConfig}
            value={lga.value}
            invalid={!lga.valid}
            touched={lga.touch}
            changed={element => this.valueChangedHandler(element)}
          />

          <InputField
            id={"address"}
            elementType={address.elementType}
            elementConfig={address.elementConfig}
            value={address.value}
            invalid={!address.valid}
            touched={address.touch}
            changed={element => this.valueChangedHandler(element)}
          />

          <InputField
            id={"telephone"}
            elementType={telephone.elementType}
            elementConfig={telephone.elementConfig}
            value={telephone.value}
            invalid={!telephone.valid}
            touched={telephone.touch}
            changed={element => this.valueChangedHandler(element)}
          />

          <InputField
            id={"name"}
            elementType={name.elementType}
            elementConfig={name.elementConfig}
            value={name.value}
            invalid={!name.valid}
            touched={name.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <div>{this.state.formSuccess}</div>
          {this.state.formError ? <div>Error submitting form</div> : null}
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            {this.state.isPage}
          </button>
        </form>
      </div>
    );
  }
}

export default AddEditLocation;
