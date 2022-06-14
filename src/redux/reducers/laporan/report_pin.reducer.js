import { LAPORAN_PIN } from "../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
  data_gen_log: [],
};

export const reportPinReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAPORAN_PIN.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case LAPORAN_PIN.FETCH_LOG_PIN:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data_gen_log: action.data.result,
      });
    default:
      return state;
  }
};
