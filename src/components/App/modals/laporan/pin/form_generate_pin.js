import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { isEmptyOrUndefined, rmComma, ToastQ, toRp } from "../../../../../helper";
import SelectCommon from "../../../../common/SelectCommon";
import { postGeneratePin } from "../../../../../redux/actions/laporan/report_pin.action";

class FormGeneratePin extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      qty: "",
      prefix: "",
      kategori: "",
      kategori_data: [],
    };
  }

  getProps(props) {
    let kategoriProps = props.kategori;
    let state = {};
    if (kategoriProps !== undefined) {
      if (kategoriProps.data && kategoriProps.data.length > 0) {
        let kategoriPushState = [];
        kategoriProps.data.map((res) => {
          kategoriPushState.push({
            value: res.id,
            label: res.title,
          });
          return null;
        });
        Object.assign(state, { kategori_data: kategoriPushState });
      }
    }
    this.setState(state);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  clearState() {
    this.setState({
      qty: "",
      prefix: "",
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let qty = rmComma(state.qty);
    if (qty === 0 || !isEmptyOrUndefined(qty)) {
      ToastQ.fire({ icon: "error", title: `jumlah pin tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(state.kategori)) {
      ToastQ.fire({ icon: "error", title: `kategori tidak boleh kosong` });
      return;
    }
    if (state.prefix === "") {
      ToastQ.fire({ icon: "error", title: `prefix tidak boleh kosong` });
      return;
    }
    let parseData = {
      qty: qty,
      id_membership: state.kategori,
      prefix: state.prefix,
    };
    this.props.dispatch(postGeneratePin(parseData, this.props.detail));
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.name === "prefix" ? event.target.value.toUpperCase() : event.target.value,
    });
  };

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  }
  handleSelect(col, res) {
    this.setState({ [col]: res.value });
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formGeneratePin"} size="md">
        <ModalHeader toggle={this.toggle}>Generate PIN</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Jumlah</label>
            <input type="text" className="form-control" name="qty" value={toRp(this.state.qty)} onChange={this.handleChange} />
          </div>
          <SelectCommon label="Kategori" options={this.state.kategori_data} dataEdit={this.state.kategori} callback={(res) => this.handleSelect("kategori", res)} />
          <div className="form-group">
            <label>
              Prefix <br />
              <small style={{ color: "#eeeeee" }}>maksimal 2 huruf dan harus menggunakan huruf kapital (besar)</small>
            </label>
            <input maxLength={2} style={{ textTransform: "uppercase" }} type="text" className="form-control" name="prefix" value={this.state.prefix} onChange={this.handleChange} />
            <small className="form-text text-muted">Contoh hasil :{this.state.prefix === "" ? "**" : this.state.prefix}9D75E00858</small>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="form-group" style={{ textAlign: "right" }}>
            <button style={{ color: "white" }} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
              <i className="ti-close" />
              Keluar
            </button>
            <button type="submit" className="btn btn-primary mb-2" onClick={this.handleSubmit}>
              <i className="ti-save" /> Simpan
            </button>
          </div>
        </ModalFooter>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    kategori: state.kategoriBinaryReducer.data,
  };
};

export default connect(mapStateToProps)(FormGeneratePin);
