import React, { Component } from 'react';
import { connect } from 'react-redux';
import { langSettings } from '../../actions/settings';

class Settings extends Component {

    componentDidMount(){
        this.props.dispatch(langSettings())
        

    }

    render() {
        console.log(this.props.lang)

        return (
            <div>{this.props.lang.lang.map((item, i) => (
                <div key={i}>tyyyuvct</div>
            ))}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { lang: state.isAuth };
  }

export default connect(mapStateToProps)(Settings);