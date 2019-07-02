import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { withRouter } from "react-router-dom";

import ToggleMenu from "./ToggleMenu";
import SideDrawer from "./SideDrawer";
import Settings from "./Settings";
import Modal from "../utils/Modal";

class HeaderPages extends Component {
  state = {
    showSideDrawer: false,
    showSettings: false
  };

  closeSideDrawerHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  SideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  closeSettingsHandler = () => {
    this.setState({ showSettings: false });
  };

  showSettingsHandler = () => {
    this.setState({ showSettings: true });
  };

  home = () => this.props.history.push("/");

  render() {
    return (
      <header className="headerHome">
        <ToggleMenu showToggle={this.SideDrawerToggleHandler} />
        <div style={{ float: "right" }}>
          <Nav>
            <NavItem>
              <NavLink style={{ cursor: "pointer" }}>
                <i className="material-icons" onClick={this.home}>
                  home
                </i>
              </NavLink>
            </NavItem>
            <NavLink style={{ cursor: "pointer" }}>
              <i className="material-icons" onClick={this.showSettingsHandler}>
                settings
              </i>
            </NavLink>
          </Nav>
        </div>

        <SideDrawer
          user={this.props.user}
          closed={this.closeSideDrawerHandler}
          show={this.state.showSideDrawer}
        />
        <Modal
          display={this.state.showSettings}
          close={this.closeSettingsHandler}
          header='Settings'
        >
          <Settings />
        </Modal>
      </header>
    );
  }
}

export default withRouter(HeaderPages);
