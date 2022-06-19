import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  toCurrency,
  myDate,
  toExcel,
  toRp,
  generateNo,
  noData,
  isEmptyOrUndefined,
  swallOption,
  DEFAULT_WHERE,
  getFetchWhere,
  getPeriode,
} from "../../../helper";
import { ModalToggle, ModalType } from "../../../redux/actions/modal.action";
import moment from "moment";
import {
  getDeposit,
  getExcelDeposit,
  postDeposit,
} from "../../../redux/actions/ewallet/deposit.action";
import * as Swal from "sweetalert2";
import { getConfigWallet } from "../../../redux/actions/ewallet/config_wallet.action";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import TableCommon from "../../common/TableCommon";
import ButtonActionTableCommon from "../../common/ButtonActionTableCommon";
class IndexDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where_data: DEFAULT_WHERE,

      kolom_data: [
        { value: "kd_trx", label: "kode transaksi" },
        { value: "fullname", label: "nama" },
      ],
      kolom: "",
      status_data: [
        { value: "", label: "semua status" },
        { value: "0", label: "pending" },
        { value: "1", label: "sukses" },
        { value: "2", label: "gagal" },
      ],
      status: "",
      data: [],
      isLoading: false,
    };
    this.handleModal = this.handleModal.bind(this);
    this.handlePaymentSlip = this.handlePaymentSlip.bind(this);
    this.handleApproval = this.handleApproval.bind(this);
    this.handleGet = this.handleGet.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(getDeposit(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
  }
  componentWillMount() {
    this.props.dispatch(getConfigWallet());
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataExcel.data !== this.props.dataExcel.data) {
      this.getExcel(this.props);
    }
  }

  getExcel(props) {
    if (props.dataExcel.data !== undefined) {
      if (props.dataExcel.data.length > 0) {
        let content = [];
        let total = 0;
        props.dataExcel.data.forEach((v) => {
          let konv =
            parseInt(v.amount, 10) *
            parseInt(this.props.configWallet.konversi_poin, 10);
          total = total + konv;
          let status = "";
          if (v.status === 0) {
            status = "Pending";
          }
          if (v.status === 1) {
            status = "Sukses";
          }
          if (v.status === 2) {
            status = "Gagal";
          }
          content.push([
            v.kd_trx,
            v.fullname,
            v.downline,
            v.acc_name,
            v.acc_no,
            konv,
            parseInt(v.unique_code, 10),
            status,
            myDate(v.created_at),
          ]);
        });
        toExcel(
          "LAPORAN DEPOSIT",
          `${this.state.dateFrom} - ${this.state.dateTo}`,
          [
            "KODE TRANSAKSI",
            "NAMA",
            "DOWNLINE",
            "BANK TUJUAN",
            "NO REKENING",
            "JUMLAH",
            "KODE UNIK",
            "STATUS",
            "TANGGAL",
          ],
          content,
          [[""], [""], ["TOTAL", "", "", "", "", total]]
        );
      }
    }
  }
  printDocumentXLsx = (param) => {
    this.props.dispatch(getExcelDeposit(this.state.where_data));
  };

  handleModal(e, kode) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPenarikanBonus"));
    this.setState({ detail: { kode: kode } });
  }

  handlePaymentSlip(param) {
    Swal.fire({
      title: "Bukti Transfer",
      text: this.props.data.data[param].name,
      imageUrl: this.props.data.data[param].payment_slip,
      imageAlt: "gambar tidak tersedia",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
  }
  handleApproval(id, status) {
    swallOption(
      `anda yakin akan ${
        status === 1 ? "menerima" : "membatalkan"
      } deposit ini ??`,
      () => {
        let parsedata = { status: status };
        this.props.dispatch(postDeposit(parsedata, btoa(id)));
      }
    );
  }

  render() {
    let totAmountPoint = 0;
    let totAmountRp = 0;
    const { pagination, data } = this.props;

    const head = [
      { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Kode transaksi", width: "1%", rowSpan: 2 },
      { label: "Nama", width: "1%", rowSpan: 2 },
      { label: "Bank tujuan", rowSpan: 2 },
      { label: "Jumlah", width: "1%", rowSpan: 2 },
      { label: "Kode unik", width: "1%", rowSpan: 2 },
      { label: "Status", width: "1%", rowSpan: 2 },
      { label: "Tanggal", width: "1%", rowSpan: 2 },
    ];
    const rowSpan = [];

    return (
      <Layout page={"Laporan Deposit"}>
        <HeaderGeneralCommon
          isPeriode={true}
          pathName="laporanDeposit"
          col="col-md-3"
          isOther={true}
          isColumn={true}
          otherName="status"
          otherState="status"
          otherData={this.state.status_data}
          columnData={this.state.kolom_data}
          callbackGet={(res) => this.handleGet(res)}
          callbackExcel={() =>
            this.printDocumentXLsx(pagination.per_page * pagination.last_page)
          }
        />

        {/* <HeaderGeneralCommon
          col="col-md-3"
          callbackGet={(res) => {
            this.handleGet(res);
            this.setState();
          }}
          isColumn={true}
          columnData={this.state.kolom_data}
          isPeriode={true}
          pathName="laporanDeposit"
          isOther={true}
          otherName="status"
          otherData={this.state.status_data}
          other={this.state.status}
          otherState="status"
          callbackExcel={() =>
            this.printDocumentXLsx(pagination.per_page * pagination.last_page)
          }
        /> */}
        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{
            total: pagination.total,
            current_page: pagination.current_page,
            per_page: pagination.per_page,
          }}
          current_page={pagination.current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    totAmountPoint = totAmountPoint + parseInt(v.amount);
                    let nomRp = parseInt(v.amount, 10);
                    totAmountRp = totAmountRp + parseInt(nomRp);
                    let status = "";
                    if (v.status === 0) {
                      status = (
                        <span className={"badge badge-warning"}>Pending</span>
                      );
                    }
                    if (v.status === 1) {
                      status = (
                        <span className={"badge badge-success"}>Sukses</span>
                      );
                    }
                    if (v.status === 2) {
                      status = (
                        <span className={"badge badge-danger"}>Gagal</span>
                      );
                    }
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(v.kd_trx, 1)}
                          >
                            <i className={"fa fa-check"} />
                          </button>
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(v.kd_trx, 2)}
                          >
                            <i className={"fa fa-close"} />
                          </button>
                          <button
                            className={"btn btn-primary"}
                            onClick={(e) => this.handlePaymentSlip(i)}
                          >
                            <i className={"fa fa-image"} />
                          </button>
                        </td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">{v.fullname}</td>
                        <td className="middle nowrap">
                          {v.acc_name}
                          <br />
                          <div style={{ paddingTop: "5px" }}>
                            {v.bank_name} ({v.acc_no})
                          </div>
                        </td>
                        <td className="middle nowrap text-right poin">
                          {" "}
                          {toCurrency(`${v.amount}`)}
                        </td>
                        <td className="middle nowrap">{v.unique_code}</td>
                        <td className="middle nowrap">{status}</td>
                        <td className="middle nowrap">
                          {myDate(v.created_at)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 5,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: toRp(totAmountRp),
                  className: `text-right txtGreen`,
                },
                { colSpan: 3, label: "" },
              ],
            },
          ]}
        />
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.depositReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.depositReducer.data,
    pagination: state.depositReducer.pagination,
    isLoadingExcel: state.depositReducer.isLoadingExcel,
    dataExcel: state.depositReducer.excel,
    configWallet: state.configWalletReducer.data,
  };
};

export default connect(mapStateToProps)(IndexDeposit);
