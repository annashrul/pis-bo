import axios from "axios";
import Swal from "sweetalert2";
import { handleGet } from "../../handle_http";
import { ModalToggle, ModalType } from "../modal.action";
import { BANK, HEADERS, NOTIF_ALERT } from "../_constants";
export function setLoading(load) {
  return {
    type: BANK.LOADING,
    load,
  };
}

export function setData(data = []) {
  return {
    type: BANK.SUCCESS,
    data,
  };
}

export const getGeneralBank = () => {
  return (dispatch) => {
    let url = `transaction/data_bank`;
    handleGet(url, (data) => {
      dispatch(setData(data));
    });
  };
};
