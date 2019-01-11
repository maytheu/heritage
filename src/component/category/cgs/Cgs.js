import React, { Component } from "react";

import './Cgs.css'
import InputField from "../../utils/InputField";

class Cgs extends Component {
  state = {
    formData: {
      cgs: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "Song Number"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      chorus: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Searchh Chorus"
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
          placeholder: "Search for song"
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
    chorusSong: {
      en: {
        1:{
          number: 1,
        title: "Praise Him",
        song: "Verse 1 Hail the power of Jesus name",
        },
        2:{
          number: 2,
        title: "Hallelujah",
        song: "Verse 1 Hallelujah, Amen"
        },
        3:{
          number: 2,
        title: "Amen Glory to God in the highest",
        song: "Verse 1 Hallelujah, Amen"
        }
      },
      yr: {},
      es: {},
      fr: {}
    }
  };

  songDetailHandler = () => {
    this.props.history.push('/song')
  }

  render() {
    const cgs = this.state.formData.cgs;
    const chorus = this.state.formData.chorus;
    const search = this.state.formData.search;

    const songChorusArray = [];
    for (let song in this.state.chorusSong.en) {
      songChorusArray.push({
        id: song,
        songNumber: this.state.chorusSong.en[song]
      });
    }

    return (
      <div className="container">
        <form className="form">
          <InputField
            elementType={cgs.elementType}
            elementConfig={cgs.elementConfig}
            value={cgs.value}
            invalid={!cgs.valid}
            touched={cgs.touch}
          />
          <button style={{ flexGrow: "1" }}>Open</button>
        </form>
        <form className="form">
          <InputField
            elementType={chorus.elementType}
            elementConfig={chorus.elementConfig}
            value={chorus.value}
            invalid={!chorus.valid}
            touched={chorus.touch}
          />
          <button style={{ flexGrow: "1" }}>Open</button>
        </form>
        <form className="form">
          <InputField
            elementType={search.elementType}
            elementConfig={search.elementConfig}
            value={search.value}
            invalid={!search.valid}
            touched={search.touch}
          />
          <button style={{ flexGrow: "1" }}>Open</button>
        </form>
        {songChorusArray.map(songChorus => (
          <div key={songChorus.id} className='chorus' onClick={this.songDetailHandler}>
          <div>Song No: {songChorus.id}</div>
          <div>Chorus Title: {songChorus.songNumber.title}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default Cgs;
