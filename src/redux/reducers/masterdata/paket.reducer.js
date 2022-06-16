import { PAKET } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  total: [],
  meta: [],
  data: [],
  pagination: [],
};

export const paketReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAKET.SUCCESS:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case PAKET.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
