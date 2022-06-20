import { DASHBOARD } from "../_constants";
import { handleGet } from "../../handle_http";

export function setLoading(load) {
  return {
    type: DASHBOARD.LOADING,
    load,
  };
}

export function setData(data = []) {
  return {
    type: DASHBOARD.SUCCESS,
    data,
  };
}

export const getDashboard = () => {
  return (dispatch) => {
    let url = `site/dashboard`;
    handleGet(url, (res) => dispatch(setData(res)));
  };
};
