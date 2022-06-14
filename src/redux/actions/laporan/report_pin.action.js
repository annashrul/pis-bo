import { LAPORAN_PIN } from "../_constants";
import { ModalToggle } from "../modal.action";
import { handleGet, handlePost } from "../../handle_http";

export function setFetch(data = []) {
  return {
    type: LAPORAN_PIN.FETCH,
    data,
  };
}

export function setFetchLogPin(data = []) {
  return {
    type: LAPORAN_PIN.FETCH_LOG_PIN,
    data,
  };
}

export const fetchReportPin = (where = "") => {
  return (dispatch) => {
    let url = `pin/report`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetch(res));
    });
  };
};
export const fetchLogGenPin = (where = "") => {
  return (dispatch) => {
    let url = `pin/log/generate`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setFetchLogPin(res));
    });
  };
};

export const postGeneratePin = (data, where) => {
  return (dispatch) => {
    handlePost(`pin`, data, (res, msg, status) => {
      dispatch(fetchReportPin(where));
      dispatch(fetchLogGenPin(""));
      if (status) {
        dispatch(ModalToggle(false));
      }
    });
  };
};
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
