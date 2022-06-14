import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { convertBase64, isEmptyOrUndefined, ToastQ, toRp, rmComma } from "../../../../../helper";
import { postReward, putReward } from "../../../../../redux/actions/masterdata/reward/reward.action";
import SelectCommon from "../../../../common/SelectCommon";

class FormReward extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      title: "",
      gambar: "-",
      poin_kiri: "",
      poin_kanan: "",
      caption: "-",
      kategori: "",
      kategori_data: [],
    };
  }
  getProps(props) {
    if (props.detail.id !== "") {
      this.setState({
        title: props.detail.val.title,
        poin_kiri: props.detail.val.poin_kiri,
        poin_kanan: props.detail.val.poin_kanan,
        caption: props.detail.val.caption,
        kategori: props.detail.val.id_membership,
      });
    }
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
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  handleChange = async (event) => {
    let col = event.target.name;
    let val = event.target.value;
    if (col === "gambar") {
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      this.setState({ gambar: base64 });
      return;
    }
    this.setState({ [col]: val });
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let poinKiri = rmComma(`${state.poin_kiri}`);
    let poinKanan = rmComma(`${state.poin_kanan}`);
    let parsedata = { title: state.title, caption: state.caption, gambar: state.gambar, poin_kiri: poinKiri, poin_kanan: poinKanan, id_membership: state.kategori };
    
    if (!isEmptyOrUndefined(state.kategori)) {
      ToastQ.fire({ icon: "error", title: `Membership belum dipilih!` });
      return;
    }
    if (!isEmptyOrUndefined(state.title)) {
      ToastQ.fire({ icon: "error", title: `title tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(poinKiri)) {
      ToastQ.fire({ icon: "error", title: `poin kiri tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(poinKanan)) {
      ToastQ.fire({ icon: "error", title: `poin kanan tidak boleh kosong` });
      return;
    }
    if (this.props.detail.id !== "") {
      this.props.dispatch(putReward(parsedata, this.props.detail));
    } else {
      this.props.dispatch(postReward(parsedata, this.props.detail.where));
    }
  }

  handleSelect(col, res) {
    this.setState({ [col]: res.value });
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formReward"} size="md">
        <ModalHeader toggle={this.toggle}>{this.props.detail.id !== "" ? "Ubah" : "Tambah"} reward</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <SelectCommon label="Membership" options={this.state.kategori_data} dataEdit={this.state.kategori} callback={(res) => this.handleSelect("kategori", res)} />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className={"form-control"} name={"title"} value={this.state.title} onChange={this.handleChange} />
              </div>
              <div className="form-group">
                <label>
                  Gambar <small className="text-danger">{this.props.detail.id !== "" && "kosongkan bila tidak akan diubah"}</small>
                </label>
                <input type="file" className={"form-control"} name={"gambar"} onChange={this.handleChange} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Poin kiri</label>
                    <input type="text" className={"form-control"} name={"poin_kiri"} value={toRp(this.state.poin_kiri)} onChange={this.handleChange} />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Poin kanan</label>
                    <input type="text" className={"form-control"} name={"poin_kanan"} value={toRp(this.state.poin_kanan)} onChange={this.handleChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <label>Caption</label>
                <textarea name="caption" className="form-control" value={this.state.caption} style={{ height: "122px" }} onChange={this.handleChange} />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="form-group" style={{ textAlign: "right" }}>
            <button style={{ color: "white" }} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
              <i className="ti-close" />
              Keluar
            </button>
            <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit}>
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
    kategori: state.kategoriBinaryReducer.data,
  };
};
export default connect(mapStateToProps)(FormReward);
