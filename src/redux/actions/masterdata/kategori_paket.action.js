import { KATEGORI_PAKET } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: KATEGORI_PAKET.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: KATEGORI_PAKET.SUCCESS,
    data,
  };
}

export const getKategoriPaket = (where, isClear = false) => {
  return (dispatch) => {
    let url = "category/list/product";
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
export const postKategoriPaket = (data, where) => {
  return (dispatch) => {
    handlePost(`category`, data, (res, msg, status) => {
      dispatch(getKategoriPaket(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putKategoriPaket = (data, detail) => {
  return (dispatch) => {
    handlePut(`category/${detail.id}`, data, (res, msg, status) => {
      dispatch(getKategoriPaket(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteKategoriPaket = (data) => {
  return (dispatch) => {
    handleDelete(`category/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getKategoriPaket("page=1"));
      } else {
        dispatch(getKategoriPaket(data.where));
      }
    });
  };
};
