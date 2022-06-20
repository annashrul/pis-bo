import { BANK_PERUSAHAAN } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  data: [],
  pagination: [],
};

export const bankPerusahaanReducer = (state = initialState, action) => {
  switch (action.type) {
    case BANK_PERUSAHAAN.SUCCESS:
      return Object.assign({}, state, {
        data: action.data.data,
        pagination: action.data.pagination,
      });

    case BANK_PERUSAHAAN.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });

    default:
      return state;
  }
};
