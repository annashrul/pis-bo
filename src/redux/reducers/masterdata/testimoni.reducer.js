import { TESTIMONI } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  total: [],
  meta: [],
  data: [],
  pagination: [],
};

export const testimoniReducer = (state = initialState, action) => {
  switch (action.type) {
    case TESTIMONI.SUCCESS:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case TESTIMONI.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
