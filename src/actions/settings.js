import { LANG_SETTINGS } from "./types";

export const language = lang => {
  return {
    type: LANG_SETTINGS,
    payload: lang
  };
};
