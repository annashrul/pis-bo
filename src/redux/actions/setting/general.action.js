import axios from "axios";
import Swal from "sweetalert2";
import { SETTING_SITE, HEADERS } from "../_constants";
import { handleGet, handlePut } from "../../handle_http";

export function setLoadingAlokasi(load) {
  return {
    type: SETTING_SITE.LOADING_ALOKASI,
    load,
  };
}

export function setDataAlokasi(data = []) {
  return {
    type: SETTING_SITE.ALOKASI,
    data,
  };
}

export function setLoadingGeneral(load) {
  return {
    type: SETTING_SITE.LOADING_GENERAL,
    load,
  };
}

export function setDataGeneral(data = []) {
  return {
    type: SETTING_SITE.GENERAL,
    data,
  };
}
export function setLoadingLanding(load) {
  return {
    type: SETTING_SITE.LOADING_LANDING,
    load,
  };
}

export function setDataLanding(data = []) {
  return {
    type: SETTING_SITE.LANDING,
    data,
  };
}

export const getSiteAlokasi = () => {
  return (dispatch) => {
    let url = `site/alokasi`;
    handleGet(url, (data) => {
      dispatch(setDataAlokasi(data));
    });
  };
};
export const putSiteAlokasi = (data) => {
  return (dispatch) => {
    handlePut(`site/alokasi`, data, (res, msg, status) => {
      if (status) {
        dispatch(getSiteAlokasi());
      }
    });
  };
};

export const getSiteGeneral = (where) => {
  return (dispatch) => {
    let url = `site/config`;
    handleGet(url, (data) => {
      dispatch(setDataGeneral(data));
    });
  };
};
export const putSiteGeneral = (data) => {
  return (dispatch) => {
    handlePut(`site/config`, data, (res, msg, status) => {
      if (status) {
        dispatch(getSiteGeneral());
      }
    });
  };
};
