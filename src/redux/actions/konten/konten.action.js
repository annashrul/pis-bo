import axios from "axios";
import Swal from "sweetalert2";
import { CONTENT, HEADERS, NOTIF_ALERT } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";
export function setLoading(load) {
  return {
    type: CONTENT.LOADING,
    load,
  };
}

export function setLoadingDetail(load) {
  return {
    type: CONTENT.LOADING_DETAIL,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: CONTENT.LOADING_POST,
    load,
  };
}
export function setIsError(load) {
  return {
    type: CONTENT.IS_ERROR,
    load,
  };
}

export function setData(data = []) {
  return {
    type: CONTENT.SUCCESS,
    data,
  };
}

export function setDataEdit(data = []) {
  return {
    type: CONTENT.EDIT,
    data,
  };
}
export function setDataDetail(data = []) {
  return {
    type: CONTENT.DETAIL,
    data,
  };
}

export function setDataFailed(data = []) {
  return {
    type: CONTENT.FAILED,
    data,
  };
}

export const getContent = (where) => {
  return (dispatch) => {
    let url = `content`;
    if (where) {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const postContent = (data, param) => {
  return (dispatch) => {
    handlePost(`content`, data, (res, msg, status) => {
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(getContent(`page=1`));
      }
    });
  };
};

export const putContent = (id, data, param) => {
  return (dispatch) => {
    handlePut(`content/${id}`, data, (res, msg, status) => {
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(getContent(`page=1`));
      }
    });
  };
};

export const deleteContent = (id, param) => async (dispatch) => {
  handleDelete(`content/${id}`, () => {
    dispatch(getContent(`page=1`));
  });
};
