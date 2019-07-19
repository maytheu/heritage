import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Cgs.css";
import InputField from "../../utils/InputField";
import { checkValidityInput } from "../../utils/checkValidity";
import { firebaseChorus, firebaseCgs } from "../../../firebase";
import { firebaseLooper, Spinner } from "../../utils/misc";

class Cgs extends Component {
  constructor() {
    super();
    this._isMounted = false;

    this.state = {
      formData: {
        cgs: {
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
        chorus: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Search Chorus"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touch: false
        },
        search: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "Search song"
          },
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touch: false
        }
      },
      chorusSong: [],
      cgsSong: [],
      error: "",
      isValidForm: false,
      isLoading: true,
      searchFilter: [],
      isCgs: false,
      result: ""
    };
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = "AFM - CGS";
    firebaseChorus
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const chorusSong = firebaseLooper(snapshot);
        this.setState({
          chorusSong,
          isLoading: false
        });
      });

    firebaseCgs
      .child(this.props.lang.lang)
      .once("value")
      .then(snapshot => {
        const cgsSong = firebaseLooper(snapshot);
        this.setState({
          cgsSong,
          isLoading: false
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      firebaseChorus
        .child(this.props.lang.lang)
        .once("value")
        .then(snapshot => {
          const chorusSong = firebaseLooper(snapshot);
          this.setState({
            chorusSong,
            isLoading: false
          });
        });

      firebaseCgs
        .child(this.props.lang.lang)
        .once("value")
        .then(snapshot => {
          const cgsSong = firebaseLooper(snapshot);
          this.setState({
            cgsSong,
            isLoading: false
          });
        });
    }
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
    const value = this.state.formData.cgs.value;
    const searchvalue = this.state.formData.chorus.value;
    const cgsSearch = this.state.formData.search.value;
    if (this.state.isValidForm && type === "cgs") {
      firebaseCgs
        .child(this.props.lang.lang)
        .orderByChild("number")
        .equalTo(value)
        .once("value")
        .then(snapshot => {
          snapshot.forEach(userSnapshot => {
            let key = userSnapshot.key;
            this.props.history.push(`song/${key}`);
          });
        })
        .catch(e => {
          this.setState({ formError: true, isLoading: false });
        });
    }
    if (this.state.isValidForm && type === "searchChorus") {
      if (this.state.chorusSong) {
        let searchFilter = this.state.chorusSong.filter(search => {
          return search.song.indexOf(searchvalue) !== -1;
        });
        if (searchFilter.length === 0) {
          this.setState({
            searchFilter: [
              {
                id: "404",
                number: "The song numbber does not exist",
                title: "Try again with different Keyword"
              }
            ]
          });
        } else {
          this.setState({ searchFilter, result: "Search result From Chorus" });
        }
      } else {
        this.setState({ error: "Unable to connect" });
      }
    }
    if (this.state.isValidForm && type === "searchCgs") {
      if (this.state.cgsSong) {
        let searchFilter = this.state.cgsSong.filter(search => {
          return search.song.indexOf(cgsSearch) !== -1;
        });
        if (searchFilter.length === 0) {
          this.setState({
            searchFilter: [
              {
                id: "404",
                number: "The song numbber does not exist",
                title: "Try again with different Keyword"
              }
            ]
          });
        } else {
          this.setState({
            searchFilter,
            isCgs: true,
            result: "Search result From Cgs"
          });
        }
      } else {
        this.setState({ error: "Cannnot find Keyword" });
      }
    }
  };

  showChorus = chorus =>
    chorus ? (
      chorus.map(songChorus => (
        <Link
          to={
            this.state.isCgs
              ? `song/${songChorus.id}`
              : `chorus/${songChorus.id}`
          }
          key={songChorus.id}
        >
          <div className="chorus">
            <div>Song No: {songChorus.number}</div>
            <div> Title: {songChorus.title}</div>
          </div>
        </Link>
      ))
    ) : (
      <div className="chorus">
        Song cannnot be displayed at the moment, Please try again later
      </div>
    );

  render() {
    const cgs = this.state.formData.cgs;
    const chorus = this.state.formData.chorus;
    const search = this.state.formData.search;
    return (
      <div className="container">
        <form
          className="form"
          onSubmit={event => this.submitForm(event, "cgs")}
        >
          <InputField
            id={"cgs"}
            elementType={cgs.elementType}
            elementConfig={cgs.elementConfig}
            value={cgs.value}
            invalid={!cgs.valid}
            touched={cgs.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!cgs.valid}>
            Open
          </button>
        </form>
        <form
          className="form"
          onSubmit={event => this.submitForm(event, "searchChorus")}
        >
          <InputField
            id={"chorus"}
            elementType={chorus.elementType}
            elementConfig={chorus.elementConfig}
            value={chorus.value}
            invalid={!chorus.valid}
            touched={chorus.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!chorus.valid}>
            Open
          </button>
        </form>
        <form
          className="form"
          onSubmit={event => this.submitForm(event, "searchCgs")}
        >
          <InputField
            id={"search"}
            elementType={search.elementType}
            elementConfig={search.elementConfig}
            value={search.value}
            invalid={!search.valid}
            touched={search.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!search.valid}>
            Open
          </button>
        </form>
        <div>{this.state.result !== "" ? this.state.result : null}</div>
        {this.showChorus(
          this.state.searchFilter.length !== 0
            ? this.state.searchFilter
            : this.state.chorusSong
        )}
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Cgs);
