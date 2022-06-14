import { BARANG_BINARY } from "../../_constants";
import { ModalToggle, ModalType } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../../handle_http";

export function setFetch(data = []) {
  return {
    type: BARANG_BINARY.FETCH,
    data,
  };
}

export const fetchBarangBinary = (where = "", isModal = false) => {
  return (dispatch) => {
    let url = `barang`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("formPaketBinary"));
      }
    });
  };
};

export const postBarangBinary = (data, where) => {
  return (dispatch) => {
    handlePost(`barang`, data, (res, msg, status) => {
      dispatch(fetchBarangBinary(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putBarangBinary = (data, detail) => {
  return (dispatch) => {
    handlePut(`barang/${detail.id}`, data, (res, msg, status) => {
      dispatch(fetchBarangBinary(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteBarangBinary = (data) => {
  return (dispatch) => {
    handleDelete(`barang/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(fetchBarangBinary("page=1"));
      } else {
        dispatch(fetchBarangBinary(data.where));
      }
    });
  };
};
