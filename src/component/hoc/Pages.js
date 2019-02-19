import React, { Component } from 'react';

import HeaderPages from "../header_footer/HeaderPages";

class Pages extends Component {
  render() {
    return (
        <div>
      <HeaderPages user={this.props.user} />
      {this.props.children} 
      </div>
    );
  }
}


export default Pages;

