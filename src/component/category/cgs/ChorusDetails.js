import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";

import { firebaseChorus } from "../../../firebase";
import { Spinner } from "../../utils/misc";

class ChorusDetails extends Component {
  state = {
    songId: "",
    title: "",
    song: "",
    isLoading: true
  };

  componentDidMount() {
    document.title = `AFM - ${this.state.title}`;
    const getData = (id, title, song) => {
      this.setState({
        isLoading: false,
        title,
        song,
        songId: id
      });
    };
    const songID = this.props.match.params.id;
    if (songID === "404") {
      this.props.history.push("/cgs");
    } else {
      //correct id
      let number = "";
      let song = "";
      let title = null;
      firebaseChorus
        .child(this.props.lang.lang)
        .child(songID)
        .once("value", function(snapshot) {
          let response = snapshot.val();
          number = response.number;
          song = response.song;
          title = response.title;
          getData(number, title, song);
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang.lang !== prevProps.lang.lang) {
      const getData = (id, title, song) => {
        this.setState({
          isLoading: false,
          title,
          song,
          songId: id
        });
      };
      const songID = this.props.match.params.id;
      if (songID === "404") {
        this.props.history.push("/cgs");
      } else {
        firebase
          .database()
          .ref(`chorus/${this.props.lang.lang}`)
          .orderByChild("number")
          .equalTo(this.state.songId)
          .once("value", function(snapshot) {
            snapshot.forEach(childSnapshot => {
              let response = childSnapshot.val();
              let number = response.number;
              let song = response.song;
              let title = response.title;
              getData(number, title, song);
            });
          });
      }
    }
  }

  render() {
    let content = this.state.isLoading ? (
      <Spinner />
    ) : (
      <div>
        <div className="title">
          <div className="number">{this.state.songId}.</div>
          {this.state.title}
        </div>
        <div className="">
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.song
            }}
          />
        </div>
      </div>
    );
    return <div className="container">{content}</div>;
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}
export default connect(mapStateToProps)(ChorusDetails);
