import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import moment from "moment";
import { deleteKategoriInvestasi, fetchKategoriInvestasi } from "../../../../redux/actions/masterdata/investasi/kategori.action";
import TableCommon from "../../../common/TableCommon";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import FormKategoriInvestasi from "../../modals/masterdata/investasi/form_kategori_investasi";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";

moment.locale("id"); // en

class KategoriInvestasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
  }
  componentWillMount() {
    this.handleGet("", 1);
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(fetchKategoriInvestasi(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(e) {
    if (e === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      this.setState({
        detail: {
          id: this.props.data.data[e].id,
          title: this.props.data.data[e].title,
          where: this.state.where,
        },
      });
    }
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formKategoriInvestasi"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <Layout page={`Kategori`}>
        <HeaderGeneralCommon
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />

        <TableCommon
          head={[{ label: "No", className: "text-center", width: "1%" }, { label: "#", className: "text-center", width: "1%" }, { label: "Nama" }, { label: "Tanggal", width: "1%" }]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "title" }, { label: "created_at", date: true }]}
          current_page={current_page}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.handleModal(index);
            if (e === 1)
              this.props.dispatch(
                deleteKategoriInvestasi({
                  total: data.length,
                  id: data[index].id,
                  where: this.state.where,
                })
              );
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen === true ? <FormKategoriInvestasi detail={this.state.detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.kategoriInvestasiReducer.data,
  };
};

export default connect(mapStateToProps)(KategoriInvestasi);
