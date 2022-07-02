import { TIPE_PAKET } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  total: [],
  meta: [],
  data: [],
  pagination: [],
};

export const tipePaketReducer = (state = initialState, action) => {
  switch (action.type) {
    case TIPE_PAKET.SUCCESS:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case TIPE_PAKET.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
