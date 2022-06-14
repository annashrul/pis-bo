import { PAKET_BINARY } from "../../_constants";
import { ModalToggle } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../../handle_http";
import { fetchBarangBinary } from "./barang_binary.action";

export function setFetch(data = []) {
  return {
    type: PAKET_BINARY.FETCH,
    data,
  };
}
export function setFetchDetail(data = []) {
  return {
    type: PAKET_BINARY.DETAIL,
    data,
  };
}

export const fetchPaketBinary = (where = "") => {
  return (dispatch) => {
    let url = `paket_barang`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
    });
  };
};
export const fetchDetailPaketBinary = (id) => {
  return (dispatch) => {
    let url = `paket_barang/${id}`;
    handleGet(url, (res) => {
      dispatch(setFetchDetail(res));
    });
  };
};

export const postPaketBinary = (data, where) => {
  return (dispatch) => {
    handlePost(`paket_barang`, data, (res, msg, status) => {
      dispatch(fetchPaketBinary(where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
export const putPaketBinary = (data, detail) => {
  return (dispatch) => {
    handlePut(`paket_barang/${detail.id}`, data, (res, msg, status) => {
      dispatch(fetchPaketBinary(detail.where));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

export const deletePaketBinary = (data) => {
  return (dispatch) => {
    handleDelete(`paket_barang/${data.id}`, () => {
      if (data.total === 1) {
        dispatch(fetchPaketBinary("page=1"));
      } else {
        dispatch(fetchPaketBinary(data.where));
      }
    });
  };
};

export const postBarang = (data, where) => {
  return (dispatch) => {
    handlePost(`barang/adjustment`, data, (res, msg, status) => {
      dispatch(fetchPaketBinary(where));
      dispatch(fetchBarangBinary(""));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};

// export const postBarang_ = (data,where='') => {
//   return (dispatch) => {
//       dispatch(setLoadingPost(true));
//       dispatch(setIsError(false));
//       let url=`${HEADERS.URL}barang`;
//       if(where!==''){
//           url+=where;
//       }
//       // const url = HEADERS.URL + `barang`;
//       axios.post(url,data)
//           .then(function (response) {
//               const data = (response.data);
//               if (data.status === 'success') {
//                   Swal.fire({
//                       title: 'Success',
//                       icon: 'success',
//                       text: NOTIF_ALERT.SUCCESS,
//                   });
//                   dispatch(setIsError(true));
//                   dispatch(ModalToggle(false));
//                   dispatch(fetchBarang('page=1'));
//               } else {
//                   Swal.fire({
//                       title: 'failed',
//                       icon: 'error',
//                       text: NOTIF_ALERT.FAILED,
//                   });
//                   dispatch(setIsError(false));
//                   dispatch(ModalToggle(true));
//               }
//               dispatch(setLoadingPost(false));
//           })
//           .catch(function (error) {
//               dispatch(setLoadingPost(false));
//               dispatch(setIsError(false));
//               dispatch(ModalToggle(true));
//               if (error.message === 'Network Error') {
//                   Swal.fire(
//                       'Network Failed!.',
//                       'Please check your connection',
//                       'error'
//                   );
//               }
//               else{
//                   Swal.fire({
//                       title: 'failed',
//                       icon: 'error',
//                       text: error.response.data.msg,
//                   });

//                   if (error.response) {

//                   }
//               }

//           })
//   }
// }