import { REPORT_TRANSAKSI_PENJUALAN } from "../_constants";
import { handleGet } from "../../handle_http";
import { ModalToggle, ModalType } from "../modal.action";

export function setLoading(load) {
  return {
    type: REPORT_TRANSAKSI_PENJUALAN.LOADING,
    load,
  };
}
export function setData(data = []) {
  return {
    type: REPORT_TRANSAKSI_PENJUALAN.SUCCESS,
    data,
  };
}
export const getLaporanPenjualan = (where = "") => {
  return (dispatch) => {
    let url = "transaction/penjualan/report";
    if (where !== "") url += `?${where}&perpage=10`;
    handleGet(url, (res) => {
      dispatch(setData(res));
    });
  };
};
