import { LANG_SETTINGS, LOGIN_USER } from "../actions/types";



export default function(state = {}, action) {
  switch (action.type) {
    case LANG_SETTINGS:
      return { ...state, lang: action.payload };
    case LOGIN_USER:
      return action.payload || false;
    default:
      return state;
  }
}
