import React, { Component } from "react";
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
    const getData = (id, title, song) => {
      this.setState({
        isLoading: false,
        title,
        song,
        songId: id
      });
    };
    const songID = this.props.match.params.id;
    if ( songID === '404') {
      this.props.history.push("/cgs");
    } else {
      //correct id
      let number = "";
      let song = "";
      let title = null;
      firebaseChorus
        .child("en")
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

  render() {
    let content = this.state.isLoading ? (
      <Spinner />
    ) : (
      <div>
        <div className="title">
          <div className="number">{this.state.songId}.</div>
          {this.state.title}
        </div>
        <div className="">{this.state.song}</div>
      </div>
    );
    return <div className="container">{content}</div>;
  }
}

export default ChorusDetails;
