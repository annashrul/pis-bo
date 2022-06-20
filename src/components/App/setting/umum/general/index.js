import React, { Component } from "react";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton";
import {
  getSiteAlokasi,
  putSiteAlokasi,
  putSiteGeneral,
  updateGeneral,
} from "../../../../../redux/actions/setting/general.action";
import Switch from "react-switch";
import { filterObject, rmComma, toRp } from "../../../../../helper";
import { getPaket } from "../../../../../redux/actions/masterdata/paket.action";
import Select from "react-select";
import { getGeneralBank } from "../../../../../redux/actions/masterdata/bank.action";

const myState = {
  min_wd: "",
  min_dp: "",
  charge_wd: "",
  bank_admin: "",
  wa_admin: "",
  msg_bonus: "",
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = myState;
    this.handleChange = this.handleChange.bind(this);
    this.handleBtnSubmit = this.handleBtnSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(state, val) {
    this.setState({
      [state]: val.value,
    });
  }
  getProps(props) {
    if (props.res_general.length === undefined) {
      let state = {};
      Object.keys(props.res_general).map((val) => {
        Object.assign(state, { [val]: props.res_general[val] });
      });
      this.setState(state);
    }
  }

  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
    // this.props.dispatch(getGeneralBank());
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  handleBtnSubmit = (event, names) => {
    event.preventDefault();
    const justStrings = filterObject(this.state);
    this.props.dispatch(putSiteGeneral(justStrings));
    console.log(justStrings);
  };

  handleChange = (event, e = null) => {
    this.setState({ [event.target.name]: rmComma(event.target.value) });
  };

  render() {
    return (
      <div className="card bg-transparent">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Minimal Penarikan</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="min_wd"
                  className="form-control"
                  value={toRp(parseFloat(this.state.min_wd))}
                />
              </div>
              <div className="form-group">
                <label>Charge Penarikan</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="charge_wd"
                  className="form-control"
                  value={toRp(parseFloat(this.state.charge_wd))}
                />
              </div>
              <div className="form-group">
                <label>Minimal Deposit</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="min_dp"
                  className="form-control"
                  value={toRp(parseFloat(this.state.min_dp))}
                />
              </div>
              <div className="form-group">
                <label>Bank Admin</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="bank_admin"
                  className="form-control"
                  value={toRp(parseFloat(this.state.bank_admin))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>No Whatsapp Admin</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="wa_admin"
                  className="form-control"
                  value={this.state.wa_admin}
                />
              </div>
              <div className="form-group">
                <label>Pesan Bonus</label>
                <textarea
                  style={{ height: "152px" }}
                  onChange={this.handleChange}
                  name="msg_bonus"
                  className="form-control"
                  defaultValue={this.state.msg_bonus}
                />
              </div>
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
    isLoading: state.generalReducer.isLoadingGeneral,
    isOpen: state.modalReducer,
    // dataBank: state.bankReducer.data,
  };
};

export default connect(mapStateToProps)(Index);
