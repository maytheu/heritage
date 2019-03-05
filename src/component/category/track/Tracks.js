import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import InputField from "../../utils/InputField";
import { Spinner, firebaseLooper } from "../../utils/misc";
import { firebaseTract } from "../../../firebase";

class Tracks extends Component {
  state = {
    formData: {
      search: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Search for Tract"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      }
    },
    tract: [],
    isValidForm: false,
    isLoading: true
  };

  componentDidMount() {
    firebaseTract
      .child(this.props.lang.lang)
      .orderByKey()
      .limitToLast(20)
      .once("value")
      .then(snapshot => {
        let tract = firebaseLooper(snapshot);
        this.setState({
          tract,
          isLoading: false
        });
      });
  }

  showTract = tract =>
    tract ? (
      tract.map(outline => (
        <Link to={`tract/${outline.id}`} key={outline.id}>
          <div className="chorus">
            <div>{outline.title}</div>
          </div>
        </Link>
      ))
    ) : (
      <div className="tract">
        Outline cannnot be displayed at the moment, Please try again later
      </div>
    );

  render() {
    const notes = this.state.formData.search;
    return (
      <div className="container">
        <form className="form" onSubmit={event => this.submitForm(event)}>
          <InputField
            id={"search"}
            elementType={notes.elementType}
            elementConfig={notes.elementConfig}
            value={notes.value}
            invalid={!notes.valid}
            touched={notes.touch}
            changed={element => this.valueChangedHandler(element)}
          />
          <button style={{ flexGrow: "1" }} disabled={!this.state.isValidForm}>
            Search
          </button>
        </form>
        {this.showTract(this.state.tract)}
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(Tracks);
