import { KATEGORI_PAKET } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  total: [],
  meta: [],
  data: [],
  pagination: [],
};

export const kategoriPaketReducer = (state = initialState, action) => {
  switch (action.type) {
    case KATEGORI_PAKET.SUCCESS:
      return Object.assign({}, state, {
        total: action.data.total,
        meta: action.data.meta,
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case KATEGORI_PAKET.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
