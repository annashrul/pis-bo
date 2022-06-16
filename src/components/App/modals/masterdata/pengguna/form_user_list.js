import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { isEmptyOrUndefined, ToastQ } from "../../../../../helper";
import {
  postUserList,
  putUserList,
} from "../../../../../redux/actions/masterdata/user_list.action";
import Preloader from "../../../../../Preloader";
import SelectCommon from "../../../../common/SelectCommon";

class FormUserList extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      name: "",
      username: "",
      password: "",
      conf_password: "",
      level: "",
      status: "1",
      level_data: [],
      status_data: [
        { value: "1", label: "Aktif" },
        { value: "0", label: "Tidak Aktif" },
      ],
    };
  }

  clearState() {
    this.setState({
      name: "",
      username: "",
      password: "",
      conf_password: "",
      level: "",
      status: "1",
      level_data: [],
    });
  }
  getProps(props) {
    let state = {};
    console.log(props);
    if (props.dataLevel !== undefined) {
      if (props.dataLevel.length > 0) {
        let data = [];
        props.dataLevel.forEach((v, i) => {
          data.push({ value: v.id, label: v.level });
        });
        Object.assign(state, { level_data: data });
      }
    }
    if (props.detail.id !== "") {
      Object.assign(state, {
        status: `${props.detail.val.status}`.toString(),
        level: props.detail.val.id_level,
        name: props.detail.val.name,
        username: props.detail.val.username,
        password: "-",
        conf_password: "-",
      });
    }
    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
    // this.props.dispatch(getUserLevel());
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
    let parseData = {};
    let state = this.state;
    parseData["name"] = state.name;
    parseData["username"] = state.username;
    parseData["password"] = state.password;
    parseData["conf_password"] = state.conf_password;
    parseData["level"] = state.level;
    parseData["status"] = state.status;

    if (!isEmptyOrUndefined(parseData["name"])) {
      ToastQ.fire({ icon: "error", title: `nama tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["username"])) {
      ToastQ.fire({ icon: "error", title: `username tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["password"])) {
      ToastQ.fire({ icon: "error", title: `password tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["conf_password"])) {
      ToastQ.fire({
        icon: "error",
        title: `konfirmasi password tidak boleh kosong`,
      });
      return;
    }

    if (!isEmptyOrUndefined(parseData["level"])) {
      ToastQ.fire({ icon: "error", title: `level tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["status"])) {
      ToastQ.fire({ icon: "error", title: `status tidak boleh kosong` });
      return;
    }
    if (parseData["conf_password"] !== parseData["password"]) {
      ToastQ.fire({ icon: "error", title: `konfirmasi password tidak sesuai` });
      return;
    }

    delete parseData["conf_password"];

    if (this.props.detail.id === "") {
      this.props.dispatch(postUserList(parseData, this.props.detail.where));
    } else {
      this.props.dispatch(putUserList(parseData, this.props.detail));
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
        isOpen={this.props.isOpen && this.props.type === "formUserList"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? `Ubah Pengguna` : `Tambah Pengguna`}
        </ModalHeader>
        {this.props.isLoadingPost ? <Preloader /> : null}

        <ModalBody>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              readOnly={this.props.detail.id !== ""}
              type="text"
              className="form-control"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Password
              <small>
                {this.props.detail.id !== ""
                  ? " (  kosongkan jika tidak akan diubah )"
                  : ""}
              </small>
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Konfirmasi Password
              <small>
                {this.props.detail.id !== ""
                  ? " (  kosongkan jika tidak akan diubah )"
                  : ""}
              </small>
            </label>
            <input
              type="password"
              className="form-control"
              name="conf_password"
              value={this.state.conf_password}
              onChange={this.handleChange}
            />
          </div>
          <SelectCommon
            label="Akses"
            options={this.state.level_data}
            dataEdit={this.state.level}
            callback={(res) => this.handleSelect("level", res)}
          />
          <SelectCommon
            label="Status"
            options={this.state.status_data}
            dataEdit={this.state.status}
            callback={(res) => this.handleSelect("status", res)}
          />

          {/* <div className="form-group">
            <label>Akses</label>
            <Select
              options={this.state.level_data}
              placeholder="Pilih User Level"
              onChange={this.handleChangeUserLevel}
              value={this.state.level_data.find((op) => {
                return op.value === this.state.level;
              })}
            />
          </div> */}
          {/* <div className="form-group">
            <label>Status</label>
            <Select
              options={this.state.status_data}
              placeholder="Pilih User Level"
              onChange={this.handleStatus}
              value={this.state.status_data.find((op) => {
                return op.value === this.state.status;
              })}
            />
          </div> */}
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
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.handleSubmit}
            >
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
    isLoadingPost: state.userListReducer.isLoadingPost,
    isError: state.userListReducer.isError,
    dataLevel: state.userLevelReducer.data,
  };
};

export default connect(mapStateToProps)(FormUserList);
