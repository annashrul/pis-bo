import { PAKET } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: PAKET.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: PAKET.SUCCESS,
    data,
  };
}

export const getPaket = (where, isClear = false) => {
  return (dispatch) => {
    let url = "paket";
    if (where) {
      url += `?${where}`;
    }
    handleGet(
      url,
      (res) => {
        dispatch(setData(res));
      },
      isClear
    );
  };
};
export const postPaket = (data, where) => {
  return (dispatch) => {
    handlePost(`paket`, data, (res, msg, status) => {
      dispatch(getPaket(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putPaket = (data, detail) => {
  return (dispatch) => {
    handlePut(`paket/${detail.id}`, data, (res, msg, status) => {
      dispatch(getPaket(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deletePaket = (data) => {
  return (dispatch) => {
    handleDelete(`paket/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getPaket("page=1"));
      } else {
        dispatch(getPaket(data.where));
      }
    });
  };
};
