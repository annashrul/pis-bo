import { USER_LIST } from "../_constants";
import { ModalToggle } from "../modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handle_http";

export function setLoading(load) {
  return {
    type: USER_LIST.LOADING,
    load,
  };
}

export function setLoadingDetail(load) {
  return {
    type: USER_LIST.LOADING_DETAIL,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: USER_LIST.LOADING_POST,
    load,
  };
}
export function setIsError(load) {
  return {
    type: USER_LIST.IS_ERROR,
    load,
  };
}

export function setData(data = []) {
  return {
    type: USER_LIST.SUCCESS,
    data,
  };
}

export function setDataEdit(data = []) {
  return {
    type: USER_LIST.EDIT,
    data,
  };
}
export function setDataDetail(data = []) {
  return {
    type: USER_LIST.DETAIL,
    data,
  };
}

export function setDataFailed(data = []) {
  return {
    type: USER_LIST.FAILED,
    data,
  };
}

export const getUserList = (where = "") => {
  return (dispatch) => {
    let url = "user";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const postUserList = (data, where) => {
  return (dispatch) => {
    handlePost(`user`, data, (res, msg, status) => {
      dispatch(getUserList(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putUserList = (data, detail) => {
  return (dispatch) => {
    handlePut(`user/${detail.id}`, data, (res, msg, status) => {
      dispatch(getUserList(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const deleteUserList = (data) => {
  return (dispatch) => {
    handleDelete(`user/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(getUserList("page=1"));
      } else {
        dispatch(getUserList(data.where));
      }
    });
  };
};

// export const postUserList = (data) => {
//   return (dispatch) => {
//     dispatch(setLoadingPost(true));
//     dispatch(setIsError(false));
//     const url = HEADERS.URL + `user`;
//     axios
//       .post(url, data)
//       .then(function (response) {
//         const data = response.data;
//         if (data.status === "success") {
//           Swal.fire({
//             title: "Success",
//             icon: "success",
//             text: NOTIF_ALERT.SUCCESS,
//           });
//           dispatch(setIsError(true));
//           dispatch(getUserList(`page=1`));
//           dispatch(ModalToggle(false));
//         } else {
//           Swal.fire({
//             title: "failed",
//             icon: "error",
//             text: NOTIF_ALERT.FAILED,
//           });
//           dispatch(ModalToggle(true));
//           dispatch(setIsError(false));
//         }
//         dispatch(setLoadingPost(false));
//       })
//       .catch(function (error) {
//         dispatch(setLoadingPost(false));
//         dispatch(setIsError(false));
//         if (error.message === "Network Error") {
//           Swal.fire("Network Failed!.", "Please check your connection", "error");
//         } else {
//           Swal.fire({
//             title: "failed",
//             icon: "error",
//             text: error.response.data.msg,
//           });

//           if (error.response) {
//           }
//         }
//       });
//   };
// };

// export const putUserList = (data, id) => {
//   return (dispatch) => {
//     dispatch(setLoadingPost(true));
//     dispatch(setIsError(false));
//     const url = HEADERS.URL + `user/${id}`;
//     axios
//       .put(url, data)
//       .then(function (response) {
//         const data = response.data;
//         if (data.status === "success") {
//           Swal.fire({
//             title: "Success",
//             icon: "success",
//             text: NOTIF_ALERT.SUCCESS,
//           });
//           dispatch(setIsError(true));
//           dispatch(getUserList(`page=1`));
//           dispatch(ModalToggle(false));
//         } else {
//           Swal.fire({
//             title: "failed",
//             icon: "error",
//             text: NOTIF_ALERT.FAILED,
//           });
//           dispatch(ModalToggle(true));
//           dispatch(setIsError(false));
//         }
//         dispatch(setLoadingPost(false));
//       })
//       .catch(function (error) {
//         dispatch(setLoadingPost(false));
//         dispatch(setIsError(false));
//         if (error.message === "Network Error") {
//           Swal.fire("Network Failed!.", "Please check your connection", "error");
//         } else {
//           Swal.fire({
//             title: "failed",
//             icon: "error",
//             text: error.response.data.msg,
//           });

//           if (error.response) {
//           }
//         }
//       });
//   };
// };
