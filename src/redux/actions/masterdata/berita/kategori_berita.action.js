import { KATEGORI_BERITA } from "../../_constants";
import { ModalToggle } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../../handle_http";

export function setFetch(data = []) {
  return {
    type: KATEGORI_BERITA.FETCH,
    data,
  };
}

export const fetchKategoriBerita = (where = "") => {
  return (dispatch) => {
    let url = `category/berita`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
    });
  };
};

export const postKategoriBerita = (data, where) => {
  return (dispatch) => {
    handlePost(`category`, data, (res, msg, status) => {
      dispatch(fetchKategoriBerita(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putKategoriBerita = (data, detail) => {
  return (dispatch) => {
    handlePut(`category/${detail.id}`, data, (res, msg, status) => {
      dispatch(fetchKategoriBerita(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteKategoriBerita = (data) => {
  return (dispatch) => {
    handleDelete(`category/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(fetchKategoriBerita("page=1"));
      } else {
        dispatch(fetchKategoriBerita(data.where));
      }
    });
  };
};
