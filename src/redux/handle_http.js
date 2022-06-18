import { HEADERS, NOTIF_ALERT } from "./actions/_constants";
import Swal from "sweetalert2";
import Axios from "axios";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import { swal, swallOption } from "../helper";

const strNetworkError = "Terjadi Kesalahan Jaringan.";
const strServerError = "Terjadi Kesalahan Jaringan.";

export const loading = (isStatus = true, title = "Silahkan tunggu.") => {
  Swal.fire({
    allowOutsideClick: false,
    title: title,
    html: "",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    onClose: () => {},
  });
  if (!isStatus) Swal.close();
};

export const handleError = (err) => {
  if (err.message === "Network Error") {
    swal(strNetworkError);
  } else {
    if (err.response !== undefined) {
      if (err.response.data.msg !== undefined) {
        swal(err.response.data.msg);
      } else {
        swal(strServerError);
      }
    }
  }
};

export function handleGet(url, callback, isClear = false) {
  Nprogress.start();

  Axios.get(HEADERS.URL + url)
    .then(async (api) => {
      const data = api.data;
      callback(data);
      Nprogress.done();
    })
    .catch(function (error) {
      Nprogress.done();
      handleError(error);
    });
}
export const handlePost = (url, data, callback) => {
  loading(true);
  Axios.post(HEADERS.URL + url, data)
    .then(function (response) {
      setTimeout(function () {
        loading(false);
        const datum = response.data;
        if (datum.meta.status === "success") {
          swal(NOTIF_ALERT.SUCCESS);
          callback(datum, datum.msg, true);
        } else {
          swal(NOTIF_ALERT.FAILED);

          callback(datum, datum.msg, false);
        }
      }, 800);
    })
    .catch(function (error) {
      setTimeout(function () {
        loading(false);
        handleError(error);
      }, 800);
    });
};

export const handlePut = async (url, data, callback) => {
  loading(true);
  Axios.put(HEADERS.URL + url, data)
    .then(function (response) {
      setTimeout(function () {
        loading(false);
        const datum = response.data;
        if (datum.meta.status === "success") {
          swal(NOTIF_ALERT.SUCCESS);
          callback(datum, datum.msg, true);
        } else {
          swal(NOTIF_ALERT.FAILED);
          callback(datum, datum.msg, false);
        }
      }, 800);
    })
    .catch(function (error) {
      setTimeout(function () {
        loading(false);
        handleError(error);
      }, 800);
    });
};

export const handleDelete = async (url, callback) => {
  swallOption("Anda yakin akan menghapus data ini ?", async () => {
    loading(true);
    Axios.delete(HEADERS.URL + url)
      .then(function (response) {
        setTimeout(function () {
          loading(false);
          const datum = response.data;
          if (datum.meta.status === "success") {
            swal(NOTIF_ALERT.SUCCESS);
            callback();
          } else {
            swal(NOTIF_ALERT.SUCCESS);
          }
        }, 800);
      })
      .catch(function (error) {
        setTimeout(function () {
          loading(false);
          handleError(error);
        }, 800);
      });
  });
};

export const handleGetExport = (url, callback, download) => {
  Nprogress.start();
  download("loading");
  Axios.get(HEADERS.URL + url, {
    onDownloadProgress: (progressEvent) => {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      Nprogress.set(percentCompleted / 100);
      download(percentCompleted);
    },
  })
    .then(function (response) {
      console.log("response helper http", response.data.result.data);
      if (
        response.data.result.data !== undefined &&
        response.data.result.data.length > 0
      ) {
        callback(response);
      } else {
        swal("Data tidak tersedia");
      }

      Nprogress.done();
      download(0);
    })
    .catch(function (error) {
      Nprogress.done();
      handleError(error);
      download(0);
    });
};
