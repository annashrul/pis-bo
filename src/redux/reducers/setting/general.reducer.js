import { SETTING_SITE } from "../../actions/_constants";

const initialState = {
  isLoadingGeneral: true,
  isLoadingAlokasi: true,
  isLoadingLanding: true,
  alokasi: [],
  general: [],
  landing: [],
};

export const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTING_SITE.ALOKASI:
      return Object.assign({}, state, {
        alokasi: action.data.data,
      });
    case SETTING_SITE.GENERAL:
      return Object.assign({}, state, {
        general: action.data.data,
      });

    case SETTING_SITE.LOADING_GENERAL:
      return Object.assign({}, state, {
        isLoadingGeneral: action.load,
      });
    case SETTING_SITE.LOADING_ALOKASI:
      return Object.assign({}, state, {
        isLoadingAlokasi: action.load,
      });
    case SETTING_SITE.LANDING:
      return Object.assign({}, state, {
        landing: action.data.data,
      });

    case SETTING_SITE.LOADING_LANDING:
      return Object.assign({}, state, {
        isLoadingLanding: action.load,
      });
    default:
      return state;
  }
};
