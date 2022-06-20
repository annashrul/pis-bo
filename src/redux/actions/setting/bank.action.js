import { BANK_PERUSAHAAN } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePatch,
  handlePost,
  handlePut,
} from "../../handle_http";

const folder = "bank";

export function setLoading(load) {
  return {
    type: BANK_PERUSAHAAN.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: BANK_PERUSAHAAN.SUCCESS,
    data,
  };
}

export const getBankPerusahaan = (where) => {
  return (dispatch) => {
    let url = folder;
    if (where) {
      url += `?${where}&perpage=10`;
    }
    handleGet(url, (res) => dispatch(setData(res)));
  };
};

export const postBankPerusahaan = (data, where) => {
  return (dispatch) => {
    handlePost(folder, data, (res, msg, status) => {
      dispatch(getBankPerusahaan(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putBankPerusahaan = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getBankPerusahaan(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putBankBankPerusahaan = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getBankPerusahaan(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteBankPerusahaan = (data) => {
  return (dispatch) => {
    handleDelete(`${folder}/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getBankPerusahaan("page=1"));
      } else {
        dispatch(getBankPerusahaan(data.where));
      }
    });
  };
};
