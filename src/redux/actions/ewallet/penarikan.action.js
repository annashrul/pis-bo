import Swal from "sweetalert2";
import { PENARIKAN } from "../_constants";
import { handleGet, handlePut } from "../../handle_http";

export function setData(data = []) {
  return {
    type: PENARIKAN.SUCCESS,
    data,
  };
}
export function setDataExcel(data = []) {
  return {
    type: PENARIKAN.EXCEL,
    data,
  };
}

export const getPenarikan = (where = "") => {
  return (dispatch) => {
    let url = "transaction/withdrawal";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};
export const getExcelPenarikan = (where = "") => {
  return (dispatch) => {
    let url = "transaction/withdrawal";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setDataExcel(res));
      if (res.result.length === 0) Swal.fire("Informasi", "Data Tidak Tersedia", "info");
    });
  };
};

export const postPenarikan = (id, data) => async (dispatch) => {
  handlePut(`transaction/withdrawal/${id}/approve`, data, (res, msg, status) => {
    dispatch(getPenarikan("page=1"));
  });
};
