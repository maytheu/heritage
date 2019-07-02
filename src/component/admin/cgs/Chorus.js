import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect} from 'react-redux'

import { firebaseChorus } from '../../../firebase';
import { Spinner, firebaseLooper } from "../../utils/misc";

class Chorus extends Component {
    state = {
    chorus: [],
        isLoading: true,
    }

    componentDidMount() {
      document.title="View Choruses"
        firebaseChorus
          .child(this.props.lang.lang)
          .orderByKey()
          .limitToLast(20)
          .once("value")
          .then(snapshot => {
              const chorus = firebaseLooper(snapshot)
              this.setState({
                chorus,
                isLoading: false
            });
          });
      }
      componentDidUpdate(prevProps) {
        if (this.props.lang.lang !== prevProps.lang.lang) {
          firebaseChorus
          .child(this.props.lang.lang)
          .orderByKey()
          .limitToLast(20)
          .once("value")
          .then(snapshot => {
              const chorus = firebaseLooper(snapshot)
              this.setState({
                chorus,
                isLoading: false
            });
          });
        }}

    render() {
        return (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.chorus
                    ? this.state.chorus.map(song => (
                        <tr key={song.id}>
                          <td>{song.number}</td>
                          <td>
                            <Link to={`/admin/chorus_edit/${song.id}`}>
                              {song.title}
                            </Link>
                          </td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
          
            {this.state.isLoading ? <Spinner /> : ""}
            </div>
            )
    }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(Chorus);