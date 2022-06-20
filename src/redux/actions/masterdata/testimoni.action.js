import { TESTIMONI } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: TESTIMONI.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: TESTIMONI.SUCCESS,
    data,
  };
}

const folder = "testimoni";

export const getTestimoni = (where) => {
  return (dispatch) => {
    let url = folder;
    if (where) {
      url += `?${where}&perpage=10`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};
export const postTestimoni = (data, where) => {
  return (dispatch) => {
    handlePost(folder, data, (res, msg, status) => {
      dispatch(getTestimoni(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putTestimoni = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getTestimoni(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteTestimoni = (data) => {
  return (dispatch) => {
    handleDelete(`${folder}/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getTestimoni("page=1"));
      } else {
        dispatch(getTestimoni(data.where));
      }
    });
  };
};
