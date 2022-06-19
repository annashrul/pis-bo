import { MEMBER } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingDetail: false,
  meta: [],
  total: [],
  data: [],
  pagination: [],
  dataDetail: [],
};

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case MEMBER.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.data,
        pagination: action.data.pagination,
      });
    case MEMBER.SUCCESS_DETAIL:
      return Object.assign({}, state, {
        dataDetail: action.data.data,
      });

    case MEMBER.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case MEMBER.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });

    default:
      return state;
  }
};
