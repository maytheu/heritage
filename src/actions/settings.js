import { LANG_SETTINGS } from "./types";

export const langSettings = () => {
  const lang =[ {
    en: 'en',fr: 'fr', yr: 'yr', ef: 'ef'
  }]
  return {
    type: LANG_SETTINGS,
    payload: lang
  };
};
