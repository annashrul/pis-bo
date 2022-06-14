import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import moment from "moment";
import { deleteKategoriBerita, fetchKategoriBerita } from "../../../../redux/actions/masterdata/berita/kategori_berita.action";
import TableCommon from "../../../common/TableCommon";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import FormKategoriBerita from "../../modals/masterdata/berita/form_kategori_berita";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";

moment.locale("id"); // en

class KategoriBerita extends Component {
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
  handleGet(res, page) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(fetchKategoriBerita(whereLocal));
    }
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
    this.props.dispatch(ModalType("formKategoriBerita"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <Layout page={`Kategori berita`}>
        <HeaderGeneralCommon
          pathName="kategoriBerita"
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
                deleteKategoriBerita({
                  total: data.length,
                  id: data[index].id,
                  where: this.state.where,
                })
              );
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen === true ? <FormKategoriBerita detail={this.state.detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.kategoriBeritaReducer.data,
  };
};

export default connect(mapStateToProps)(KategoriBerita);
