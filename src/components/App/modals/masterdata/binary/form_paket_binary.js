import React, { Component } from "react";
import { connect } from "react-redux";
import WrapperModal from "../../_wrapper.modal";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalToggle } from "../../../../../redux/actions/modal.action";
import { convertBase64, generateNo, isEmptyOrUndefined, noData, rmComma, ToastQ, toCurrency, toRp } from "../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import { fetchBarangBinary } from "../../../../../redux/actions/masterdata/binary/barang_binary.action";

import SelectCommon from "../../../../common/SelectCommon";
import { postPaketBinary, putPaketBinary } from "../../../../../redux/actions/masterdata/binary/paket_binary.action";
class FormPaketBinary extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      title: "",
      status: "1",
      harga: 0,
      category: "",
      point_volume: "0",
      deskripsi: "-",
      type: "0",
      foto: "-",
      ppn: "0",
      where: "",
      any: "",
      page: 10,
      conversi_poin: 0,
      total_poin: 0,
      status_data: [
        { value: "0", label: "Tidak aktif" },
        { value: "1", label: "Aktif" },
      ],
      barang_data: [],
      detail: [],
      category_data: [],
      isModalKategori: false,
    };
  }
  getProps(param) {
    let barang = [];
    let kategori = [];
    let toPoin = 0;
    if (typeof param.barang.data === "object") {
      if (param.barang.data.length > 0) {
        for (let i = 0; i < param.barang.data.length; i++) {
          barang.push({
            checked: false,
            qty: "0",
            id: param.barang.data[i].id,
            title: param.barang.data[i].title,
            bonus: "0",
            harga: param.barang.data[i].harga,
          });
        }
      } else {
        barang = [];
      }
    } else {
      barang = [];
    }

    if (typeof param.kategori.data === "object") {
      if (param.kategori.data.length > 0) {
        param.kategori.data.map((res) => {
          kategori.push({
            value: res.id,
            label: res.title,
          });
          return null;
        });
      }
    }

    if (param.config.konversi_poin !== undefined) {
      toPoin = parseInt(param.config.konversi_poin, 10);
    }

    if (param.detail.id !== "") {
      if (param.paketDetail.detail !== undefined) {
        if (param.paketDetail.detail.length > 0) {
          let valDetail = [];
          for (let x = 0; x < param.paketDetail.detail.length; x++) {
            valDetail.push({
              checked: param.paketDetail.detail[x].isbonus === 1,
              qty: param.paketDetail.detail[x].qty,
              id: param.paketDetail.detail[x].id_barang,
              title: param.paketDetail.detail[x].barang,
              bonus: param.paketDetail.detail[x].isbonus,
              harga: param.paketDetail.detail[x].harga,
            });
          }
          this.setState({ detail: valDetail });
        }
      }
      // const checkStatus = this.state.status_data.filter((res) => parseInt(res.value, 10) === param.paketDetail.status);
      // if (checkStatus.length > 0) this.handleSelect("status", checkStatus[0]);
      // this.handleSelect("category", { value: param.paketDetail.id_kategori, label: param.paketDetail.kategori });
      this.setState({
        category: param.paketDetail.id_kategori,
        status: `${param.paketDetail.status}`,
        title: param.paketDetail.title,
        harga: parseFloat(param.paketDetail.harga),
        deskripsi: param.paketDetail.deskripsi,
        foto: "-",
        point_volume: param.paketDetail.point_volume,
        total_poin: isNaN(parseInt(param.paketDetail.harga, 10) / this.state.conversi_poin) ? 0 : parseInt(param.paketDetail.harga, 10) / this.state.conversi_poin,
      });
    }

    this.setState({
      barang_data: barang,
      conversi_poin: toPoin,
      category_data: kategori,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentDidMount() {
    this.getProps(this.props);
  }

  handleChange = async (event) => {
    if (event.target.name === "foto") {
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      this.setState({ foto: base64 });
    } else if (event.target.name === "harga") {
      this.setState({ harga: event.target.value, total_poin: parseInt(rmComma(event.target.value), 10) / this.state.conversi_poin });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleAddBarang(e, i) {
    e.preventDefault();
    let data = this.state.detail;
    let hrg = parseInt(this.state.harga, 10);
    hrg = hrg + parseInt(this.state.barang_data[i].harga, 10);
    if (data.length > 0) {
      for (let x = 0; x < data.length; x++) {
        if (data[x].id === this.state.barang_data[i].id) {
          Object.assign(data[x], { qty: parseInt(data[x].qty, 10) + 1 });
          this.setState({ detail: data, harga: hrg });
          return;
        }
      }
    }

    data.push({
      uniq: Math.random(),
      checked: false,
      qty: "1",
      id: this.state.barang_data[i].id,
      title: this.state.barang_data[i].title,
      bonus: "0",
      harga: this.state.barang_data[i].harga,
    });
    this.setState({ detail: data, harga: hrg, total_poin: hrg / this.state.conversi_poin });
  }

  handleGetDataBarang() {
    let where = `page=1&perpage=${this.state.page}`;
    let val = this.state.any;
    if (val !== "") {
      where += `&search_by=title&q=${val}`;
    }
    setTimeout(() => this.props.dispatch(fetchBarangBinary(where)), 300);
  }
  handleSearch(e) {
    e.preventDefault();
    this.setState({ any: e.target.value });
    setTimeout(() => this.handleGetDataBarang(), 300);
  }
  handleChangeDynamic(e, i) {
    let column = e.target.name;
    let value = e.target.value;
    let checked = e.target.checked;
    let hrg = parseInt(this.state.harga, 10);
    let detail = [...this.state.detail];
    if (column === "checked") {
      detail[i] = { ...detail[i], [column]: checked };
      if (detail[i].checked === true) {
        hrg = hrg - parseInt(detail[i].harga, 10);
      } else {
        hrg = hrg + parseInt(detail[i].harga, 10);
      }
      this.setState({ detail: detail, harga: hrg, total_poin: hrg / this.state.conversi_poin });
    } else {
      detail[i] = { ...detail[i], [column]: value };
      this.setState({ detail: detail, harga: hrg, total_poin: hrg / this.state.conversi_poin });
    }
  }
  removeItemOnce(arr, value) {
    let someArray = arr;
    let arrayToRemove = value;
    return someArray.filter((e) => e.uniq !== arrayToRemove.uniq);
  }
  handleRemove(e, i, u) {
    let detail = this.state.detail[i];
    if (u === detail.uniq) {
      let someArray = this.removeItemOnce(this.state.detail, detail);
      let hrg = parseInt(this.state.harga, 10);
      hrg = hrg - parseInt(detail.harga, 10);
      this.setState({
        detail: someArray,
        harga: this.state.detail.length > 0 ? hrg : 0,
        total_poin: this.state.detail.length > 0 ? hrg / this.state.conversi_poin : "0",
      });
    }
  }

  handleSelect(col, val) {
    this.setState({ [col]: val.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let detail = [];
    let parseData = {};
    parseData["title"] = this.state.title;
    parseData["harga"] = rmComma(`${this.state.harga}`);
    parseData["deskripsi"] = this.state.deskripsi;
    parseData["id_kategori"] = this.state.category;
    parseData["status"] = this.state.status;
    parseData["point_volume"] = 0;
    parseData["type"] = 0;
    parseData["foto"] = this.state.foto;
    if (this.state.detail.length < 1) {
      ToastQ.fire({ icon: "error", title: `belum ada barang yang dipilih` });
      return;
    }
    for (let i = 0; i < this.state.detail.length; i++) {
      let qty = rmComma(`${this.state.detail[i].qty}`);
      if (qty === "" || qty === "0") {
        ToastQ.fire({
          icon: "error",
          title: `qty ${this.state.detail[i].title} harus lebih dari nol`,
        });
        return;
      }
      detail.push({
        id_barang: this.state.detail[i].id,
        qty: qty,
        isbonus: this.state.detail[i].checked === true ? 1 : 0,
      });
    }
    if (!isEmptyOrUndefined(parseData["title"])) {
      ToastQ.fire({ icon: "error", title: `nama paket tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["id_kategori"])) {
      ToastQ.fire({ icon: "error", title: `kategori tidak boleh kosong` });
      return;
    }
    if (!isEmptyOrUndefined(parseData["harga"])) {
      ToastQ.fire({ icon: "error", title: `harga tidak boleh kosong` });
      return;
    }

    // if (!isEmptyOrUndefined(parseData["point_volume"])) {
    //   ToastQ.fire({ icon: "error", title: `PV tidak boleh kosong` });
    //   return;
    // }
    parseData["detail"] = detail;
    if (this.props.detail.id === "") {
      this.props.dispatch(postPaketBinary(parseData, this.props.detail.where));
    } else {
      this.props.dispatch(putPaketBinary(parseData, this.props.detail));
    }
  }

  render() {
    const { total, current_page } = this.props.barang;
    const { barang_data, detail, status_data, status, title, deskripsi, harga, point_volume, ppn, total_poin, category_data, category } = this.state;
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPaketBinary"} size="lg" className="custom-map-modal">
          <ModalHeader toggle={this.toggle}>{this.props.detail.id !== "" ? "Ubah" : "Tambah"} Paket</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      name="any"
                      placeholder={"cari berdasarkan nama barang"}
                      value={this.state.any}
                      onChange={this.handleChange}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          this.handleSearch(event);
                        }
                      }}
                    />
                    <div className="input-group-prepend">
                      <button className="btn btn-primary" onClick={(event) => this.handleSearch(event)}>
                        <i className="fa fa-search" />
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={(event) => {
                          this.setState({ page: this.state.page + 10 });
                          if (this.state.page < total) {
                            setTimeout(() => this.handleGetDataBarang(), 300);
                          } else {
                            ToastQ.fire({ icon: "error", title: `data tidak tersedia` });
                            return;
                          }
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        <i className="fa fa-refresh" />
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "150px",
                    maxHeight: "100%",
                    overflow: "auto",
                  }}
                >
                  {barang_data.length > 0
                    ? barang_data.map((v, i) => {
                        let icon = "fa-close";
                        let color = "transparent";
                        this.state.detail.map((x, y) => {
                          if (v.id === x.id) {
                            icon = "fa-check";
                            color = "white";
                          }
                          return null;
                        });
                        return (
                          <table key={i} className="w-full pointer" onClick={(e) => this.handleAddBarang(e, i)} style={{ width: "100%", borderBottom: "1px solid gray" }}>
                            <tbody>
                              <tr>
                                <td className="middle nowrap text-white ">
                                  {v.title} <br />
                                  <small className="poin">{toCurrency(v.harga)}</small>
                                </td>
                                <td className="middle nowrap text-right mr-10">
                                  <i className={`fa ${icon}`} style={{ color: color }} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        );
                      })
                    : noData(2)}
                </div>
              </div>
              <div className="col-md-4">
                <TableCommon
                  head={[{ label: "no", width: "1%" }, { label: "barang" }, { label: "Qty" }, { label: "#", width: "1%" }]}
                  renderRow={
                    detail.length > 0
                      ? detail.map((v, i) => {
                          let errQty = "";
                          if (v.qty < 1) {
                            errQty = "qty tidak boleh kosong";
                          }
                          return (
                            <tr key={i} className="pointer">
                              <td className="middle nowrap">{generateNo(i, current_page)}</td>
                              <td className="middle nowrap">
                                {v.title} <br />
                                <small className="poin">{toCurrency(v.harga)}</small>
                              </td>
                              {/* <td className="middle nowrap text-center">
                                <input type="checkbox" name="checked" checked={v.checked} onChange={(e) => this.handleChangeDynamic(e, i)} />
                              </td> */}
                              <td className="middle nowrap">
                                <input type="text" name="qty" className="form-control intable text-right" value={toRp(v.qty)} onChange={(e) => this.handleChangeDynamic(e, i)} />
                                {<small style={{ color: "red", fontWeight: "bold" }}>{errQty}</small>}
                              </td>
                              <td className="middle nowrap text-right mr-10">
                                <button className="btn btn-primary btn-sm" onClick={(e) => this.handleRemove(e, i, v.uniq)}>
                                  <i className={`fa fa-close`} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      : noData(4)
                  }
                />
              </div>
              <div className="col-md-5">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Nama paket</label>
                      <input type="text" name="title" className="form-control" value={title} onChange={this.handleChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <SelectCommon label="Kategori" options={category_data} callback={(res) => this.handleSelect("category", res)} dataEdit={category} />
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="row">
                        <span className="col-md-8 text-left" style={{ float: "left" }}>
                          Harga
                        </span>
                        <small className="col-md-4 text-right" style={{ float: "right" }}>
                          poin
                        </small>
                      </label>
                      <input type="text" name="harga" value={(harga)} onChange={this.handleChange} className="form-control" />
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label className="row">
                        <span className="col-md-8 text-left" style={{ float: "left" }}>
                          Harga
                        </span>
                        <small className="col-md-4 text-right" style={{ float: "right" }}>
                          poin
                        </small>
                      </label>
                      <input type="text" name="total_poin" className="form-control" value={total_poin > 0 ? toCurrency(total_poin) : "0 Poin"} readOnly={true} />
                    </div>
                  </div> */}
                  <div className="col-md-6" style={{"display":"none"}}>
                    <div className="form-group">
                      <label>Poin volume</label>
                      <input type="text" name="point_volume" className="form-control" value={toRp(point_volume)} onChange={this.handleChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <SelectCommon label="Status" options={status_data} callback={(res) => this.handleSelect("status", res)} dataEdit={status} />
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Ppn</label>
                          <input type="text" name="ppn" className="form-control" value={toRp(ppn)} onChange={this.handleChange} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Gambar</label>
                          <input type="file" name="foto" className="form-control" onChange={this.handleChange} accept="image/*" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Deskripsi</label>
                      <textarea className="form-control" name="deskripsi" value={deskripsi} onChange={this.handleChange} style={{ height: "124px" }} />
                    </div>
                  </div>
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
              <button type="submit" className="btn btn-primary mb-2" onClick={this.handleSubmit}>
                <i className="ti-save" />
                Simpan
              </button>
            </div>
          </ModalFooter>
        </WrapperModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    barang: state.barangBinaryReducer.data,
    paketDetail: state.paketBinaryReducer.detail,
    kategori: state.kategoriBinaryReducer.data,
    config: state.generalReducer.data,
  };
};
export default connect(mapStateToProps)(FormPaketBinary);
