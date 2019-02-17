import React, { Component } from "react";

import { Spinner } from "../../utils/misc";
import { firebaseCgs } from "../../../firebase";

class SongDetails extends Component {
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
    if (songID === '404') {
      this.props.history.push("/cgs");
    } else {
      firebaseCgs
        .child("en")
        .child(songID)
        .once("value", function(snapshot) {
          let response = snapshot.val();
          let number = response.number;
          let song = response.song;
          let title = response.title;
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

export default SongDetails;
