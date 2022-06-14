import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { generateNo, noData, toCurrency, toExcel } from "../../../../helper";
import moment from "moment";
import { getDataReportTiket, getExcelReportTiket } from "../../../../redux/actions/laporan/report_tiket.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";

class LaporanTiket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      data: [],
    };
    this.printDocumentXLsx = this.printDocumentXLsx.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(getDataReportTiket(whereLocal));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where, pageNumber);
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
        props.dataExcel.data.forEach((v, i) => {
          content.push([v.kd_trx, v.title, v.qty, parseFloat(v.total).toFixed(2), v.metode_pembayaran, v.fullname, v.bank_name, v.acc_name]);
        });
        toExcel(
          "LAPORAN TIKET",
          `${this.state.dateFrom} - ${this.state.dateTo}`,
          ["KODE TRANSAKSI", "NAMA PAKET", "QTY", "TOTAL (POIN)", "METODE PEMBAYARAN", "NAMA PEMESAN", "BANK TUJUAN", "ATAS NAMA"],
          content
        );
      }
    }
  }
  printDocumentXLsx = (param) => {
    let where = `perpage=${param}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    if (this.state.any !== null && this.state.any !== undefined && this.state.any !== "") {
      where += `&q=${this.state.any}`;
    }
    console.log(where);
    this.props.dispatch(getExcelReportTiket(this.state.where));
  };

  render() {
    const { total, per_page, last_page, current_page, data } = this.props.data;

    const head = [
      { label: "No", width: "1%", className: "text-center" },
      { label: "Kode transaksi", width: "1%" },
      { label: "Metode pembayaran", width: "1%" },
      { label: "Bank" },
      { label: "Qty", width: "1%" },
      { label: "Total", width: "1%" },
      { label: "Status", width: "1%" },
    ];
    return (
      <Layout page={"Laporan Penjualan Tiket"}>
        <HeaderGeneralCommon
          col="col-md-3"
          callbackGet={(res) => {
            this.handleGet(res);
            this.setState();
          }}
          isPeriode={true}
          pathName="laporanPin"
          callbackExport={() => this.printDocumentXLsx(per_page * last_page)}
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
                    let status = "";
                    if (v.status === 0) {
                      status = <span className={"badge badge-warning"}>Pending</span>;
                    }
                    if (v.status === 1) {
                      status = <span className={"badge badge-success"}>Sukses</span>;
                    }
                    if (v.status === 2) {
                      status = <span className={"badge badge-danger"}>Gagal</span>;
                    }
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">{v.metode_pembayaran}</td>
                        <td className="middle nowrap">
                          {v.bank_name}
                          <br />
                          {v.acc_name}
                        </td>
                        <td className="middle nowrap text-right">{v.qty}</td>
                        <td className="middle nowrap text-right poin">{toCurrency(v.total)}</td>
                        <td className="middle nowrap">{status}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        {/* <div style={{ overflowX: "auto" }}>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th style={columnStyle}>NO</th>
                <th style={columnStyle}>KODE TRANSAKSI</th>
                <th style={columnStyle}>QTY</th>
                <th style={columnStyle}>TOTAL</th>
                <th style={columnStyle}>METODE PEMBAYARAN</th>
                <th style={columnStyle}>BANK</th>
                <th style={columnStyle}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    let status = "";
                    if (v.status === 0) {
                      status = <span className={"badge badge-warning"}>Pending</span>;
                    }
                    if (v.status === 1) {
                      status = <span className={"badge badge-success"}>Sukses</span>;
                    }
                    if (v.status === 2) {
                      status = <span className={"badge badge-danger"}>Gagal</span>;
                    }
                    return (
                      <tr key={i}>
                        <td style={columnStyle}>{i + 1 + 10 * (parseInt(current_page, 10) - 1)}</td>
                        <td style={columnStyle}>{v.kd_trx}</td>
                        <td style={columnStyle}>{v.qty}</td>
                        <td style={columnStyle} className="poin">
                          {toCurrency(v.total)}
                        </td>
                        <td style={columnStyle}>{v.metode_pembayaran}</td>
                        <td style={columnStyle}>
                          {v.bank_name}
                          <br />
                          {v.acc_name}
                        </td>
                        <td style={columnStyle}>{status}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} style={columnStyle}>
                      <img alt={"-"} src={`${NOTIF_ALERT.NO_DATA}`} />
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={9} style={columnStyle}>
                    <img alt={"-"} src={`${NOTIF_ALERT.NO_DATA}`} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", marginBottom: "20px", float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePage} />
        </div> */}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.reportTiketReducer.isLoading,
    isLoadingExcel: state.reportTiketReducer.isLoadingExcel,
    isOpen: state.modalReducer,
    data: state.reportTiketReducer.data,
    dataExcel: state.reportTiketReducer.excel,
  };
};

export default connect(mapStateToProps)(LaporanTiket);
