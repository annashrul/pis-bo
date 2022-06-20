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
  toDate,
  toExcel,
  ToastQ,
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
      data: [],
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
    this.handleChange = this.handleChange.bind(this);
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

  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  getProps(props) {
    console.log(props.data);
    if (props.data.length > 0) {
      let datas = [];
      props.data.map((val) => {
        datas.push(val);
      });
      this.setState({ data: datas });
    }
  }

  handleChange(e, i) {
    let data = this.state.data;
    data[i].resi = e.target.value;
    this.setState({ data: data });
  }

  render() {
    let totOngkir = 0;
    let totGrand = 0;

    const { pagination, data } = this.props;

    const head = [
      { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
      { label: "Tanggal", width: "1%", rowSpan: 2 },
      { label: "Status", width: "1%", rowSpan: 2 },
      { label: "Kode", width: "1%", colSpan: 2 },
      { label: "Produk", width: "1%", colSpan: 2 },
      { label: "Total", width: "1%", colSpan: 2 },
      { label: "Pembeli", width: "1%", colSpan: 2 },

      { label: "Pembayaran", width: "1%", colSpan: 2 },
    ];
    const rowSpan = [
      { label: "Transaksi", width: "1%" },
      { label: "Resi" },
      { label: "Nama", width: "1%" },
      { label: "Harga", width: "1%" },

      { label: "Ongkir", width: "1%" },
      { label: "Bayar", width: "1%" },
      { label: "Alamat" },
      { label: "Penerima", width: "1%" },
      { label: "Metode", width: "1%" },
      { label: "Layanan", width: "1%" },
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
                    totOngkir = totOngkir + parseFloat(v.ongkir);
                    totGrand = totGrand + parseFloat(v.grand_total);
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
                        <td className="middle nowrap">
                          {toDate(v.created_at)}&nbsp;
                          {toDate(v.created_at, "/", true)}
                        </td>
                        <td className="middle nowrap">{v.status_st}</td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">
                          <input
                            style={{ width: "130px" }}
                            type="text"
                            name="res"
                            value={this.state.data[i].resi}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                ToastQ.fire({
                                  icon: "success",
                                  title: `resi berhasil disimpan`,
                                });
                              }
                            }}
                            onChange={(e) => this.handleChange(e, i)}
                            className="form-control"
                          />
                        </td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap text-right poin">
                          {toCurrency(parseFloat(v.subtotal).toFixed(0))}
                        </td>

                        <td className="middle nowrap text-right poin">
                          {toCurrency(parseFloat(v.ongkir).toFixed(0))}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toCurrency(parseFloat(v.grand_total).toFixed(0))}
                        </td>
                        <td className="middle nowrap">{v.main_address}</td>
                        <td className="middle nowrap">{v.fullname}</td>

                        <td className="middle nowrap">{v.metode_pembayaran}</td>
                        <td className="middle nowrap">
                          {v.layanan_pengiriman}
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
                  colSpan: 8,
                  label: "Total perhalaman",
                  className: "text-left",
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
                {
                  colSpan: 4,
                  label: "",
                  className: "",
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
