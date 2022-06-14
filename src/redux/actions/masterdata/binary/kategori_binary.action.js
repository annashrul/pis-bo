import { KATEGORI_BINARY } from "../../_constants";
import { handleGet } from "../../../handle_http";

export function setFetch(data = []) {
  return {
    type: KATEGORI_BINARY.FETCH,
    data,
  };
}

export const fetchKategoriBinary = (where = "") => {
  return (dispatch) => {
    let url = `category/paket`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
      // if (isModal) {
      //   dispatch(ModalToggle(true));
      //   dispatch(ModalType("formKategoriBinary"));
      // }
    });
  };
};

// export const postKategoriInvestasi = (data, where) => {
//   return (dispatch) => {
//     handlePost(`category`, data, (res, msg, status) => {
//       dispatch(fetchKategoriInvestasi(where));
//       if (status) {
//         dispatch(ModalToggle(false));
//       }
//     });
//   };
// };
// export const putKategoriInvestasi = (data, detail) => {
//   return (dispatch) => {
//     handlePut(`category/${detail.id}`, data, (res, msg, status) => {
//       dispatch(fetchKategoriInvestasi(detail.where));
//       if (status) {
//         dispatch(ModalToggle(false));
//       }
//     });
//   };
// };

// export const deleteKategoriInvestasi = (data) => {
//   return (dispatch) => {
//     handleDelete(`category/${data.id}`, () => {
//       if (data.total === 1) {
//         dispatch(fetchKategoriInvestasi("page=1"));
//       } else {
//         dispatch(fetchKategoriInvestasi(data.where));
//       }
//     });
//   };
// };
