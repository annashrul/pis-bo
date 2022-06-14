import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import moment from "moment";
import TableCommon from "../../../common/TableCommon";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import { deleteBarangBinary, fetchBarangBinary } from "../../../../redux/actions/masterdata/binary/barang_binary.action";
import { generateNo, noData, statusQ, toCurrency, toRp } from "../../../../helper";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import FormBarangBinary from "../../modals/masterdata/binary/form_barang_binary";
import { fetchGeneral } from "../../../../redux/actions/setting/general.action";
import FormAdjusment from "../../modals/masterdata/binary/form_adjusment";

moment.locale("id"); // en

class BarangBinary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      where: "",
      mdl: "",
      search_by_data: [{ value: "title", label: "title" }],
    };
    this.handleAdjusment      = this.handleAdjusment.bind(this);
  }
  handleGet(res, page = 1) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(fetchBarangBinary(whereLocal));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.where, pageNumber);
  }

  handleModal(e) {
    if (e === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      let data = {
        id: e.id,
        where: this.state.where,
      };
      Object.assign(data, { val: e });
      this.setState({
        detail: data,
      });
    }
    this.props.dispatch(fetchGeneral());
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formBarangBinary"));
  }
  handleAdjusment(e,i){
      const bool = !this.props.isOpen;
      this.setState({isPage:'formAdjusment'});
      this.props.dispatch(ModalToggle(bool));
      this.props.dispatch(ModalType("formAdjusment"));
      this.setState({detail:this.getDetail(i), mdl:"adjs"});
  }
  getDetail(i){
      return {
          id:this.props.data.data[i].id,
          title:this.props.data.data[i].title,
          stock:this.props.data.data[i].stock_barang,
          status:this.props.data.data[i].status,
          harga:this.props.data.data[i].harga,
          ppn:this.props.data.data[i].ppn,
          satuan:this.props.data.data[i].satuan,
          berat:this.props.data.data[i].berat,
      };
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const { search_by_data, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Harga", width: "1%" },
      { label: "Stok", width: "1%" },
      { label: "Satuan", width: "1%" },
      { label: "Berat", width: "1%" },
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
                            action={[{ label: "Ubah" }, { label: "Hapus" }, { label: "Adjusment" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1)
                                this.props.dispatch(
                                  deleteBarangBinary({
                                    total: data.length,
                                    id: v.id,
                                    where: this.state.where,
                                  })
                                );
                              if (e === 2) this.handleAdjusment(v,i);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap text-right poin">{toCurrency(v.harga)}</td>
                        <td className="middle nowrap text-right">{toRp(v.stock_barang)}</td>
                        <td className="middle nowrap text-right">{v.satuan}</td>
                        <td className="middle nowrap text-right">{toRp(v.berat)} gram</td>
                        <td className="middle nowrap text-right">{statusQ(`${v.status}`)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen && this.state.mdl!=='adjs'? <FormBarangBinary detail={detail} /> : null}
        {this.props.isOpen && this.state.mdl==='adjs' ? <FormAdjusment detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.barangBinaryReducer.data,
  };
};

export default connect(mapStateToProps)(BarangBinary);
