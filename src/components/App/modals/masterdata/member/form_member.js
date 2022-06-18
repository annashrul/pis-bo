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

const myState = {
  title: "",
  caption: "",
  price: "",
  stock: "",
  status: "1",
  gambar: "-",
  id_category: "",
  category_data: [],
  status_data: [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
  ],
};

class FormMember extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    let state = {};
    if (props.dataCategory !== undefined) {
      if (props.dataCategory.length > 0) {
        let data = [];
        props.dataCategory.forEach((v, i) => {
          data.push({ value: v.id, label: v.title });
        });
        Object.assign(state, { category_data: data });
      }
    }
    if (props.detail.id !== "") {
      props.detail.val.status = `${props.detail.val.status}`.toString();
      props.detail.val.gambar = "-";
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
  handleChangeImage(files) {
    if (files.status === "success") {
      this.setState({
        gambar: files.base64,
      });
    }
  }

  handleSelect(col, val) {
    this.setState({ [col]: val.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    state.stock = rmComma(state.stock);
    state.price = rmComma(state.price);
    let keyState = Object.keys(state);
    for (let i = 0; i < keyState.length; i++) {
      if (state[keyState[i]] === "") {
        ToastQ.fire({
          icon: "error",
          title: `${keyState[i]} tidak boleh kosong`,
        });
        return;
      }
    }
    delete state.status_data;
    delete state.category_data;
    if (this.props.detail.id === "") {
      this.props.dispatch(postPaket(state, this.props.detail.where));
    } else {
      this.props.dispatch(putPaket(state, this.props.detail));
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
        isOpen={this.props.isOpen && this.props.type === "formMember"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? `Ubah Member` : `Tambah Member`}
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Stok</label>
            <input
              type="text"
              className="form-control"
              name="stock"
              value={toRp(this.state.stock)}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Harga</label>
            <input
              type="text"
              className="form-control"
              name="price"
              value={toRp(this.state.price)}
              onChange={this.handleChange}
            />
          </div>
          <SelectCommon
            label="Kategori"
            options={this.state.category_data}
            dataEdit={this.state.id_category}
            callback={(res) => this.handleSelect("id_category", res)}
          />
          <SelectCommon
            label="Status"
            options={this.state.status_data}
            dataEdit={this.state.status}
            callback={(res) => this.handleSelect("status", res)}
          />
          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              className="form-control"
              name="caption"
              onChange={this.handleChange}
              defaultValue={this.state.caption}
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
    dataCategory: state.kategoriPaketReducer.data,
  };
};

export default connect(mapStateToProps)(FormMember);
