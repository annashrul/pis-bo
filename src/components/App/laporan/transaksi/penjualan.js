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
import { getLaporanPenjualan } from "../../../../redux/actions/laporan/laporan_penjualan.action";
import DetailReportTransaksiMember from "../../modals/laporan/detail_report_transaksi_member";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import TableCommon from "../../../common/TableCommon";

class LaporanTransaksiPenjualan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      periode: "",
      where_data: DEFAULT_WHERE,
      status_data: [
        { value: "", label: "semua status" },
        { value: "0", label: "Belum Bayar" },
        { value: "1", label: "Dikemas" },
        { value: "2", label: "Dikirim" },
        { value: "2", label: "Selesai" },
      ],
      status: "",
      kolom_data: [
        { value: "kd_trx", label: "kode transaksi" },
        { value: "fullname", label: "nama" },
      ],
      kolom: "",
    };
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
      this.props.dispatch(getLaporanPenjualan(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where_data, pageNumber);
  }

  render() {
    let totKodeUnik = 0;
    let totHarga = 0;
    let totOngkir = 0;
    let totGrand = 0;

    const { pagination, data } = this.props;

    const head = [
      { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Tanggal", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Status", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Kode", width: "1%", colSpan: 3 },
      { label: "Produk", width: "1%", colSpan: 2 },
      { label: "Pembeli", width: "1%", colSpan: 4 },
      { label: "Total", width: "1%", colSpan: 3 },
      { label: "Pembayaran", width: "1%", colSpan: 2 },
    ];
    const rowSpan = [
      { label: "Transaksi", className: "text-center", width: "1%" },
      { label: "Resi", className: "text-center", width: "1%" },
      { label: "Unik", className: "text-center", width: "1%" },
      { label: "Nama", className: "text-center", width: "1%" },
      { label: "Harga", className: "text-center", width: "1%" },
      { label: "Nama", className: "text-center", width: "1%" },
      { label: "Alamat", className: "text-center" },
      { label: "No Handphone", className: "text-center", width: "1%" },
      { label: "Penerima", className: "text-center", width: "1%" },
      { label: "Harga", className: "text-center", width: "1%" },
      { label: "Ongkir", className: "text-center", width: "1%" },
      { label: "Bayar", className: "text-center", width: "1%" },
      { label: "Metode", className: "text-center", width: "1%" },
      { label: "Layanan", className: "text-center", width: "1%" },
    ];

    return (
      <Layout page={"Laporan Transaksi Penjualan"}>
        <HeaderGeneralCommon
          col="col-md-3"
          callbackGet={(res) => {
            this.handleGet(res);
            this.setState();
          }}
          isOther={true}
          otherName="status"
          otherState="status"
          otherData={this.state.status_data}
          isColumn={true}
          columnData={this.state.kolom_data}
          isPeriode={true}
          pathName="laporanTransaksiPenjualan"
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
                    totKodeUnik = totKodeUnik + parseFloat(v.plafon);
                    totHarga = totHarga + parseFloat(v.saldo_awal);
                    totOngkir = totOngkir + parseFloat(v.saldo_akhir);
                    totGrand = totGrand + parseFloat(v.trx_in);
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
                        {/* <td className="middle nowrap">{v.fullname}</td>
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
                        </td> */}
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
                  colSpan: 6,
                  label: "Total perhalaman",
                  className: "text-left",
                },

                {
                  colSpan: 1,
                  label: toCurrency(`${totKodeUnik.toFixed(0)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 6,
                  label: "",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totHarga.toFixed(0)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totOngkir.toFixed(0)}`),
                  className: `text-right poin`,
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totGrand.toFixed(0)}`),
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
    isOpen: state.modalReducer,
    data: state.reportTransaksiPenjualanReducer.data,
    pagination: state.reportTransaksiPenjualanReducer.pagination,
  };
};

export default connect(mapStateToProps)(LaporanTransaksiPenjualan);
