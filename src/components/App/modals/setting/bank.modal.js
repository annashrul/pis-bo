import React, { Component } from "react";
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../redux/actions/modal.action";
import {
  compareObjectResAndState,
  rmComma,
  ToastQ,
  toRp,
} from "../../../../helper";
import SelectCommon from "../../../common/SelectCommon";
import {
  postBankPerusahaan,
  putBankBankPerusahaan,
} from "../../../../redux/actions/setting/bank.action";

const myState = {
  id_bank: "",
  acc_name: "",
  acc_no: "",
  bank_data: [],
  status: 1,
  data_status: [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ],
};

class FormBankPerusahaan extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    let state = {};
    if (props.dataBank !== undefined) {
      if (props.dataBank.length > 0) {
        let data = [];
        props.dataBank.forEach((v, i) => {
          data.push({ value: v.id, label: v.name });
        });
        Object.assign(state, { bank_data: data });
      }
    }
    if (props.detail.id !== "") {
      const compare = compareObjectResAndState(props.detail.val, this.state);
      Object.assign(state, compare);
    }

    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  handleSelect(col, val) {
    this.setState({ [col]: val.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let keyState = Object.keys(state);
    for (let i = 0; i < keyState.length; i++) {
      if (state[keyState[i]] === "") {
        ToastQ.fire({
          icon: "error",
          title: `${keyState[i].replaceAll("_", " ")} tidak boleh kosong`,
        });
        return;
      }
    }
    delete state.bank_data;
    delete state.data_status;
    if (this.props.detail.id !== "") {
      this.props.dispatch(putBankBankPerusahaan(state, this.props.detail));
    } else {
      this.props.dispatch(postBankPerusahaan(state, this.props.detail));
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formBankPerusahaan"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? "Ubah" : "Tambah"} Bank Perusahaan
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <SelectCommon
              label="Bank"
              options={this.state.bank_data}
              dataEdit={this.state.id_bank}
              callback={(res) => this.handleSelect("id_bank", res)}
            />
            <div className="form-group">
              <label>Atas Nama</label>
              <input
                type="text"
                className="form-control"
                name="acc_name"
                value={this.state.acc_name}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>No Rekening</label>
              <input
                type="text"
                className="form-control"
                name="acc_no"
                value={this.state.acc_no}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <SelectCommon
                label="Status"
                options={this.state.data_status}
                dataEdit={this.state.status}
                callback={(res) => this.handleSelect("status", res)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button
                style={{ color: "white" }}
                type="button"
                className="btn btn-warning mb-2 mr-2"
                onClick={this.toggle}
              >
                <i className="ti-close" />
                Keluar
              </button>
              <button type="submit" className="btn btn-primary mb-2">
                <i className="ti-save" /> Simpan
              </button>
            </div>
          </ModalFooter>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    dataBank: state.bankReducer.data,
  };
};

export default connect(mapStateToProps)(FormBankPerusahaan);
