import { REWARD } from "../../_constants";
import { ModalToggle } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../../handle_http";

export function setFetch(data = []) {
  return {
    type: REWARD.FETCH,
    data,
  };
}

export const fetchReward = (where = "") => {
  return (dispatch) => {
    let url = `reward`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
    });
  };
};

export const postReward = (data, where) => {
  return (dispatch) => {
    handlePost(`reward`, data, (res, msg, status) => {
      dispatch(fetchReward(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putReward = (data, detail) => {
  return (dispatch) => {
    handlePut(`reward/${detail.id}`, data, (res, msg, status) => {
      dispatch(fetchReward(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteReward = (data) => {
  return (dispatch) => {
    handleDelete(`reward/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(fetchReward("page=1"));
      } else {
        dispatch(fetchReward(data.where));
      }
    });
  };
};
