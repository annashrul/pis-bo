import { BANK } from "../../actions/_constants";

const initialState = {
  isLoading: false,
  data: [],
  pagination: [],
};

export const bankReducer = (state = initialState, action) => {
  switch (action.type) {
    case BANK.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case BANK.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
