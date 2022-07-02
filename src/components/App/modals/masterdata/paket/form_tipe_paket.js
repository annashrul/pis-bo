import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import {
  compareObjectResAndState,
  isEmptyOrUndefined,
  rmComma,
  ToastQ,
  toRp,
} from "../../../../../helper";
import {
  postKategoriPaket,
  putKategoriPaket,
} from "../../../../../redux/actions/masterdata/kategori_paket.action";
import {
  postTipePaket,
  putTipePaket,
} from "../../../../../redux/actions/masterdata/tipe_paket.action";
const myState = {
  title: "",
  bonus_sponsor: "",
  limit_bonus_nasional: "",
  minimal_wd: "",
  max_wd: "",
};

class FormTipePaket extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = myState;
  }
  getProps(props) {
    let state = this.state;
    if (props.detail.id !== "") {
      const compare = compareObjectResAndState(props.detail.val, this.state);
      Object.assign(state, compare);
    }
    this.setState(state);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  handleChange = (event) => {
    let col = event.target.name;
    let val = event.target.value;
    this.setState({ [col]: col === "title" ? val : rmComma(val) });
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let arrState = Object.keys(state);
    console.log("submit state", state);
    console.log("submit key state", arrState);

    for (let i = 0; i < arrState.length; i++) {
      console.log(state[arrState[i]]);
      if (!isEmptyOrUndefined(state[arrState[i]])) {
        ToastQ.fire({
          icon: "error",
          title: `${arrState[i].replaceAll("_", " ")} tidak boleh kosong`,
        });
        return;
      }
    }
    if (this.props.detail.id !== "") {
      this.props.dispatch(putTipePaket(state, this.props.detail));
    } else {
      this.props.dispatch(postTipePaket(state, this.props.detail.where));
    }
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formTipePaket"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? "Ubah" : "Tambah"} Tipe Paket
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"title"}
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Bonus Sponsor</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"bonus_sponsor"}
                  value={toRp(this.state.bonus_sponsor)}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Limit Bonus Nasional</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"limit_bonus_nasional"}
                  value={toRp(this.state.limit_bonus_nasional)}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Maksimal WD</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"max_wd"}
                  value={toRp(this.state.max_wd)}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>Minimal WD</label>
                <input
                  type="text"
                  className={"form-control"}
                  name={"minimal_wd"}
                  value={toRp(this.state.minimal_wd)}
                  onChange={this.handleChange}
                />
              </div>
            </div>
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
            <button
              type="submit"
              className="btn btn-primary mb-2 mr-2"
              onClick={this.handleSubmit}
            >
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
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    isLoadingPost: state.kategoriReducer.isLoadingPost,
    isError: state.kategoriReducer.isError,
  };
};
export default connect(mapStateToProps)(FormTipePaket);
