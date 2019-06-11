import React, { Component } from "react";
import { Link } from "react-router-dom";

import { firebaselocation } from "../../../firebase";
import { Spinner, firebaseLooper } from "../../utils/misc";

class Location extends Component {
  state = {
    location: [],
    isLoading: true
  };

  componentDidMount() {
    document.title = "Church Locations";
    firebaselocation.once("value").then(snapshot => {
      const location = firebaseLooper(snapshot);
      this.setState({
        location,
        isLoading: false
      });
    });
  }

  render() {
    return (
      <div className="container">
        <div>
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Church address</th>
                <th>LGA</th>
                <th>Pastor's name</th>
                <th>Phone number</th>
              </tr>
            </thead>
            <tbody>
              {this.state.location
                ? this.state.location.map(locate => (
                    <tr key={locate.id}>
                      <td>{locate.region}</td>
                      <td>
                        <Link to={`/admin/location_edit/${locate.id}`}>
                          {locate.address}
                        </Link>
                      </td>
                      <td>{locate.lga}</td>
                      <td>{locate.name}</td>
                      <td>{locate.telephone}</td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
        {this.state.isLoading ? <Spinner /> : ""}
      </div>
    );
  }
}

export default Location;
