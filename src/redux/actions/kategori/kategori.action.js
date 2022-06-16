import axios from "axios";
import Swal from "sweetalert2";
import { KATEGORI, HEADERS, NOTIF_ALERT } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: KATEGORI.LOADING,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: KATEGORI.LOADING_POST,
    load,
  };
}
export function setIsError(load) {
  return {
    type: KATEGORI.IS_ERROR,
    load,
  };
}

export function setData(data = []) {
  return {
    type: KATEGORI.SUCCESS,
    data,
  };
}

export function setDataEdit(data = []) {
  return {
    type: KATEGORI.EDIT,
    data,
  };
}
export function setDataDetail(data = []) {
  return {
    type: KATEGORI.DETAIL,
    data,
  };
}

export function setDataFailed(data = []) {
  return {
    type: KATEGORI.FAILED,
    data,
  };
}

export const fetchKategori = (where = "") => {
  return (dispatch) => {
    let url = `category/list/`.toLocaleLowerCase();
    if (where !== "") {
      url += where;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const postKategori = (data, param) => {
  return (dispatch) => {
    handlePost(`category`, data, (res, msg, status) => {
      dispatch(ModalToggle(false));
      dispatch(fetchKategori(`${param}?page=1`));
    });
  };
};

export const putKategori = (id, data, param) => {
  return (dispatch) => {
    handlePut(`category/${id}`, data, (res, msg, status) => {
      dispatch(ModalToggle(false));
      dispatch(fetchKategori(`${param}?page=1`));
    });
  };
};

export const deleteKategori = (id, param) => async (dispatch) => {
  handleDelete(`category/${id}`, () => {
    dispatch(fetchKategori(`${param}?page=1`));
  });
};
