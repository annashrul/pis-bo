import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { isEmptyOrUndefined, rmComma, ToastQ, toCurrency, toRp } from "../../../../../helper";
import Preloader from "../../../../../Preloader";
import SelectCommon from "../../../../common/SelectCommon";
import { postBarangBinary, putBarangBinary } from "../../../../../redux/actions/masterdata/binary/barang_binary.action";

class FormBarangBinary extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      title: "",
      harga: "",
      satuan: "",
      berat: "0",
      stok: "0",
      status: "1",
      total_poin: 0,
      conversi_poin: 0,
      status_data: [
        { value: "0", label: "Tidak aktif" },
        { value: "1", label: "Aktif" },
      ],
    };
  }
  getProps(props) {
    if (props.detail.id !== "") {
      const val = props.detail.val;
      const checkStatus = this.state.status_data.filter((res) => parseInt(res.value, 10) === val.status);
      this.handleSelect("status", checkStatus[0]);
      this.setState({
        title: val.title,
        harga: val.harga,
        satuan: val.satuan,
        berat: val.berat,
        stok: val.stock_barang,
      });
    }
    let toPoin = 0;
    if (props.config.konversi_poin !== undefined) {
      toPoin = parseInt(props.config.konversi_poin, 10);
    }
    this.setState({
      conversi_poin: toPoin,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  handleChange = (event) => {
    console.log("event.target.name",event.target.name);
    if (event.target.name === "harga") {
      this.setState({ harga: event.target.value, total_poin: parseInt(rmComma(event.target.value), 10) / this.state.conversi_poin });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let parsedata = { title: state.title, harga: rmComma(state.harga), satuan: state.satuan, berat: rmComma(state.berat), stock: rmComma(state.stok), status: state.status, ppn: "0" };
    if (!isEmptyOrUndefined(parsedata.title)) {
      ToastQ.fire({ icon: "error", title: `title tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parsedata.harga)) {
      ToastQ.fire({ icon: "error", title: `harga tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parsedata.satuan)) {
      ToastQ.fire({ icon: "error", title: `satuan tidak boleh kosong` });
      return;
    }

    // if (state.title === "" || state.title === undefined) {
    // ToastQ.fire({ icon: "error", title: `title tidak boleh kosong` });
    // return;
    // }
    if (this.props.detail.id !== "") {
      this.props.dispatch(putBarangBinary(parsedata, this.props.detail));
    } else {
      this.props.dispatch(postBarangBinary(parsedata, this.props.detail.where));
    }
  }

  handleSelect(column, res) {
    this.setState({ [column]: res.value });
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBarangBinary"} size="lg">
        {this.props.isLoadingPost ? <Preloader /> : null}
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? "Ubah" : "Tambah"} Barang &nbsp;
          {this.props.detail.param}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Nama</label>
                <input type="text" className={"form-control"} name={"title"} value={this.state.title} onChange={this.handleChange} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Harga (POIN)</label>
                <input type="text" className={"form-control"} name="harga" value={(this.state.harga)} onChange={(e)=>this.handleChange(e)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Satuan</label>
                <input type="text" className={"form-control"} name={"satuan"} value={this.state.satuan} onChange={this.handleChange} />
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group">
                <label>Harga (POIN)</label>
                <input type="text" className={"form-control"} name={"total_poin"} readOnly value={this.state.total_poin > 0 ? toCurrency(this.state.total_poin) : "0 Poin"} onChange={this.handleChange} />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Berat</label>
                <input type="text" className={"form-control"} name={"berat"} value={toRp(this.state.berat)} onChange={this.handleChange} />
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group">
                <label>Stok</label>
                <input type="text" className={"form-control"} name={"stok"} value={toRp(this.state.stok)} onChange={this.handleChange} />
              </div>
            </div> */}
            <div className="col-md-6">
              <SelectCommon label="Status" options={this.state.status_data} callback={(res) => this.handleSelect("status", res)} dataEdit={this.state.status} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="form-group" style={{ textAlign: "right" }}>
            <button style={{ color: "white" }} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
              <i className="ti-close" />
              Keluar
            </button>
            <button type="submit" className="btn btn-primary mb-2" onClick={this.handleSubmit}>
              <i className="ti-save" />
              Simpan
            </button>
          </div>
        </ModalFooter>
      </WrapperModal>
    );
  }
}
const mapStateToProps = (state) => {
  console.log("state.generalReducer",state.generalReducer);
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    isLoadingPost: state.kategoriReducer.isLoadingPost,
    isError: state.kategoriReducer.isError,
    config: state.generalReducer.data,
  };
};
export default connect(mapStateToProps)(FormBarangBinary);
