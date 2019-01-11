import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import "./App.css";
import Home from "./component/home/Home";
import Footer from "./component/header_footer/Footer";
import Pages from "./component/hoc/Pages";
import Cgs from "./component/category/cgs/Cgs";
import Sunday from "./component/category/sunday/Sunday";
import Info from "./component/category/info/Info";
import Location from "./component/category/location/Location";
import Tracks from "./component/category/track/Tracks";
import Study from "./component/category/study/Study";
import SongDetails from "./component/category/cgs/SongDetails";



class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />

          <Pages>
            <Route path="/cgs" exact component={Cgs} />
            <Route path="/lessons" exact component={Sunday} />
            <Route path="/info" exact component={Info} />
            <Route path="/location" exact component={Location} />
            <Route path="/tracks" exact component={Tracks} />
            <Route path="/study" exact component={Study} />
            <Route path='/song' exact component={SongDetails}/>
          </Pages>
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;
