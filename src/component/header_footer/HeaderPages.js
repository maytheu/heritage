import React, { Component } from "react";

import ToggleMenu from "./ToggleMenu";
import SideDrawer from "./SideDrawer";

class HeaderPages extends Component {
  state = {
    showSideDrawer: false
  };

  closeSideDrawerHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  SideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <header className="headerHome">
        <ToggleMenu showToggle={this.SideDrawerToggleHandler} />
        <SideDrawer
          closed={this.closeSideDrawerHandler}
          show={this.state.showSideDrawer}
        />

        <div>
          <i className="material-icons">home</i>
          <i className="material-icons">settings</i>
        </div>
      </header>
    );
  }
}

export default HeaderPages;
