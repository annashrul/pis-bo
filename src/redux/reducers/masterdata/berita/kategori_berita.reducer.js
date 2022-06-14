import { KATEGORI_BERITA } from "../../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
};

export const kategoriBeritaReducer = (state = initialState, action) => {
  switch (action.type) {
    case KATEGORI_BERITA.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    default:
      return state;
  }
};
