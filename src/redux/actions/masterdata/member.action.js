import { MEMBER } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePatch,
  handlePost,
  handlePut,
} from "../../handle_http";

const folder = "member";

export function setLoading(load) {
  return {
    type: MEMBER.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: MEMBER.SUCCESS,
    data,
  };
}
export function setLoadingDetail(load) {
  return {
    type: MEMBER.LOADING_DETAIL,
    load,
  };
}
export function setDataDetail(data = []) {
  return {
    type: MEMBER.SUCCESS_DETAIL,
    data,
  };
}

export const getMember = (where, isClear = false) => {
  return (dispatch) => {
    let url = folder;
    if (where) {
      url += `?${where}&perpage=10`;
    }
    handleGet(url, (res) => dispatch(setData(res)), isClear);
  };
};
export const getMemberDetail = (where) => {
  return (dispatch) => {
    let url = folder + "/get/" + where;
    handleGet(url, (res) => dispatch(setDataDetail(res)));
  };
};
export const postMember = (data, where) => {
  return (dispatch) => {
    handlePost(folder, data, (res, msg, status) => {
      dispatch(getMember(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putMemberPin = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/pin/${detail.id}`, data, (res, msg, status) => {
      dispatch(getMember(null));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putMember = (data, detail) => {
  return (dispatch) => {
    handlePut(`${folder}/${detail.id}`, data, (res, msg, status) => {
      dispatch(getMember(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const putBankMember = (data, detail, idBank) => {
  return (dispatch) => {
    console.log(`${folder}/bank/${idBank}`);
    handlePatch(`${folder}/bank/${idBank}`, data, (res, msg, status) => {
      dispatch(getMember(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deleteMember = (data) => {
  return (dispatch) => {
    handleDelete(`${folder}/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getMember("page=1"));
      } else {
        dispatch(getMember(data.where));
      }
    });
  };
};
