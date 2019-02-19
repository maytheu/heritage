import React, { Component } from "react";
import {connect} from 'react-redux'

import { language } from "../../actions/settings";

class Settings extends Component {
  state = {
    langs: { en: "en", fr: "fr", yr: "yr", ef: "ef" },
    check: ""
  };
  isChecked = key => {
    this.setState({ check: key });
this.props.dispatch(language(key));
  };

  

  render() {
    let languageObject = Object.keys(this.state.langs).map(langKey => {
      return [...Array(this.state.langs[langKey])].map((_, index) => {
        return (
          <label key={langKey}>
            <input
              type="radio"
              checked={langKey === this.state.check}
              onChange={this.isChecked.bind(this, langKey)}
            />
            {langKey}
          </label>
        );
      });
    });

    return <div>{languageObject}</div>;
  }
}

export default connect()(Settings);
