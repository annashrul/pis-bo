import { PAKET_BINARY } from "../../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
  detail: [],
};

export const paketBinaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAKET_BINARY.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PAKET_BINARY.DETAIL:
      return Object.assign({}, state, {
        detail: action.data.result,
      });
    default:
      return state;
  }
};
