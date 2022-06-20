import { DASHBOARD } from "redux/actions/_constants";

const initialState = {
  isLoading: true,
  data: [],
};

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD.SUCCESS:
      return Object.assign({}, state, {
        data: action.data.data,
      });
    case DASHBOARD.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
