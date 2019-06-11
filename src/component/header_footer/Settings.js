import React, { Component } from "react";
import { connect } from "react-redux";

import { language } from "../../actions/settings";

class Settings extends Component {
  state = {
    langs: { en: "en", fr: "fr", yr: "yr", ef: "ef" }
  };

  isChecked = key => {
    this.props.dispatch(language(key));
  };

  render() {
    console.log(this.props.lang);
    let languageObject = Object.keys(this.state.langs).map(langKey => {
      return [...Array(this.state.langs[langKey])].map((_, index) => {
        return (
          <label key={langKey}>
            <input
              type="radio"
              checked={langKey === this.props.lang.lang}
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

function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(Settings);
