import React, { Component } from "react";
import Pagination from "react-js-pagination";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Swal from "sweetalert2";
import ProfileImage from "assets/profile.png";
// import NoData from "assets/nodata.png";
import Yes from "assets/status-Y.png";
import No from "assets/status-T.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import XLSX from "xlsx";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
// import NoData from "assets/nodata.png";
import dollarY from "assets/status/dollar_y.svg";
import dollar from "assets/status/dollar.svg";
import dollarWhite from "assets/status/dollar_white.svg";
import pack_deliveryY from "assets/status/pack_delivery_y.svg";
import pack_deliveryWhite from "assets/status/pack_delivery_y_white.svg";
import pack_delivery from "assets/status/pack_delivery_y_non.svg";
import pack_deliveredY from "assets/status/pack_delivered_y.svg";
import pack_deliveredWhite from "assets/status/pack_delivered_y_white.svg";
import pack_delivered from "assets/status/pack_delivered_y_non.svg";
import truckY from "assets/status/truck_y.svg";
import truckWhite from "assets/status/truck_y_white.svg";
import truck from "assets/status/truck_y_non.svg";
import confirmY from "assets/status/confirmation.svg";
import confirmWhite from "assets/status/confirmation_white.svg";
import confirm from "assets/status/confirmation_non.svg";
export const CURRENT_DATE = moment(new Date()).format("yyyy-MM-DD");

export const DEFAULT_WHERE = `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`;

export const menu = () => {
  return [
    {
      id: 0,
      label: "member",
      path: "/materdata/member",
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-user-o",
    },

    {
      id: 20,
      label: "pengguna",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 21,
          label: "list",
          path: "/masterdata/pengguna",
          parent: "pengguna",
          isChecked: false,
        },
        {
          id: 22,
          label: "akses",
          path: "/masterdata/pengguna/akses",
          parent: "pengguna",
          isChecked: false,
        },
      ],
    },

    {
      id: 500,
      label: "paket",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 501,
          label: "list",
          path: "/masterdata/paket",
          parent: "paket",
          isChecked: false,
        },
        {
          id: 502,
          label: "kategori",
          path: "/masterdata/paket/kategori",
          parent: "paket",
          isChecked: false,
        },
      ],
    },

    {
      id: 10,
      label: "e-wallet",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 11,
          label: "deposit",
          path: "/ewallet/deposit",
          parent: "e-wallet",
          isChecked: false,
        },
        {
          id: 12,
          label: "penarikan",
          path: "/ewallet/penarikan",
          parent: "e-wallet",
          isChecked: false,
        },
      ],
    },

    {
      id: 350,
      label: "berita",
      path: "",
      isChecked: false,
      icons: "fa fa-newspaper-o",
      sub: [
        {
          id: 351,
          label: "list",
          path: "/masterdata/berita",
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
        {
          id: 352,
          label: "kategori",
          path: "/masterdata/berita/kategori",
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
      ],
    },
    {
      id: 400,
      label: "laporan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-book",
      sub: [
        {
          id: 401,
          label: "transaksi",
          path: "/laporan/transaksi/member",
          parent: "laporan",
          isChecked: false,
        },
        {
          id: 401,
          label: "penjualan",
          path: "/laporan/transaksi/penjualan",
          parent: "laporan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
    {
      id: 15,
      label: "pengaturan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-cogs",
      sub: [
        {
          id: 16,
          label: "umum",
          path: "/pengaturan/umum",
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 17,
          label: "bank",
          path: "/pengaturan/bank",
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 18,
          label: "kurir",
          path: "/pengaturan/kurir",
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 19,
          label: "landing",
          path: "/pengaturan/landing",
          parent: "pengaturan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
  ];
};

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getPeriode = (val) => {
  let newVal = [];
  let getPeriode = val.splice(1, 2);
  getPeriode.forEach((res) => {
    let anyinh = res.split("=");
    newVal.push(anyinh[1]);
  });
  return `${toDate(newVal[0])}-${toDate(newVal[1])}`;
};

export const getFetchWhere = (res, page = 1) => {
  let where = res;
  let toArray = where.split("&");
  toArray.shift();
  if (page && page !== 1) {
    where = `page=${page}&${toArray.join("&")}`;
  } else {
    where = `page=${1}&${toArray.join("&")}`;
  }
  return where;
};

export const toDate = (val, type = "/", isTime = false) => {
  moment.locale("id");
  if (isTime) {
    return moment(val).format("hh:mm:ss");
  }
  return type === "/"
    ? moment(val).format("DD/MM/YYYY")
    : moment(val).format("YYYY-MM-DD");
};

export const setStorage = (key, val) => {
  return localStorage.setItem(key, val);
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};
export const rmStorage = (key) => {
  return localStorage.removeItem(key);
};

export const isEmptyOrUndefined = (val, col, isShowError = true) => {
  if (
    val === "" ||
    val === undefined ||
    val === null ||
    val === "null" ||
    val === "undefined" ||
    val === 0 ||
    val === "0"
  ) {
    return false;
  }
  return true;
};

export const dateRange = (
  onApply,
  value,
  isActive = "",
  isShow = true,
  isLabel = true
) => {
  return (
    <div className={`form-group ${!isShow && "none"}`}>
      <label
        style={{ display: isLabel || isLabel === undefined ? "block" : "none" }}
      >
        {" "}
        Periode{" "}
      </label>
      <DateRangePicker
        ranges={rangeDate}
        alwaysShowCalendars={true}
        autoUpdateInput={true}
        onShow={(event, picker) => {
          if (isEmptyOrUndefined(isActive)) {
            let rmActiveDefault = document.querySelector(
              `.ranges>ul>li[data-range-key="Hari Ini"]`
            );
            rmActiveDefault.classList.remove("active");
            let setActive = document.querySelector(
              `.ranges>ul>li[data-range-key="` + isActive + `"]`
            );
            setActive.classList.add("active");
          }
        }}
        onApply={(event, picker) => {
          const firstDate = moment(picker.startDate._d).format("YYYY-MM-DD");
          const lastDate = moment(picker.endDate._d).format("YYYY-MM-DD");
          onApply(firstDate, lastDate, picker.chosenLabel || "");
        }}
      >
        <input
          readOnly={true}
          type="text"
          className={`form-control`}
          name="date"
          value={value}
        />
      </DateRangePicker>
    </div>
  );
};

export const baseImage = (res) => {
  return (
    <img
      className="img-fluid middle"
      src={res}
      style={{ height: "40px", width: "40px" }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `${noImage()}`;
      }}
      alt="member_image"
    />
  );
};

export const swallOption = (msg, callback, isCancel) => {
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: `Oke`,
    cancelButtonText: "Batal",
    showCancelButton: true,
    cancelButtonColor: "#d33",
  }).then(async (result) => {
    if (result.value) {
      callback();
    } else {
      if (isCancel) {
        isCancel();
      }
    }
  });
};

export const statusOrder = (type, status, iswhite = false) => {
  if (type === "dollar") {
    return !iswhite ? (status ? dollarY : dollar) : dollarWhite;
  } else if (type === "packing") {
    return !iswhite
      ? status
        ? pack_deliveryY
        : pack_delivery
      : pack_deliveryWhite;
  } else if (type === "delivered") {
    return !iswhite
      ? status
        ? pack_deliveredY
        : pack_delivered
      : pack_deliveredWhite;
  } else if (type === "truck") {
    return !iswhite ? (status ? truckY : truck) : truckWhite;
  } else if (type === "confirm") {
    return !iswhite ? (status ? confirmY : confirm) : confirmWhite;
  }
};

export const swalWithCallback = (msg, callback) => {
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: `Oke`,
  }).then(async (result) => {
    if (result.value) {
      callback();
    }
  });
};
export const swal = (msg) => {
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: `Oke`,
  });
};

