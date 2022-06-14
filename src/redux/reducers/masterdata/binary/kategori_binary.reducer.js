import { KATEGORI_BINARY } from "../../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
};

export const kategoriBinaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case KATEGORI_BINARY.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    default:
      return state;
  }
};
