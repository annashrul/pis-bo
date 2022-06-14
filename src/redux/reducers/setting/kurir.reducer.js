import { KURIR } from "../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
};

export const kurirReducer = (state = initialState, action) => {
  switch (action.type) {
    case KURIR.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });

    default:
      return state;
  }
};
