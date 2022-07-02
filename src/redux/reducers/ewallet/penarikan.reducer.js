import { PENARIKAN } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingDetail: true,
  isLoadingPost: false,
  isLoadingExcel: false,
  isError: false,
  status: "",
  msg: "",
  data: [],
  edit: [],
  detail: [],
  excel: [],
  pagination: [],
};

export const penarikanReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENARIKAN.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case PENARIKAN.EXCEL:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        excel: action.data.data,
      });

    case PENARIKAN.DETAIL:
      return Object.assign({}, state, {
        detail: action.data.data,
      });
    case PENARIKAN.FAILED:
      return Object.assign({}, state, {
        status: action.data.meta.status,
        msg: action.data.meta.msg,
        data: action.data.data,
      });
    case PENARIKAN.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case PENARIKAN.LOADING_EXCEL:
      return Object.assign({}, state, {
        isLoadingExcel: action.load,
      });
    case PENARIKAN.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case PENARIKAN.LOADING_POST:
      return Object.assign({}, state, {
        isLoadingPost: action.load,
      });
    case PENARIKAN.IS_ERROR:
      return Object.assign({}, state, {
        isError: action.load,
      });
    default:
      return state;
  }
};
