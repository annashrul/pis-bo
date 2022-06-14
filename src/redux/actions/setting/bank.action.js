import { BANKS } from "../_constants";
import { ModalToggle } from "../modal.action";
import { handleGet, handlePut, handleDelete, handlePost } from "../../handle_http";

export function setData(data = []) {
  return {
    type: BANKS.SUCCESS,
    data,
  };
}
export function setDataBank(data = []) {
  return {
    type: BANKS.LISTBANK,
    data,
  };
}

export const fetchDataBank = () => {
  return (dispatch) => {
    let url = "bank/data";
    handleGet(url, (data) => {
      dispatch(setDataBank(data));
    });
  };
};

export const getBankList = (where) => {
  return (dispatch) => {
    let url = "bank";
    if (where) {
      url += `?${where}`;
    }
    handleGet(url, (data) => {
      dispatch(setData(data));
    });
  };
};

export const postBank = (data, detail) => {
  return (dispatch) => {
    handlePost(`bank`, data, (res, msg, status) => {
      if (status) {
        dispatch(getBankList("page=1"));
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putBank = (data, detail) => {
  return (dispatch) => {
    handlePut(`bank/${detail.id}`, data, (res, msg, status) => {
      if (status) {
        dispatch(getBankList(detail.where));
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteBank = (data) => {
  return (dispatch) => {
    handleDelete(`bank/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getBankList("page=1"));
      } else {
        dispatch(getBankList(data.where));
      }
    });
  };
};
