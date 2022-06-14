import { KURIR } from "../_constants";
import { handleGet, handlePut } from "../../handle_http";
import { swallOption } from "../../../helper";

export function setFetch(data = []) {
  return {
    type: KURIR.FETCH,
    data,
  };
}

export const fetchKurir = (where) => {
  return (dispatch) => {
    let url = "transaction/kurir";
    if (where) url += `?${where}`;
    handleGet(url, (res) => dispatch(setFetch(res)));
  };
};

export const putKurir = (data, detail) => {
  return (dispatch) => {
    swallOption(`anda yakin akan ${data.status === 0 ? "nonaktifkan" : " aktifkan "}  kurir ini `, () => {
      handlePut(`transaction/kurir/${detail.id}`, data, (res, msg, status) => dispatch(fetchKurir(detail.where)));
    });
  };
};
