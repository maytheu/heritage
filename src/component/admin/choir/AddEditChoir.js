import React, { Component } from "react";
import { Link } from "react-router-dom";
import Compress from "compress.js";

import InputField from "../../utils/InputField";
import {
  firebaseChoir,
  firebaseDB,
  firebaseHymn,
  firebase
} from "../../../firebase";
import { checkValidityInput } from "../../utils/checkValidity";
import { Spinner } from "../../utils/misc";
import "../../utils/InputField.css";

class AddEditChoir extends Component {
  state = {
    formData: {
      hymn: {
        elementType: "select",
        value: "",
        elementConfig: {
          type: "select",
          placeholder: "select one hymn",
          options: []
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
      image: {
        elementType: "image",
        value: [],
        valid: true
        // validation: {
        //   requirred: true
        // }
      }
    },
    hymnId: "",
    isPage: "",
    isValidForm: false,
    formSuccess: "",
    formError: false,
    isLoading: false,
    hymn: "",
    imageUrl: [],
    image: []
  };

  updateField = (data, id, type, hymn, imageUrl) => {
    const newFormData = { ...this.state.formData };
    for (let key in newFormData) {
      newFormData[key].value = data[key];
      newFormData[key].valid = true;
    }

    this.setState({
      formData: newFormData,
      hymnId: id,
      isPage: type,
      hymn,
      imageUrl
    });
  };

  componentDidMount() {
    const constHymnId = this.props.match.params.id;
    if (!constHymnId) {
      document.title = "Add New Piece";
      firebaseHymn
        .orderByChild("hymn")
        .once("value")
        .then(snapshot => {
          const hymnOption = [];
          snapshot.forEach(childSnapshot => {
            hymnOption.push({
              key: childSnapshot.key,
              value: childSnapshot.val().hymn
            });
          });
          const newFormData = { ...this.state.formData };
          newFormData.hymn.elementConfig.options = hymnOption;
          this.setState({ isPage: "Add New Piece", formData: newFormData });
        });
    } else {
      let url = [];
      const hymn = this.props.location.state.hymn;
      document.title = "Edit Piece";
      firebaseDB
        .ref(`choir/${hymn}/${constHymnId}`)
        .once("value")
        .then(snapshot => {
          const hymnData = snapshot.val();
          hymnData.image.forEach((image, i) => {
            firebase
              .storage()
              .ref()
              .child(`hymn/${hymnData.image[i]}`)
              .getDownloadURL()
              .then(urlParam => {
                url.push({ name: hymnData.image[i], url: urlParam });
                if (i === hymnData.image.length - 1) {
                  this.updateField(
                    hymnData,
                    constHymnId,
                    "Edit Piece",
                    hymn,
                    url
                  );
                }
              });
          });
        });
    }
  }

  //upload multiple images
  imageChangedHandler(event, content = "") {
    this.setState({ imageUrl: "" });
    const compress = new Compress();
    const updatedOrderForm = {
      ...this.state.formData
    };

    const img = [];
    const files = Array.from(event.target.files);
    compress
      .compress(files, {
        size: 2, // the max size in MB, defaults to 2MB
        quality: 0.25, // the quality of the image, max is 1,
        maxWidth: 400, // the max width of the output image, defaults to 1920px
        maxHeight: 300, // the max height of the output image, defaults to 1920px
        resize: true // defaults to true, set false if you do not want to resize the image width and height
      })
      .then(data => {
        // returns an array of compressed images
        data.forEach((item, i) => {
          const img1 = data[i];
          const name = img1.alt;
          const base64str = img1.data;
          const imgExt = img1.ext;
          const file = Compress.convertBase64ToFile(base64str, imgExt);
          img.push({ file, name });
          if (i === data.length - 1) {
            updatedOrderForm["image"].value = files;
            updatedOrderForm["image"].valid = true;
            this.setState({
              formData: updatedOrderForm,
              image: img
            });
          }
        });
      });
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
      let image = [];
      for (let key in submitData.image) {
        image.push(submitData.image[key].name);
      }
      if (
        this.state.isPage === "Edit Piece" &&
        this.state.imageUrl.length > 0
      ) {
        const choirDetails = {
          title: submitData.title,
          number: submitData.number
        };

        firebaseDB
          .ref(`choir/${this.state.hymn}/${this.state.hymnId}`)
          .update(choirDetails)
          .then(() => {
            this.setState({ formSuccess: "Success", isLoading: false });
          })
          .catch(e => {
            this.setState({ formError: true, isLoading: false });
          });
      } else {
        const choirDetails = {
          title: submitData.title,
          number: submitData.number,
          image
        };

        const storageRef = firebase.storage().ref();
        this.state.image.forEach((file, i) => {
          storageRef
            .child(`hymn/${file.name}`)
            .put(file.file)
            .then(() => {
              if (i === this.state.image.length - 1) {
                if (this.state.isPage === "Edit Piece") {
                  firebaseDB
                    .ref(`choir/${this.state.hymn}/${this.state.hymnId}`)
                    .update(choirDetails)
                    .then(() => {
                      this.setState({
                        formSuccess: "Success",
                        isLoading: false
                      });
                    })
                    .catch(e => {
                      this.setState({ formError: true, isLoading: false });
                    });
                } else {
                  firebaseChoir
                    .child(submitData.hymn)
                    .orderByChild("number")
                    .equalTo(submitData.number)
                    .once("value")
                    .then(snapshot => {
                      if (snapshot.val() === null) {
                        firebaseChoir.child(submitData.hymn).push(choirDetails);
                        this.setState({ isLoading: false });
                        this.props.history.push(
                          `/admin/hymn/hymn/${submitData.hymn}`
                        );
                      } else {
                        this.setState({ formError: true, isLoading: false });
                      }
                    })
                    .catch(e => {
                      this.setState({ formError: true, isLoading: false });
                    });
                }
              }
            })
            .catch(e => {
              this.setState({ formError: true, isLoading: false });
            });
        });
      }
    } else {
      this.setState({ formError: true, isLoading: false });
    }
  };

  render() {
    const hymn = this.state.formData.hymn;
    const number = this.state.formData.number;
    const title = this.state.formData.title;
    return (
      <div className="container">
        <h3>{this.state.isPage}</h3>
        <form onSubmit={event => this.submitForm(event)}>
          <div className="input">
            <label style={{ fontSize: "16px", marginRight: "8px" }}>
              Select Multiple Images to Upload
            </label>
            <input
              type="file"
              multiple
              onChange={this.imageChangedHandler.bind(this)}
              required={this.state.isPage === "Add New Piece" ? true : false}
            />
          </div>
          {this.state.isPage === "Add New Piece" ? (
            <InputField
              id={"hymn"}
              elementType={hymn.elementType}
              elementConfig={hymn.elementConfig}
              value={hymn.value}
              invalid={!hymn.valid}
              touched={hymn.touch}
              changed={element => this.valueChangedHandler(element)}
            />
          ) : (
            <div className="row">
              {this.state.imageUrl.length > 0
                ? this.state.imageUrl.map(img => (
                    <div className="col-md-6" key={img.url}>
                      <img src={img.url} alt={img.name} />
                    </div>
                  ))
                : ""}
            </div>
          )}
          <InputField
            id={"number"}
            elementType={number.elementType}
            elementConfig={number.elementConfig}
            value={number.value}
            invalid={!number.valid}
            touched={number.touch}
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
            <Link to={`/admin/hymn/hymn/${this.state.hymn}`}>View Update</Link>
          ) : null}
        </div>
      </div>
    );
  }
}

export default AddEditChoir;
