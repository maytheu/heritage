import { combineReducers } from "redux";

import setting from "./setting";

const rootReducer = combineReducers({
  isLang: setting
  });
  
  export default rootReducer;