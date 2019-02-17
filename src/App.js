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
import ChorusDetails from "./component/category/cgs/ChorusDetails";
import Books from "./component/category/sunday/Books";

import Dashboard from "./component/admin/Dashboard";
import AdminCgs from "./component/admin/cgs/Cgs";
import AdminAddEditCgs from "./component/admin/cgs/AddEditCgs";
import AdminSunday from "./component/admin/sunday/Sunday";
import AdminAddEditSunday from "./component/admin/sunday/AddeditSunday";
import AdminLocation from "./component/admin/location/Location";
import AdminAddEditLocation from "./component/admin/location/AddEditLocation";
import AdminStudy from "./component/admin/study/Study";
import AdminAddEditStudy from "./component/admin/study/AddEditStudy";
import AdminTrack from "./component/admin/track/Track";
import AdminAddEditTrack from "./component/admin/track/AddEditTrack";
import TractDetails from "./component/category/track/TractDetails";
import StudyDetails from "./component/category/study/StudyDetails";
import AdminEditChorus from "./component/admin/cgs/EditChorus";
import AdminAddEditJunior from "./component/admin/sunday/AddEditJunior";
import AdminAddEditElem from "./component/admin/sunday/AddEditElem";
import BookDetail from "./component/category/sunday/BookDetail";
import Adult from "./component/category/sunday/Adult";
import Junior from "./component/category/sunday/Junior";
import Elem from "./component/category/sunday/Elem";
import SignIn from "./component/admin/SignIn";
import AdminPages from "./component/hoc/AdminPages";
import PrivateRoute from "./component/hoc/PrivateRoute";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />

          <AdminPages>
            <PrivateRoute
              path="/admin/dashboard"
              exact
              component={Dashboard}
              {...this.props}
            />

            <Route path="/admin/cgs" exact component={AdminCgs} />
            <Route
              path="/admin/cgs_edit/:id"
              exact
              component={AdminAddEditCgs}
            />
            <Route
              path="/admin/chorus_edit/:id"
              exact
              component={AdminEditChorus}
            />
            <Route
              path="/admin/lessons/edit_junior"
              exact
              component={AdminAddEditJunior}
            />
            <Route
              path="/admin/lessons/edit_junior/:id"
              exact
              component={AdminAddEditJunior}
            />
            <Route
              path="/admin/lessons/edit_elem/:id"
              exact
              component={AdminAddEditElem}
            />
            <Route
              path="/admin/lessons/edit_elem"
              exact
              component={AdminAddEditElem}
            />
            <Route path="/admin/cgs_edit" exact component={AdminAddEditCgs} />
            <Route path="/admin/lessons" exact component={AdminSunday} />
            <Route
              path="/admin/lesson_edit/:id"
              exact
              component={AdminAddEditSunday}
            />
            <Route
              path="/admin/lessons_edit"
              exact
              component={AdminAddEditSunday}
            />
            <Route path="/admin/location" exact component={AdminLocation} />
            <Route
              path="/admin/location_edit/:address"
              exact
              component={AdminAddEditLocation}
            />
            <Route
              path="/admin/location_edit"
              exact
              component={AdminAddEditLocation}
            />
            <Route path="/admin/study" exact component={AdminStudy} />
            <Route
              path="/admin/study_edit/:id"
              exact
              component={AdminAddEditStudy}
            />
            <Route
              path="/admin/study_edit"
              exact
              component={AdminAddEditStudy}
            />
            <Route path="/admin/track" exact component={AdminTrack} />
            <Route
              path="/admin/track_edit/:id"
              exact
              component={AdminAddEditTrack}
            />
            <Route
              path="/admin/track_edit"
              exact
              component={AdminAddEditTrack}
            />
          </AdminPages>
          <Pages>
            <Route path="/books" exact component={Books} />
            <Route path="/lesson/:id" exact component={Adult} />
            <Route path="/lesson_junior/:id" exact component={Junior} />
            <Route path="/lesson_elem/:id" exact component={Elem} />
            <Route path="/view_book/:id" exact component={BookDetail} />
            <Route path="/song/:id" exact component={SongDetails} />
            <Route path="/chorus/:id" exact component={ChorusDetails} />
            <Route path="/cgs" exact component={Cgs} />
            <Route path="/lessons" exact component={Sunday} />
            <Route path="/info" exact component={Info} />
            <Route path="/locate" exact component={Location} />
            <Route path="/tracts" exact component={Tracks} />
            <Route path="/tract/:id" exact component={TractDetails} />
            <Route path="/study/:id" exact component={StudyDetails} />
            <Route path="/study" exact component={Study} />
            <Route path="/signin" exact component={SignIn} />
          </Pages>
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;
