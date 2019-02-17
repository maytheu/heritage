import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { firebaseChorus } from '../../../firebase';
import { Spinner, firebaseLooper } from "../../utils/misc";

class Chorus extends Component {
    state = {
    chorus: [],
        isLoading: true,
    }

    componentDidMount() {
        firebaseChorus
          .child("en")
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

export default Chorus;