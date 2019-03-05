import React, { Component } from "react";

import "./misc.css";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.display !== this.props.display ||
      nextProps.children !== this.props.children
    );
  }
  render() {
    return (
      <div
        className="modal"
        onClick={this.props.close}
        style={{
          transform: this.props.display
            ? "translateY(0)"
            : "translateY(-100vh)",
          opacity: this.props.display ? "1" : "0"
        }}
      >
        {this.props.children}
        <div>
          <i className="material-icons" onClick={this.props.close}>
            cancel
          </i>
        </div>
      </div>
    );
  }
}

export default Modal;
