import { DEPOSIT } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingDetail: true,
  isLoadingPost: false,
  isLoadingExcel: false,

  isError: false,
  status: "",
  msg: "",
  data: [],
  pagination: [],
  edit: [],
  detail: [],
  excel: [],
};

export const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case DEPOSIT.EXCEL:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        excel: action.data.data,
      });

    case DEPOSIT.DETAIL:
      return Object.assign({}, state, {
        detail: action.data.data,
      });
    case DEPOSIT.FAILED:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        data: action.data.data,
      });
    case DEPOSIT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case DEPOSIT.LOADING_EXCEL:
      return Object.assign({}, state, {
        isLoadingExcel: action.load,
      });
    case DEPOSIT.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case DEPOSIT.LOADING_POST:
      return Object.assign({}, state, {
        isLoadingPost: action.load,
      });
    case DEPOSIT.IS_ERROR:
      return Object.assign({}, state, {
        isError: action.load,
      });
    default:
      return state;
  }
};
