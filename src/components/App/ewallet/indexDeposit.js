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
  swallOption,
  DEFAULT_WHERE,
  getFetchWhere,
  getPeriode,
} from "../../../helper";
import { ModalToggle, ModalType } from "../../../redux/actions/modal.action";
import {
  getDeposit,
  getExcelDeposit,
  postDeposit,
} from "../../../redux/actions/ewallet/deposit.action";
import * as Swal from "sweetalert2";
import { getConfigWallet } from "../../../redux/actions/ewallet/config_wallet.action";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import TableCommon from "../../common/TableCommon";
class IndexDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      periode: "",
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
      let periode = getPeriode(where.split("&"));
      this.setState({ where_data: where, periode: periode });
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
    console.log(this.props.dataExcel);
    if (prevProps.dataExcel !== this.props.dataExcel) {
      this.getExcel(this.props);
    }
  }

  getExcel(props) {
    if (props.dataExcel !== undefined) {
      if (props.dataExcel.length > 0) {
        let content = [];
        let totAmountRp = 0;
        props.dataExcel.forEach((v) => {
          totAmountRp = totAmountRp + parseInt(v.amount, 10);
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
            v.bank_name,
            v.acc_name,
            v.acc_no,
            toCurrency(parseFloat(v.amount).toFixed(0)),
            v.unique_code,
            status,
            myDate(v.created_at),
          ]);
        });
        toExcel(
          "LAPORAN DEPOSIT",
          `${this.state.periode.split("-")[0]} - ${
            this.state.periode.split("-")[1]
          }`,
          [
            "Kode transaksi".toUpperCase(),
            "Nama".toUpperCase(),
            "Bank tujuan".toUpperCase(),
            "Atas Nama".toUpperCase(),
            "No Rekening".toUpperCase(),
            "Jumlah".toUpperCase(),
            "Kode unik".toUpperCase(),
            "Status".toUpperCase(),
            "Tanggal".toUpperCase(),
          ],
          content,
          [
            [""],
            [""],
            [
              "TOTAL",
              "",
              "",
              "",
              "",
              toCurrency(parseFloat(totAmountRp).toFixed(0)),
            ],
          ]
        );
      }
    }
  }
  printDocumentXLsx = (param) => {
    let datefrom = this.state.where_data.split("&")[1];
    let dateto = this.state.where_data.split("&")[2];
    let where = `page=1&perpage=${param}&${datefrom}&${dateto}`;
    if (
      this.state.any !== null &&
      this.state.any !== undefined &&
      this.state.any !== ""
    ) {
      where += `&q=${this.state.any}`;
    }
    this.props.dispatch(getExcelDeposit(where));
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
      text: this.props.data[param].name,
      imageUrl: this.props.data[param].payment_slip,
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
          callbackExport={() =>
            this.printDocumentXLsx(pagination.per_page * pagination.last_page)
          }
        />
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
                    let badge = "";
                    let txt = "";
                    if (v.status === 0) {
                      badge = "badge-warning";
                      txt = "Pending";
                    }
                    if (v.status === 1) {
                      badge = "badge-success";
                      txt = "Sukses";
                    }
                    if (v.status === 2) {
                      badge = "badge-danger";
                      txt = "Gagal";
                    }

                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary btn-sm"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(v.kd_trx, 1)}
                          >
                            <i className={"fa fa-check"} />
                          </button>
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary btn-sm"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(v.kd_trx, 2)}
                          >
                            <i className={"fa fa-close"} />
                          </button>
                          <button
                            className={"btn btn-primary btn-sm"}
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
                          {toCurrency(parseFloat(v.amount).toFixed(0))}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {v.unique_code}
                        </td>
                        <td className="middle nowrap">
                          {" "}
                          <span className={`span ${badge}`}>{txt}</span>
                        </td>
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
                  label: toCurrency(parseFloat(totAmountRp).toFixed(0)),
                  className: `text-right poin`,
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
