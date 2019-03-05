import React, { Component } from 'react';
import {connect} from 'react-redux'

import HeaderPages from "../header_footer/HeaderPages";
import { language } from '../../actions/settings';

class Pages extends Component {
  componentDidMount(){
    this.props.dispatch(language('en'))
      }
    
  render() {
    return (
        <div>
      <HeaderPages user={this.props.user} />
      {this.props.children} 
      </div>
    );
  }
}


export default connect()(Pages);

