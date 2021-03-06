import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  toExcel,
  myDate,
  toRp,
  generateNo,
  noData,
  swallOption,
  getFetchWhere,
  DEFAULT_WHERE,
  toCurrency,
  getPeriode,
} from "../../../helper";
import moment from "moment";
import {
  getExcelPenarikan,
  getPenarikan,
  postPenarikan,
} from "../../../redux/actions/ewallet/penarikan.action";
import { getConfigWallet } from "../../../redux/actions/ewallet/config_wallet.action";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import TableCommon from "../../common/TableCommon";
import { round } from "lodash";

class IndexPenarikan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periode: "",
      where_data: DEFAULT_WHERE,
      detail: {},
      any: "",
      kolom_data: [
        { value: "kd_trx", label: "kode transaksi" },
        { value: "full_name", label: "nama" },
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
    };
    this.handleApproval = this.handleApproval.bind(this);
    this.handleGet = this.handleGet.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let periode = getPeriode(where.split("&"));
      this.setState({ where_data: where, periode: periode });
      this.props.dispatch(getPenarikan(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
  }

  componentWillMount() {
    this.props.dispatch(getConfigWallet());
  }
  handleApproval(e, id, status) {
    e.preventDefault();
    swallOption(
      `anda yakin akan ${
        status === 1 ? "menerima" : "membatalkan"
      } penarikan ini ??`,
      () => {
        let parsedata = { status: status };
        this.props.dispatch(postPenarikan(btoa(id), parsedata));
      }
    );
  }
  componentDidUpdate(prevProps, prevState) {
    console.log("excel", this.props.dataExcel);

    if (prevProps.dataExcel !== this.props.dataExcel) {
      this.getExcel(this.props);
    }
  }
  getExcel(props) {
    if (props.dataExcel !== undefined) {
      if (props.dataExcel.length > 0) {
        let content = [];
        let total = 0;
        props.dataExcel.forEach((v, i) => {
          total = total + parseFloat(v.amount);

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
            round(parseFloat(v.amount)),
            parseFloat(v.charge),
            status,
            myDate(v.created_at),
          ]);
        });
        toExcel(
          "LAPORAN PENARIKAN",
          `${this.state.periode.split("-")[0]} - ${
            this.state.periode.split("-")[1]
          }`,
          [
            "KODE TRANSAKSI",
            "NAMA",
            "BANK",
            "ATAS NAMA",
            "NO REKENING",
            "JUMLAH",
            "BIAYA ADMIN",
            "STATUS",
            "TANGGAL",
          ],
          content,
          [[""], [""], ["TOTAL", "", "", "", "", round(total)]]
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
    this.props.dispatch(getExcelPenarikan(where));
  };
  render() {
    let totAmountPoint = 0;
    let totAmountRp = 0;
    const { pagination, data } = this.props;
    const { total, per_page, last_page, current_page } = pagination;

    const head = [
      { label: "No", width: "1%", className: "text-center" },
      { label: "#", width: "1%", className: "text-center" },
      { label: "Kode transaksi", width: "1%" },
      { label: "Nama", width: "1%" },
      { label: "Bank" },
      { label: "Jumlah", width: "1%" },
      { label: "Biaya admin", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];

    return (
      <Layout page={"Laporan Penarikan"}>
        <HeaderGeneralCommon
          isPeriode={true}
          pathName="laporanPenarikan"
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
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    totAmountPoint = totAmountPoint + parseFloat(v.amount);
                    let nomRp = parseFloat(v.amount);
                    totAmountRp = totAmountRp + parseFloat(v.amount);
                    let badge = "";
                    let txt = "";
                    if (v.status === 0) {
                      badge = "badge-warning";
                      txt = "Pending";
                    }
                    if (v.status === 1) {
                      badge = "badge-success";
                      txt = "Success";
                    }
                    if (v.status === 2) {
                      badge = "badge-danger";
                      txt = "Cancel";
                    }
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary btn-sm"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(e, v.id, 1)}
                          >
                            <i className={"fa fa-check"} />
                          </button>
                          <button
                            style={{ marginRight: "5px" }}
                            className={"btn btn-primary btn-sm"}
                            disabled={v.status === 1 || v.status === 2}
                            onClick={(e) => this.handleApproval(e, v.id, 2)}
                          >
                            <i className={"fa fa-close"} />
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
                          {toRp(round(nomRp))}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(round(v.charge))}
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
                : noData(head.length)
              : noData(head.length)
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
                { colSpan: 4, label: "" },
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
    isLoading: state.penarikanReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.penarikanReducer.data,
    pagination: state.penarikanReducer.pagination,
    isLoadingExcel: state.penarikanReducer.isLoadingExcel,
    dataExcel: state.penarikanReducer.excel,
    configWallet: state.configWalletReducer.data,
  };
};

export default connect(mapStateToProps)(IndexPenarikan);
