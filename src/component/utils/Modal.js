import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { withRouter } from "react-router-dom";

class Modals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.display
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  link = () => {
    if (this.props.link) {
      return this.props.history.push(this.props.link);
    } else {
      return this.props.close;
    }
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.display}
          toggle={this.toggle}
          className={this.props.className}
          onClick={this.props.close}
        >
          <ModalHeader toggle={this.toggle}>{this.props.header}</ModalHeader>
          <ModalBody>{this.props.children} </ModalBody>
          <ModalFooter>
            <Button
              style={{ backgroundColor: "rgba(32, 87, 187, 0.59)" }}
              onClick={this.link}
            >
              {!this.props.footer ? "Cancel" : this.props.footer}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Modals);
