import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import {
  compareObjectResAndState,
  rmComma,
  ToastQ,
  toRp,
} from "../../../../../helper";
import {
  postPaket,
  putPaket,
} from "../../../../../redux/actions/masterdata/paket.action";
import SelectCommon from "../../../../common/SelectCommon";

import File64 from "../../../../common/File64";
import {
  postMember,
  putBankMember,
  putMember,
} from "../../../../../redux/actions/masterdata/member.action";
const myState = {
  id_bank: "",
  acc_name: "",
  acc_no: "",
  bank_data: [],
};

class FormBankMember extends Component {
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
    if (props.dataDetail.bank !== undefined) {
      Object.assign(state, {
        id_bank: props.dataDetail.bank.id_bank,
        acc_name: props.dataDetail.bank.acc_name,
        acc_no: props.dataDetail.bank.acc_no,
      });
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
    this.props.dispatch(
      putBankMember(state, this.props.detail, this.props.dataDetail.bank.id)
    );
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
        isOpen={this.props.isOpen && this.props.type === "formBankMember"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>Ubah Bank Member</ModalHeader>
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
    dataDetail: state.memberReducer.dataDetail,
  };
};

export default connect(mapStateToProps)(FormBankMember);
