import { MEMBER } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  meta: [],
  total: [],
  data: [],
  pagination: [],
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

    case MEMBER.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });

    default:
      return state;
  }
};
