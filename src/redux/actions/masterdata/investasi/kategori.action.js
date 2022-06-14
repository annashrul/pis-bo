import { KATEGORI_INVESTASI } from "../../_constants";
import { ModalToggle } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../../handle_http";

export function setFetch(data = []) {
  return {
    type: KATEGORI_INVESTASI.FETCH,
    data,
  };
}

export const fetchKategoriInvestasi = (where = "") => {
  return (dispatch) => {
    let url = `category/membership`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
    });
  };
};

export const postKategoriInvestasi = (data, where) => {
  return (dispatch) => {
    handlePost(`category`, data, (res, msg, status) => {
      dispatch(fetchKategoriInvestasi(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putKategoriInvestasi = (data, detail) => {
  return (dispatch) => {
    handlePut(`category/${detail.id}`, data, (res, msg, status) => {
      dispatch(fetchKategoriInvestasi(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteKategoriInvestasi = (data) => {
  return (dispatch) => {
    handleDelete(`category/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(fetchKategoriInvestasi("page=1"));
      } else {
        dispatch(fetchKategoriInvestasi(data.where));
      }
    });
  };
};
