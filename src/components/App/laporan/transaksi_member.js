import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  DEFAULT_WHERE,
  generateNo,
  getFetchWhere,
  getPeriode,
  noData,
  toCurrency,
  toExcel,
} from "../../../helper";
import moment from "moment";
import {
  getDataReportTransaksi,
  getDetailReportTransaksi,
  getExcelReportTransaksi,
} from "../../../redux/actions/laporan/report_transaksi_member.action";
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
          content.push([
            v.fullname,
            parseFloat(v.saldo_awal).toFixed(2),
            parseFloat(v.trx_in).toFixed(2),
            parseFloat(v.trx_out).toFixed(2),
            parseFloat(v.saldo_akhir).toFixed(2),
          ]);
        });
        toExcel(
          "LAPORAN TRASANSAKSI MEMBER",
          `${this.state.dateFrom} - ${this.state.dateTo}`,
          ["NAMA", "SALDO AWAL", "SALDO MASUK", "SALDO KELUAR", "SALDO AKHIR"],
          content,
          [
            [""],
            [""],
            [
              "TOTAL",
              props.dataExcel.summary === undefined
                ? 0
                : parseFloat(props.dataExcel.summary.saldo_awal).toFixed(2),
              props.dataExcel.summary === undefined
                ? 0
                : parseFloat(props.dataExcel.summary.trx_in).toFixed(2),
              props.dataExcel.summary === undefined
                ? 0
                : parseFloat(props.dataExcel.summary.trx_out).toFixed(2),
              props.dataExcel.summary === undefined
                ? 0
                : parseFloat(props.dataExcel.summary.saldo_akhir).toFixed(2),
            ],
          ]
        );
      }
    }
  }
  printDocumentXLsx = (e, param) => {
    e.preventDefault();
    let where = `perpage=${param}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    if (
      this.state.any !== null &&
      this.state.any !== undefined &&
      this.state.any !== ""
    ) {
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
    const { pagination, data } = this.props;

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
          pathName="laporanTransaksiMember"
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
                    totPlafon = totPlafon + parseFloat(v.plafon);
                    totSaldoAwal = totSaldoAwal + parseFloat(v.saldo_awal);
                    totSaldoAkhir = totSaldoAkhir + parseFloat(v.saldo_akhir);
                    totTrxIn = totTrxIn + parseFloat(v.trx_in);
                    totTrxOut = totTrxOut + parseFloat(v.trx_out);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Detail" }]}
                            callback={(e) => {
                              if (e === 0) this.handleDetail(v.id, v.fullname);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.fullname}</td>
                        <td className={"middle nowrap text-right poin"}>
                          {toCurrency(`${parseFloat(v.saldo_awal).toFixed(2)}`)}
                        </td>
                        <td className={"middle nowrap text-right poin"}>
                          {toCurrency(`${parseFloat(v.trx_in).toFixed(2)}`)}
                        </td>
                        <td className={"middle nowrap text-right poin"}>
                          {toCurrency(`${parseFloat(v.trx_out).toFixed(2)}`)}
                        </td>
                        <td className={"middle nowrap text-right poin"}>
                          {toCurrency(
                            `${parseFloat(v.saldo_akhir).toFixed(2)}`
                          )}
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
                  colSpan: 3,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totSaldoAwal.toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totTrxIn.toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totTrxOut.toFixed(2)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totSaldoAkhir.toFixed(2)}`),
                  className: `text-right poin`,
                },
              ],
            },
          ]}
        />
        {this.props.isOpen === true ? (
          <DetailReportTransaksiMember detail={this.state.detail} />
        ) : null}
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
    pagination: state.reportTransaksiMemberReducer.pagination,
    dataExcel: state.reportTransaksiMemberReducer.excel,
    kategori: state.kategoriReducer.data,
  };
};

export default connect(mapStateToProps)(LaporanTransaksiMember);
