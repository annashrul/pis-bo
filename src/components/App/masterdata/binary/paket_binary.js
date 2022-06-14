import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import TableCommon from "../../../common/TableCommon";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import FormPaketBinary from "../../modals/masterdata/binary/form_paket_binary";
import { fetchDetailPaketBinary, fetchPaketBinary, deletePaketBinary } from "../../../../redux/actions/masterdata/binary/paket_binary.action";
import { fetchBarangBinary } from "../../../../redux/actions/masterdata/binary/barang_binary.action";
import { fetchGeneral } from "../../../../redux/actions/setting/general.action";
import { baseImage, generateNo, noData, statusQ, toCurrency, toRp } from "../../../../helper";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import { fetchKategoriBinary } from "../../../../redux/actions/masterdata/binary/kategori_binary.action";

class PaketBinary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      where: "",
      search_by_data: [{ value: "title", label: "title" }],
    };
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(fetchPaketBinary(whereLocal));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where, pageNumber);
  }

  handleModal(e) {
    if (e === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      this.props.dispatch(fetchDetailPaketBinary(this.props.data.data[e].id));
      this.setState({
        detail: {
          id: this.props.data.data[e].id,
          where: this.state.where,
        },
      });
    }
    this.props.dispatch(fetchGeneral());
    this.props.dispatch(fetchBarangBinary("page=1", true));
    this.props.dispatch(fetchKategoriBinary("page=1"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const { search_by_data, detail, where } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Gambar", width: "1%" },
      { label: "Kategori", width: "1%" },
      { label: "Nama" },
      { label: "Harga", width: "1%" },
      { label: "Ppn (%)", width: "1%" },
      { label: "Jumlah pin", width: "1%" },
      { label: "PV", width: "1%" },
      { label: "Isi paket", width: "1%" },
      { label: "Stok", width: "1%" },
      { label: "Status", width: "1%" },
    ];

    return (
      <Layout page={`Paket binary`}>
        <HeaderGeneralCommon col="col-md-3" callbackGet={(res) => this.handleGet(res)} isColumn={true} columnData={search_by_data} callbackAdd={() => this.handleModal(null)} pathName="paketBinary" />

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
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Ubah" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(i);
                              if (e === 1)
                                this.props.dispatch(
                                  deletePaketBinary({
                                    id: v.id,
                                    total: data.length,
                                    where: where,
                                  })
                                );
                              // if (e === 1) this.handleRePrint(v.no_faktur_mutasi);
                              // if (e === 2) this.props.history.push(`../alokasi3ply/${v.no_faktur_mutasi}`);
                              // if (v.status === "0") {
                              //   if (e === 3) this.props.history.push(`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`);
                              // }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{baseImage(v.foto)}</td>
                        <td className="middle nowrap">{v.kategori}</td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap text-right poin">{toCurrency(v.harga)}</td>
                        <td className="middle nowrap text-right">{toRp(v.ppn)}</td>
                        <td className="middle nowrap text-right">{toRp(v.jumlah_pin)}</td>
                        <td className="middle nowrap text-right">{toRp(v.point_volume)}</td>
                        <td className="middle nowrap text-right">{toRp(v.jumlah_barang)} item</td>
                        <td className="middle nowrap text-right">{toRp(v.stock)}</td>
                        <td className="middle nowrap">{statusQ(`${v.status}`)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen ? <FormPaketBinary detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.paketBinaryReducer.data,
  };
};

export default connect(mapStateToProps)(PaketBinary);
