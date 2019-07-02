import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";

import { firebase } from "./firebase";
import "./index.css";
import App from "./App";
import rootReducer from "./reducer/rootReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

const Apps = props => (
  <Provider store={store}>
    <BrowserRouter>
      <App {...props} />
    </BrowserRouter>
  </Provider>
);

firebase.auth().onAuthStateChanged(user => {
  ReactDOM.render(<Apps user={user} />, document.getElementById("root"));
});
