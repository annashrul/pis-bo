import Swal from "sweetalert2";
import { DEPOSIT } from "../_constants";
import { handleGet, handlePut } from "../../handle_http";
export function setData(data = []) {
  return {
    type: DEPOSIT.SUCCESS,
    data,
  };
}
export function setDataExcel(data = []) {
  return {
    type: DEPOSIT.EXCEL,
    data,
  };
}

export const getDeposit = (where = "") => {
  return (dispatch) => {
    let url = "transaction/deposit";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};

export const getExcelDeposit = (where = "") => {
  return (dispatch) => {
    let url = "transaction/deposit";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setDataExcel(res));
      if (res.result.length === 0) Swal.fire("Informasi", "Data Tidak Tersedia", "info");
    });
  };
};

export const postDeposit = (data, id) => async (dispatch) => {
  handlePut(`transaction/deposit/${id}/approve`, data, (res, msg, status) => {
    dispatch(getDeposit("page=1"));
  });
};
