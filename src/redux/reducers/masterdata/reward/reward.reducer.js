import { REWARD } from "../../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
};

export const rewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case REWARD.FETCH:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    default:
      return state;
  }
};