export const generateNo = (i, current_page, perpage = 10) => {
  return i + 1 + perpage * (parseInt(current_page, 10) - 1);
};

export const noData = (colSpan = 1) => {
  return (
    <tr>
      <td colSpan={colSpan} className="middle text-center">
        <span
          className="badge badge-warning"
          style={{ fontSize: "18px", padding: "10px" }}
        >
          Data tidak tersedia
        </span>
      </td>
    </tr>
  );
};

export const myDate = (val) => {
  return moment(val).locale("id").format("DD/MM/YYYY");
};
export const toExcel = (
  title = "",
  periode = "",
  head = [],
  content = [],
  foot = []
) => {
  let header = [[title.toUpperCase()], [`PERIODE : ${periode}`], [""], head];
  let footer = foot;
  let body = header.concat(content);
  let data = footer === undefined || footer === [] ? body : body.concat(footer);
  let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
  let merge = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: head.length } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: head.length } },
  ];
  if (!ws["!merges"]) ws["!merges"] = [];
  ws["!merges"] = merge;
  ws["!ref"] = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: head.length, r: data.length },
  });
  ws["A1"].s = {
    alignment: {
      vertical: "middle",
    },
  };

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.toUpperCase());
  let exportFileName = `${title.replaceAll(" ", "_").toUpperCase()}_${moment(
    new Date()
  ).format("YYYYMMDDHHMMss")}.xlsx`;
  XLSX.writeFile(wb, exportFileName, { type: "file", bookType: "xlsx" });
  return;
};

export const isEmpty = (col) => {
  return `${col} cannot be null`;
};

export const isFloatFix = (num) => {
  return parseFloat(num).toFixed(8);
};
export const isFloat = (num) => {
  return parseFloat(num);
};

export const noImage = () => {
  return ProfileImage;
};
export const copyTxt = (txt) => {
  return (
    <CopyToClipboard
      text={txt}
      style={{ cursor: "copy" }}
      onCopy={() =>
        ToastQ.fire({ icon: "success", title: `${txt} has been copied.` })
      }
    >
      <span>
        <i className="fa fa-copy" style={{ color: "green" }} /> {txt}{" "}
      </span>
    </CopyToClipboard>
  );
};

