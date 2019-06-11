import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

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
import PrivateRoute from "./component/utils/authRoute/PrivateRoute";
import PublicRoute from "./component/utils/authRoute/publicRoute";
import NotFound from "./component/utils/NotFound";
import About from "./component/category/About";
import Steps from "./component/category/Steps";

import { language } from "./actions/settings";

class App extends Component {
  componentDidMount() {
    this.props
      .dispatch(language("en"))
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          {this.props.lang.lang ? (
            <Pages user={this.props.user}>
              <PrivateRoute
                path="/admin/dashboard"
                exact
                component={Dashboard}
                {...this.props}
              />

              <PrivateRoute
                path="/admin/cgs"
                exact
                component={AdminCgs}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/cgs_edit/:id"
                exact
                component={AdminAddEditCgs}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/chorus_edit/:id"
                exact
                component={AdminEditChorus}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/lessons/edit_junior"
                exact
                component={AdminAddEditJunior}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/lessons/edit_junior/:id"
                exact
                component={AdminAddEditJunior}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/lessons/edit_elem/:id"
                exact
                component={AdminAddEditElem}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/lessons/edit_elem"
                exact
                component={AdminAddEditElem}
                {...this.props}
              />
              <PrivateRoute
                path="/admin/cgs_edit"
                {...this.props}
                exact
                component={AdminAddEditCgs}
              />
              <PrivateRoute
                path="/admin/lessons"
                {...this.props}
                exact
                component={AdminSunday}
              />
              <PrivateRoute
                path="/admin/lesson_edit/:id"
                exact
                {...this.props}
                component={AdminAddEditSunday}
              />
              <PrivateRoute
                path="/admin/lessons_edit"
                exact
                {...this.props}
                component={AdminAddEditSunday}
              />
              <PrivateRoute
                path="/admin/location"
                {...this.props}
                exact
                component={AdminLocation}
              />
              <PrivateRoute
                path="/admin/location_edit/:address"
                exact
                {...this.props}
                component={AdminAddEditLocation}
              />
              <PrivateRoute
                path="/admin/location_edit"
                exact
                {...this.props}
                component={AdminAddEditLocation}
              />
              <PrivateRoute
                path="/admin/study"
                exact
                component={AdminStudy}
                {...this.props}
              />
              <PrivateRoute
                {...this.props}
                path="/admin/study_edit/:id"
                exact
                component={AdminAddEditStudy}
              />
              <PrivateRoute
                path="/admin/study_edit"
                exact
                {...this.props}
                component={AdminAddEditStudy}
              />
              <PrivateRoute
                path="/admin/track"
                {...this.props}
                exact
                component={AdminTrack}
              />
              <PrivateRoute
                {...this.props}
                path="/admin/track_edit/:id"
                exact
                component={AdminAddEditTrack}
              />
              <PrivateRoute
                path="/admin/track_edit"
                exact
                {...this.props}
                component={AdminAddEditTrack}
              />

              <PublicRoute
                path="/books"
                exact
                restricted={false}
                component={Books}
                {...this.props}
              />
              <PublicRoute
                path="/lesson/:id"
                restricted={false}
                exact
                component={Adult}
                {...this.props}
              />
              <PublicRoute
                path="/lesson_junior/:id"
                exact
                component={Junior}
                {...this.props}
                restricted={false}
              />
              <PublicRoute
                path="/lesson_elem/:id"
                exact
                restricted={false}
                component={Elem}
                {...this.props}
              />
              <PublicRoute
                path="/view_book/:id"
                exact
                restricted={false}
                component={BookDetail}
                {...this.props}
              />
              <PublicRoute
                path="/song/:id"
                exact
                restricted={false}
                component={SongDetails}
                {...this.props}
              />
              <PublicRoute
                path="/chorus/:id"
                restricted={false}
                exact
                component={ChorusDetails}
                {...this.props}
              />

              <PublicRoute
                path="/cgs"
                restricted={false}
                exact
                component={Cgs}
                {...this.props}
              />
              <PublicRoute
                path="/lessons"
                exact
                restricted={false}
                component={Sunday}
                {...this.props}
              />
              <PublicRoute
                restricted={false}
                path="/info"
                exact
                component={Info}
                {...this.props}
              />
              <PublicRoute
                path="/locate"
                exact
                restricted={false}
                component={Location}
                {...this.props}
              />
              <PublicRoute
                path="/tracts"
                exact
                restricted={false}
                component={Tracks}
                {...this.props}
              />
              <PublicRoute
                path="/tract/:id"
                exact
                restricted={false}
                component={TractDetails}
                {...this.props}
              />
              <PublicRoute
                path="/study/:id"
                exact
                restricted={false}
                component={StudyDetails}
                {...this.props}
              />
              <PublicRoute
                path="/study"
                exact
                restricted={false}
                component={Study}
                {...this.props}
              />
              <PublicRoute
                path="/signin"
                restricted={true}
                exact
                component={SignIn}
                {...this.props}
              />
              <PublicRoute
                {...this.props}
                exact
                path="/about"
                restricted={false}
                component={About}
              />
              <PublicRoute
                {...this.props}
                exact
                path="/steps"
                restricted={false}
                component={Steps}
              />
            </Pages>
          ) : (
            ""
          )}
          <PublicRoute
            {...this.props}
            exact
            restricted={false}
            component={NotFound}
          />
        </Switch>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { lang: state.isLang };
}

export default connect(mapStateToProps)(App);
