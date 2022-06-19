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
} from "../../../../helper";
import moment from "moment";
import {
  getDataReportTransaksi,
  getDetailReportTransaksi,
  getExcelReportTransaksi,
} from "../../../../redux/actions/laporan/report_transaksi_member.action";
import DetailReportTransaksiMember from "../../modals/laporan/detail_report_transaksi_member";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import TableCommon from "../../../common/TableCommon";

class LaporanTransaksiMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      periode: "",
      where_data: DEFAULT_WHERE,
    };
    this.printDocumentXLsx = this.printDocumentXLsx.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let periode = getPeriode(where.split("&"));
      let state = {
        where_data: where,
        periode: periode,
      };
      this.setState(state);
      this.props.dispatch(getDataReportTransaksi(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataExcel !== this.props.dataExcel) {
      this.getExcel(this.props);
    }
  }
  getExcel(props) {
    if (props.dataExcel !== undefined) {
      if (props.dataExcel.length > 0) {
        let totSaldoAwal = 0;
        let totSaldoAkhir = 0;
        let totTrxIn = 0;
        let totTrxOut = 0;
        let content = [];
        props.dataExcel.forEach((v, i) => {
          totSaldoAwal = totSaldoAwal + parseFloat(v.saldo_awal);
          totSaldoAkhir = totSaldoAkhir + parseFloat(v.saldo_akhir);
          totTrxIn = totTrxIn + parseFloat(v.trx_in);
          totTrxOut = totTrxOut + parseFloat(v.trx_out);

          content.push([
            v.fullname,
            toCurrency(parseFloat(v.saldo_awal).toFixed(0)),
            toCurrency(parseFloat(v.trx_in).toFixed(0)),
            toCurrency(parseFloat(v.trx_out).toFixed(0)),
            toCurrency(parseFloat(v.saldo_akhir).toFixed(0)),
          ]);
        });
        toExcel(
          "LAPORAN TRASANSAKSI MEMBER",
          `${this.state.periode.split("-")[0]} - ${
            this.state.periode.split("-")[1]
          }`,
          ["NAMA", "SALDO AWAL", "SALDO MASUK", "SALDO KELUAR", "SALDO AKHIR"],
          content,
          [
            [""],
            [""],
            [
              "TOTAL",
              toCurrency(`${totSaldoAwal.toFixed(0)}`),
              toCurrency(`${totTrxIn.toFixed(0)}`),
              toCurrency(`${totTrxOut.toFixed(0)}`),
              toCurrency(`${totSaldoAkhir.toFixed(0)}`),
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
      <Layout page={"Laporan Transaksi Member"}>
        <HeaderGeneralCommon
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
