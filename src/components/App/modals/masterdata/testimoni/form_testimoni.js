import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { compareObjectResAndState, ToastQ } from "../../../../../helper";
import File64 from "../../../../common/File64";
import {
  postTestimoni,
  putTestimoni,
} from "../../../../../redux/actions/masterdata/testimoni.action";

const myState = {
  title: "",
  caption: "",
  rating: "",
  photo: "-",
};

class FormTestimoni extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.state = myState;
  }

  clearState() {
    this.setState(myState);
  }
  getProps(props) {
    let state = {};
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
  handleChangeImage(files) {
    if (files.status === "success") {
      this.setState({
        photo: files.base64,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let state = this.state;
    let keyState = Object.keys(state);

    if (state.photo.includes("http")) {
      state.photo = "-";
    }

    for (let i = 0; i < keyState.length; i++) {
      if (state[keyState[i]] === "") {
        ToastQ.fire({
          icon: "error",
          title: `${keyState[i]} tidak boleh kosong`,
        });
        return;
      }
    }
    if (state.rating > 5) {
      ToastQ.fire({
        icon: "error",
        title: `Rating Maksimal 5`,
      });
      return;
    }
    if (this.props.detail.id === "") {
      this.props.dispatch(postTestimoni(state, this.props.detail.where));
    } else {
      this.props.dispatch(putTestimoni(state, this.props.detail));
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
        isOpen={this.props.isOpen && this.props.type === "formTestimoni"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id !== "" ? `Ubah Testimoni` : `Tambah Testimoni`}
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
            <label>Rating</label>
            <input
              type="number"
              className="form-control"
              name="rating"
              value={this.state.rating}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label>Catatan</label>
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
  };
};

export default connect(mapStateToProps)(FormTestimoni);
