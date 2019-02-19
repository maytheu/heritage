import React, { Component } from "react";

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

  showSettingsHandler = () => {
    this.setState({ showSettings: true });
  };

  render() {
    return (
      <header className="headerHome">
        <ToggleMenu showToggle={this.SideDrawerToggleHandler} />
        <SideDrawer
          user={this.props.user}
          closed={this.closeSideDrawerHandler}
          show={this.state.showSideDrawer}
        />
        <div>
          <i className="material-icons">home</i>
          <i className="material-icons" onClick={this.showSettingsHandler}>
            settings
          </i>
        </div>
        <Modal display={this.state.showSettings} close={this.closeChorus}>
          <Settings />
        </Modal>
      </header>
    );
  }
}

export default HeaderPages;
