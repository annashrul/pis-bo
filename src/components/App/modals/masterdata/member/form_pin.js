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
import Select from "react-select";
import File64 from "../../../../common/File64";
import {
  postMember,
  putMemberPin,
} from "../../../../../redux/actions/masterdata/member.action";
const myState = {
  id: "",
  pin: ""
  
};

class FormMember extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = myState;
  }
  handleSelect(state, val) {
    this.setState({
      [state]: val.value,
    });
  }

  clearState() {
    this.setState(myState);
  }

  componentWillMount() {
    this.setState({
      id:this.props.detail.id
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let parseData = {};
    if (state.pin !== "") {
      if (state.pin.length < 6) {
        ToastQ.fire({
          icon: "error",
          title: `pin minimal 6 karakter`,
        });
        return;
      }
      if (state.confirm_pin.length < 6) {
        ToastQ.fire({
          icon: "error",
          title: `konfirmasi pin minimal 6 karakter`,
        });
        return;
      }
      if (state.pin !== state.confirm_pin) {
        ToastQ.fire({
          icon: "error",
          title: `pin konfirmasi dan pin tidak sesuai.`,
        });
        return;
      }

      Object.assign(parseData, { pin: state.pin });
    }
    this.props.dispatch(putMemberPin(parseData, this.props.detail));
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
    console.log("object", this.state);
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formMemberPin"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          Ubah PIN
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>
                pin{" "}
              </label>
              <input
                type="number"
                className="form-control"
                name="pin"
                value={this.state.pin}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Konfirmasi pin</label>
              <input
                type="number"
                className="form-control"
                name="confirm_pin"
                value={this.state.confirm_pin}
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
  };
};

export default connect(mapStateToProps)(FormMember);
