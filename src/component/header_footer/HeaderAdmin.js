import React, { Component } from "react";
import AdminDrawer from "./AdminDrawer";
import ToggleMenu from "./ToggleMenu";
import Settings from "./Settings";
import Modal from "../utils/Modal";

class HeaderAdmin extends Component {
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
    console.log(this.state)
    return (
      <header className="headerHome">
        <ToggleMenu showToggle={this.SideDrawerToggleHandler} />
        <AdminDrawer
          closed={this.closeSideDrawerHandler}
          show={this.state.showSideDrawer}
        />

        <div>
          <i className="material-icons">home</i>
          <i className="material-icons" onClick={this.showSettingsHandler}>settings</i>
        </div>
        <Modal display={this.state.showSettings} close={this.closeChorus}>
          <Settings />
        </Modal>
      </header>
    );
  }
}

export default HeaderAdmin;