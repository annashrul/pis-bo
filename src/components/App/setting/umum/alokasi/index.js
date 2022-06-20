import React, { Component } from "react";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton";
import {
  getSiteAlokasi,
  putSiteAlokasi,
  updateGeneral,
} from "../../../../../redux/actions/setting/general.action";
import Switch from "react-switch";
import { filterObject, rmComma, toRp } from "../../../../../helper";
import { getPaket } from "../../../../../redux/actions/masterdata/paket.action";
import Select from "react-select";

const myState = {
  aktivasi: "0",
  sponsor_aktivasi: "0",
  sponsor_ro: "0",
  nasional_aktivasi: "0",
  nasional_ro: "0",
  barang_regist: "51c8c057-aa6b-4d89-8bcd-d2aeeacfa08a",
  limit_bonus: "0",
  data_paket: [],
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = myState;
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBtnSubmit = this.handleBtnSubmit.bind(this);
  }
  handleSelect(state, val) {
    this.setState({
      [state]: val.value,
    });
  }
  getProps(props) {
    if (props.res_alokasi.length === undefined) {
      if (props.dataPaket !== undefined) {
        if (props.dataPaket.length > 0) {
          let dataPaket = [];
          props.dataPaket.forEach((v, i) => {
            dataPaket.push({ value: v.id, label: v.title });
            return;
          });
          this.setState({ data_paket: dataPaket });
        }
      }

      let state = {};
      Object.keys(props.res_alokasi).map((val) => {
        Object.assign(state, { [val]: props.res_alokasi[val] });
      });
      this.setState(state);
      console.log(state);
    }
  }

  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
    this.props.dispatch(getPaket());
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  handleBtnSubmit = (event, names) => {
    event.preventDefault();
    const justStrings = filterObject(this.state);
    this.props.dispatch(putSiteAlokasi(justStrings));
    console.log(justStrings);
  };

  handleChange = (event, e = null) => {
    this.setState({ [event.target.name]: rmComma(event.target.value) });
  };

  render() {
    console.log(this.props.dataPaket);
    return (
      <div className="card bg-transparent">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Aktivasi</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="aktivasi"
                  className="form-control"
                  value={toRp(parseFloat(this.state.aktivasi))}
                />
              </div>
              <div className="form-group">
                <label>Sponsor Aktivasi</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="sponsor_aktivasi"
                  className="form-control"
                  value={toRp(parseFloat(this.state.sponsor_aktivasi))}
                />
              </div>
              <div className="form-group">
                <label>Nasional Aktivasi</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="nasional_aktivasi"
                  className="form-control"
                  value={toRp(parseFloat(this.state.nasional_aktivasi))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Sponsor RO</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="sponsor_ro"
                  className="form-control"
                  value={toRp(parseFloat(this.state.sponsor_ro))}
                />
              </div>
              <div className="form-group">
                <label>Nasional RO</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="nasional_ro"
                  className="form-control"
                  value={toRp(parseFloat(this.state.nasional_ro))}
                />
              </div>
              <div className="form-group">
                <label>Limit Bonus</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="limit_bonus"
                  className="form-control"
                  value={toRp(parseFloat(this.state.limit_bonus))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Barang Regist</label>
                {
                  <Select
                    options={this.state.data_paket}
                    placeholder="==== Pilih ===="
                    onChange={(e) => this.handleSelect("barang_regist", e)}
                    value={this.state.data_paket.find((op) => {
                      return op.value === this.state.barang_regist;
                    })}
                  />
                }
              </div>
            </div>
            <div className="col-md-6" style={{ marginTop: "30px" }}>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-md"
                  onClick={this.handleBtnSubmit}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.generalReducer.isLoadingAlokasi,
    dataPaket: state.paketReducer.data,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(Index);
