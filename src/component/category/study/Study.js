import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { checkValidityInput } from "../../utils/checkValidity";
import InputField from "../../utils/InputField";
import { firebaseLooper, Spinner } from "../../utils/misc";
import { firebaseStudy } from "../../../firebase";

class Study extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      formData: {
        search: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Search for Bible Study Outline "
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touch: false
        }
      },
      study: [],
      isValidForm: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = "AFM - Study Outline";
    this.queryDatabase();
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      this.queryDatabase();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  queryDatabase = () => {
    firebaseStudy
      .child(this.props.lang.lang)
      .orderByKey()
      .limitToLast(20)
      .once("value")
      .then(snapshot => {
        let study = firebaseLooper(snapshot);
        this.setState({
          study,
          isLoading: false
        });
      });
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

  submitForm = (event, type) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const value = this.state.formData.search.value;
    if (this.state.isValidForm) {
      firebaseStudy
        .child(this.props.lang.lang)
        .orderByChild("lesson")
        .startAt(value)
        .endAt(value)
        .once("value")
        .then(snapshot => {
          let study = firebaseLooper(snapshot);
          console.log(snapshot);
          this.setState({
            study,
            isLoading: false
          });
        });
    }
  };

  showStudy = study =>
    study ? (
      study.map(outline => (
        <Link to={`study/${outline.id}`} key={outline.id}>
          <div className="chorus">
            <div>
              <b>{outline.classType}</b>
            </div>
            <div>{outline.title}</div>
            <div>{outline.verse}</div>
          </div>
        </Link>
      ))
    ) : (
      <div className="study">
        Outline cannnot be displayed at the moment, Please try again later
      </div>
    );

  render() {
    const outline = this.state.formData.search;
    return (
      <div className="container">
        <form className="form" onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"search"}
            elementType={outline.elementType}
            elementConfig={outline.elementConfig}
            value={outline.value}
            invalid={!outline.valid}
            touched={outline.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Search
          </button>
        </form>
        {this.showStudy(this.state.study)}
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Study);
