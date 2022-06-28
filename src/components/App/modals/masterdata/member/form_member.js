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
  putMember,
} from "../../../../../redux/actions/masterdata/member.action";
const myState = {
  fullname: "",
  password: "",
  mobile_no: "",
  confirm_password: "",
  foto: "-",
  status: "1",
  data_status: [
    { label: "Aktif", value: 1 },
    { label: "Belum Bayar", value: 0 },
    { label: "Recycle", value: 3 },
  ],
};

class FormMember extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
  getProps(props) {
    let state = {};
    if (props.detail.id !== "") {
      Object.assign(state, {
        fullname: props.detail.val.fullname,
        mobile_no: props.detail.val.mobile_no,
        status: props.detail.val.status,
        foto: "-",
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
  handleChangeImage(files) {
    if (files.status === "success") {
      this.setState({
        foto: files.base64,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let parseData = {
      fullname: state.fullname,
      foto: state.foto,
      status: state.status,
      mobile_no: state.mobile_no,
    };

    if (state.fullname === "") {
      ToastQ.fire({
        icon: "error",
        title: `nama tidak boleh kosong`,
      });
      return;
    }
    if (state.mobile_no === "") {
      ToastQ.fire({
        icon: "error",
        title: `no handphone tidak boleh kosong`,
      });
      return;
    }

    if (state.password !== "") {
      if (state.password.length < 6) {
        ToastQ.fire({
          icon: "error",
          title: `password minimal 6 karakter`,
        });
        return;
      }
      if (state.confirm_password.length < 6) {
        ToastQ.fire({
          icon: "error",
          title: `konfirmasi password minimal 6 karakter`,
        });
        return;
      }
      if (state.password !== state.confirm_password) {
        ToastQ.fire({
          icon: "error",
          title: `password tidak cocok`,
        });
        return;
      }

      Object.assign(parseData, { password: state.password });
    }
    this.props.dispatch(putMember(parseData, this.props.detail));
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
    console.log(this.props);
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formMember"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? `Ubah Member` : `Tambah Member`}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                value={this.state.fullname}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>No Handphone</label>
              <input
                type="text"
                className="form-control"
                name="mobile_no"
                value={this.state.mobile_no}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              {
                <Select
                  options={this.state.data_status}
                  onChange={(e) => this.handleSelect("status", e)}
                  value={this.state.data_status.find((op) => {
                    return op.value === this.state.status;
                  })}
                />
              }
            </div>
            <div className="form-group">
              <label>
                Password{" "}
                {this.props.detail.id !== "" ? (
                  <small style={{ color: "red" }}>
                    kosongkan bila tidak akan diubah
                  </small>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Konfirmasi Password</label>
              <input
                type="text"
                className="form-control"
                name="confirm_password"
                value={this.state.confirm_password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputState" className="col-form-label">
                Gambar{" "}
                {this.props.detail.id !== "" ? (
                  <small style={{ color: "red" }}>
                    kosongkan bila tidak akan diubah
                  </small>
                ) : (
                  ""
                )}
              </label>
              <br />
              <File64
                multiple={false}
                maxSize={2048} //in kb
                fileType="png, jpg" //pisahkan dengan koma
                className="mr-3 form-control-file"
                onDone={this.handleChangeImage}
                showPreview={true}
                lang="id"
                previewConfig={{
                  width: "100%",
                }}
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
