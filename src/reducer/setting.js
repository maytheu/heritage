import { LANG_SETTINGS } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case LANG_SETTINGS:
      return { ...state, lang: action.payload };
    default:
      return state;
  }
}
