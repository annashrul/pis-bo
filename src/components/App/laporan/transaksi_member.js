import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, toCurrency, toExcel } from "../../../helper";
import moment from "moment";
import { getDataReportTransaksi, getDetailReportTransaksi, getExcelReportTransaksi } from "../../../redux/actions/laporan/report_transaksi_member.action";
import DetailReportTransaksiMember from "../modals/laporan/detail_report_transaksi_member";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import ButtonActionTableCommon from "../../common/ButtonActionTableCommon";
import TableCommon from "../../common/TableCommon";

class LaporanTransaksiMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where_data: DEFAULT_WHERE,
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
    };
    this.printDocumentXLsx = this.printDocumentXLsx.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(getDataReportTransaksi(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
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
          content.push([v.fullname, parseFloat(v.saldo_awal).toFixed(2), parseFloat(v.trx_in).toFixed(2), parseFloat(v.trx_out).toFixed(2), parseFloat(v.saldo_akhir).toFixed(2)]);
        });
        toExcel("LAPORAN TRASANSAKSI MEMBER", `${this.state.dateFrom} - ${this.state.dateTo}`, ["NAMA", "SALDO AWAL", "SALDO MASUK", "SALDO KELUAR", "SALDO AKHIR"], content, [
          [""],
          [""],
          [
            "TOTAL",
            props.dataExcel.summary === undefined ? 0 : parseFloat(props.dataExcel.summary.saldo_awal).toFixed(2),
            props.dataExcel.summary === undefined ? 0 : parseFloat(props.dataExcel.summary.trx_in).toFixed(2),
            props.dataExcel.summary === undefined ? 0 : parseFloat(props.dataExcel.summary.trx_out).toFixed(2),
            props.dataExcel.summary === undefined ? 0 : parseFloat(props.dataExcel.summary.saldo_akhir).toFixed(2),
          ],
        ]);
      }
    }
  }
  printDocumentXLsx = (e, param) => {
    e.preventDefault();
    let where = `perpage=${param}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    if (this.state.any !== null && this.state.any !== undefined && this.state.any !== "") {
      where += `&q=${this.state.any}`;
    }

    this.props.dispatch(getExcelReportTransaksi(where));
  };
  handleDetail(id, nama) {
    let datefrom = this.state.where_data.split("&")[1];
    let dateto = this.state.where_data.split("&")[2];
    let where = `id_member=${id}&${datefrom}&${dateto}`;
    this.setState({
      detail: {
        id: id,
        nama: nama,
        where: where,
        tgl: `${datefrom}&${dateto}`,
      },
    });
    this.props.dispatch(getDetailReportTransaksi(where, true));
  }

  render() {
    // const columnStyle = {
    //   verticalAlign: "middle",
    //   textAlign: "center",
    //   whiteSpace: "nowrap",
    // };
    // const numStyle = {
    //   verticalAlign: "middle",
    //   textAlign: "right",
    //   whiteSpace: "nowrap",
    // };
    let totPlafon = 0;
    let totSaldoAwal = 0;
    let totSaldoAkhir = 0;
    let totTrxIn = 0;
    let totTrxOut = 0;
    const { total, per_page, last_page, current_page, data, summary } = this.props.data;

    const head = [
      { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Nama", rowSpan: 2 },
      { label: "Saldo", width: "1%", colSpan: 4 },
    ];
    const rowSpan = [
      { label: "Awal", className: "text-center", width: "1%" },
      { label: "Masuk", className: "text-center", width: "1%" },
      { label: "Keluar", className: "text-center", width: "1%" },
      { label: "Akhir", className: "text-center", width: "1%" },
    ];

    return (
      <Layout page={"Laporan Transaksi"}>
        <HeaderGeneralCommon
          col="col-md-3"
          callbackGet={(res) => {
            this.handleGet(res);
            this.setState();
          }}
          isPeriode={true}
          pathName="laporanDeposit"
          callbackExport={() => this.printDocumentXLsx(per_page * last_page)}
        />
        <TableCommon
          head={head}
          rowSpan={rowSpan}
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
                    totPlafon = totPlafon + parseFloat(v.plafon);
                    totSaldoAwal = totSaldoAwal + parseFloat(v.saldo_awal);
                    totSaldoAkhir = totSaldoAkhir + parseFloat(v.saldo_akhir);
                    totTrxIn = totTrxIn + parseFloat(v.trx_in);
                    totTrxOut = totTrxOut + parseFloat(v.trx_out);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Detail" }]}
                            callback={(e) => {
                              if (e === 0) this.handleDetail(v.id, v.fullname);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.fullname}</td>
                        <td className={"middle nowrap text-right poin"}>{toCurrency(`${parseFloat(v.saldo_awal).toFixed(2)}`)}</td>
                        <td className={"middle nowrap text-right poin"}>{toCurrency(`${parseFloat(v.trx_in).toFixed(2)}`)}</td>
                        <td className={"middle nowrap text-right poin"}>{toCurrency(`${parseFloat(v.trx_out).toFixed(2)}`)}</td>
                        <td className={"middle nowrap text-right poin"}>{toCurrency(`${parseFloat(v.saldo_akhir).toFixed(2)}`)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 3, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: toCurrency(`${totSaldoAwal.toFixed(2)}`), className: `text-right poin` },
                { colSpan: 1, label: toCurrency(`${totTrxIn.toFixed(2)}`), className: `text-right poin` },
                { colSpan: 1, label: toCurrency(`${totTrxOut.toFixed(2)}`), className: `text-right poin` },
                { colSpan: 1, label: toCurrency(`${totSaldoAkhir.toFixed(2)}`), className: `text-right poin` },
              ],
            },
            {
              data: [
                { colSpan: 3, label: "Total keseluruhan", className: "text-left" },
                {
                  colSpan: 1,
                  label: summary === undefined ? "0.00 Poin" : parseInt(summary.saldo_awal, 10) === 0 ? "0.00 Poin" : toCurrency(`${parseFloat(summary.saldo_awal).toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: summary === undefined ? "0.00 Poin" : parseInt(summary.trx_in, 10) === 0 ? "0.00 Poin" : toCurrency(`${parseFloat(summary.trx_in).toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: summary === undefined ? "0.00 Poin" : parseInt(summary.trx_out, 10) === 0 ? "0.00 Poin" : toCurrency(`${parseFloat(summary.trx_out).toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: summary === undefined ? "0.00 Poin" : parseInt(summary.saldo_akhir, 10) === 0 ? "0.00 Poin" : toCurrency(`${parseFloat(summary.saldo_akhir).toFixed(2)}`),
                  className: `text-right poin`,
                },
              ],
            },
          ]}
        />
        {/* <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th rowSpan="2" style={columnStyle}>
                  NO
                </th>
                <th rowSpan="2" style={columnStyle}>
                  #
                </th>
                <th rowSpan="2" style={columnStyle}>
                  NAMA
                </th>
                <th colSpan="4" style={columnStyle}>
                  SALDO
                </th>
              </tr>
              <tr>
                <th style={columnStyle}>AWAL</th>
                <th style={columnStyle}>MASUK</th>
                <th style={columnStyle}>KELUAR</th>
                <th style={columnStyle}>AKHIR</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    totPlafon = totPlafon + parseFloat(v.plafon);
                    totSaldoAwal = totSaldoAwal + parseFloat(v.saldo_awal);
                    totSaldoAkhir = totSaldoAkhir + parseFloat(v.saldo_akhir);
                    totTrxIn = totTrxIn + parseFloat(v.trx_in);
                    totTrxOut = totTrxOut + parseFloat(v.trx_out);
                    return (
                      <tr key={i}>
                        <td style={columnStyle}>{i + 1 + 10 * (parseInt(current_page, 10) - 1)}</td>
                        <td style={columnStyle}>
                          <button className={"btn btn-primary"} onClick={(e) => this.handleDetail(e, v.id, v.fullname)}>
                            <i className={"fa fa-eye"} />
                          </button>
                        </td>

                        <td style={columnStyle}>{v.fullname}</td>
                        <td className={"poin"} style={numStyle}>
                          {toCurrency(`${parseFloat(v.saldo_awal).toFixed(2)}`)}
                        </td>
                        <td className={"poin"} style={numStyle}>
                          {toCurrency(`${parseFloat(v.trx_in).toFixed(2)}`)}
                        </td>
                        <td className={"poin"} style={numStyle}>
                          {toCurrency(`${parseFloat(v.trx_out).toFixed(2)}`)}
                        </td>
                        <td className={"poin"} style={numStyle}>
                          {toCurrency(`${parseFloat(v.saldo_akhir).toFixed(2)}`)}
                        </td>
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
            <tfoot className="bgWithOpacity">
              <tr>
                <th colSpan={3}>TOTAL PERHALAMAN</th>
                <th className={"poin"} style={numStyle}>
                  {toCurrency(`${totSaldoAwal.toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {toCurrency(`${totTrxIn.toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {toCurrency(`${totTrxOut.toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {toCurrency(`${totSaldoAkhir.toFixed(2)}`)}
                </th>
              </tr>

              <tr>
                <th colSpan={3}>TOTAL KESELURUHAN</th>
                <th className={"poin"} style={numStyle}>
                  {summary === undefined ? "0 Poin" : parseInt(summary.saldo_awal, 10) === 0 ? "0 Poin" : toCurrency(`${parseFloat(summary.saldo_awal).toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {summary === undefined ? "0 Poin" : parseInt(summary.trx_in, 10) === 0 ? "0 Poin" : toCurrency(`${parseFloat(summary.trx_in).toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {summary === undefined ? "0 Poin" : parseInt(summary.trx_out, 10) === 0 ? "0 Poin" : toCurrency(`${parseFloat(summary.trx_out).toFixed(2)}`)}
                </th>
                <th className={"poin"} style={numStyle}>
                  {summary === undefined ? "0 Poin" : parseInt(summary.saldo_akhir, 10) === 0 ? "0 Poin" : toCurrency(`${parseFloat(summary.saldo_akhir).toFixed(2)}`)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", marginBottom: "20px", float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePage} />
        </div> */}
        {this.props.isOpen === true ? <DetailReportTransaksiMember detail={this.state.detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.reportTransaksiMemberReducer.isLoading,
    isLoadingExcel: state.reportTransaksiMemberReducer.isLoadingExcel,
    isOpen: state.modalReducer,
    data: state.reportTransaksiMemberReducer.data,
    dataExcel: state.reportTransaksiMemberReducer.excel,
    kategori: state.kategoriReducer.data,
  };
};

export default connect(mapStateToProps)(LaporanTransaksiMember);