export const toCurrency = (angka, isRp = true) => {
  if (angka === undefined) return 0;
  const number_string = angka;
  const split = String(number_string).split(".");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan koma jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    var separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return isRp ? "Rp " + rupiah : rupiah;
};
export const stringifyFormData = (fd) => {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
};
export const addFooters = (doc) => {
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  doc.page = 1;
  // const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(7);
  doc.text(width - 40, height - 30, "Page - " + doc.page);
  doc.page++;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  return doc;
};
export const rplcSpace = (val) => {
  return val.replace(" ", "_");
};
export const rmComma = (angka) => {
  return angka.replaceAll(",", "");

  // let numbers = 0;

  // if (parseFloat(angka) < 0) {
  //   numbers = angka.toString().replace("-", "");
  // } else {
  //   numbers = angka;
  // }
  // var number_string = numbers === "" || numbers === undefined ? String(0.0) : numbers.toString().replace(/,|\D/g, ""),
  //   split = number_string.split("."),
  //   sisa = split[0].length % 3,
  //   rupiah = split[0].substr(0, sisa),
  //   ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // if (ribuan) {
  //   rupiah += ribuan.join("");
  // }

  // rupiah = split[1] !== undefined ? rupiah + "" + split[1] : rupiah;
  // rupiah = parseFloat(angka) < 0 ? "-" + rupiah.replace(/^0+/, "") : rupiah.replace(/^0+/, "");
  // return parseInt(rupiah, 10);
};

export const toRp = (angka) => {
  let numbers = 0;
  if (angka === null) return 0;
  else if (angka === 0) return 0;
  else if (parseInt(angka) === 0) return 0;
  if (parseFloat(angka) < 0) {
    numbers = angka.toString().replace("-", "");
  } else {
    numbers = angka;
  }
  var number_string =
      numbers === "" || numbers === undefined
        ? String(0.0)
        : numbers.toString().replace(/,|\D/g, ""),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan koma jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    var separator = sisa ? "," : "";
    rupiah += separator + ribuan.join(",");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  rupiah =
    parseFloat(angka) < 0
      ? "-" + rupiah.replace(/^0+/, "")
      : rupiah.replace(/^0+/, "");
  return rupiah;
};

export const toPersen = (val1, val2) => {
  let con = (parseFloat(val1) / parseInt(val2, 10)) * 100;
  return con.toFixed(2);
};
export const ToastQ = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export const statusQ = (txt) => {
  console.log("status", txt);
  if (parseInt(txt, 10) === 1) {
    return <img src={Yes} style={{ height: "20px", width: "20px" }} alt="" />;
  } else {
    return <img src={No} style={{ height: "20px", width: "20px" }} alt="" />;
  }
};
export const getMargin = (hrg_jual, hrg_beli) => {
  return (
    ((parseInt(hrg_jual, 10) - parseInt(hrg_beli, 10)) /
      parseInt(hrg_beli, 10)) *
    100
  ).toFixed(2);
};

export const rmHtml = (str) => {
  // /(&nbsp;|<([^>]+)>)/ig
  const regex = /(&#39;|&nbsp;|<([^>]+)>)/gi;
  let cek = str.replace(regex, "");
  return cek.replace("/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g", "");
};
var date = new Date();
date.setDate(date.getDate());
export const rangeDate = {
  "Hari Ini": [moment().locale("id"), moment()],
  Kemarin: [date.setDate(date.getDate() - 1), date.setDate(date.getDate())],
  "7 Hari Terakhir": [moment().subtract(6, "days"), moment()],
  "30 Hari Terakhir": [moment().subtract(29, "days"), moment()],
  "Minggu Ini": [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
  "Minggu Lalu": [
    moment().subtract(1, "weeks").startOf("isoWeek"),
    moment().subtract(1, "weeks").endOf("isoWeek"),
  ],
  "Bulan Ini": [moment().startOf("month"), moment().endOf("month")],
  "Bulan Lalu": [
    moment().subtract(1, "month").startOf("month"),
    moment().subtract(1, "month").endOf("month"),
  ],
  "Tahun Ini": [moment().startOf("year"), moment().endOf("year")],
  "Tahun Lalu": [
    moment().subtract(1, "year").startOf("year"),
    moment().subtract(1, "year").endOf("year"),
  ],
};

class Paginationq extends Component {
  // constructor(props){
  //     super(props);
  // }
  render() {
    return (
      <Pagination
        activePage={parseInt(this.props.current_page, 10)}
        itemsCountPerPage={parseInt(this.props.per_page, 10)}
        totalItemsCount={parseInt(this.props.total, 10)}
        pageRangeDisplayed={3}
        onChange={this.props.callback}
        itemClass="page-item"
        linkClass="page-link"
        activeClass="page-item active"
        disabledClass="page-item disabled"
        // prevPageText="sebelumnya"
        // nextPageText="selanjutnya"
        // firstPageText="pertama"
        // lastPageText="terakhir"
      />
    );
  }
}

export default connect()(Paginationq);
