import React, { Component } from "react";

import { firebaseDB, firebase } from "../../../firebase";
import { Spinner } from "../../utils/misc";

class ViewPiece extends Component {
  state = { imageUrl: [], title: "", isLoading: true, number: "" };
  componentDidMount() {
    const constHymnId = this.props.match.params.id;
    let url = [];
    const hymn = this.props.location.state.hymn;
    document.title = "Edit Piece";
    firebaseDB
      .ref(`choir/${hymn}/${constHymnId}`)
      .once("value")
      .then(snapshot => {
        const hymnData = snapshot.val();
        this.setState({ title: hymnData.title, number: hymnData.number });
        hymnData.image.forEach((image, i) => {
          firebase
            .storage()
            .ref()
            .child(`hymn/${hymnData.image[i]}`)
            .getDownloadURL()
            .then(urlParam => {
              url.push({ name: hymnData.image[i], url: urlParam });

              if (i === hymnData.image.length - 1) {
                this.setState({ imageUrl: url, isLoading: false });
              }
            });
        });
      });
  }
  render() {
    return (
      <div className="container">
        <div className="row" style={{paddingTop: '16px'}}>
          <div className="col-md-4">{this.state.number}</div>
          <div className="col-md-8">{this.state.title}</div>
        </div>
        <div className="row">
          {this.state.imageUrl.map(img => (
            <div className="col-md-6" key={img.url}>
              <img src={img.url} alt={img.name} />
            </div>
          ))}
        </div>
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

export default ViewPiece;
