import { combineReducers } from "redux";

import auth from "./auth";

const rootReducer = combineReducers({
  isAuth: auth
  });
  
  export default rootReducer;