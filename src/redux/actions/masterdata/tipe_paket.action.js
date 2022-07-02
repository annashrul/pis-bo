import { TIPE_PAKET } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: TIPE_PAKET.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: TIPE_PAKET.SUCCESS,
    data,
  };
}

export const getTipePaket = (where, isClear = false) => {
  return (dispatch) => {
    let url = "paket_type";
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
export const postTipePaket = (data, where) => {
  return (dispatch) => {
    handlePost(`paket_type`, data, (res, msg, status) => {
      dispatch(getTipePaket(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putTipePaket = (data, detail) => {
  return (dispatch) => {
    handlePut(`paket_type/${detail.id}`, data, (res, msg, status) => {
      dispatch(getTipePaket(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteTipePaket = (data) => {
  return (dispatch) => {
    handleDelete(`paket_type/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getTipePaket("page=1"));
      } else {
        dispatch(getTipePaket(data.where));
      }
    });
  };
};
