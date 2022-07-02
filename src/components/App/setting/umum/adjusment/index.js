import React, { Component } from "react";
import { connect } from "react-redux";
import { storeAdjusment } from "../../../../../redux/actions/setting/general.action";
import { filterObject, rmComma, toRp } from "../../../../../helper";

const myState = {
  trx_in: "0",
  trx_out: "0",
  note: "",
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

  handleBtnSubmit = (event, names) => {
    event.preventDefault();
    const justStrings = filterObject(this.state);
    this.props.dispatch(storeAdjusment(justStrings));
    console.log(justStrings);
  };

  handleChange = (event, e = null) => {
    let col = event.target.name;
    let val = event.target.value;
    this.setState({ [col]: col !== "note" ? rmComma(val) : val });
    if (col === "trx_in") {
      if (rmComma(this.state.trx_out) !== "0") {
        this.setState({
          trx_out: "0",
          trx_in: val,
        });
      }
    }
    if (col === "trx_out") {
      if (rmComma(this.state.trx_in) !== "0") {
        this.setState({
          trx_out: val,
          trx_in: "0",
        });
      }
    }
  };

  render() {
    return (
      <div className="card bg-transparent">
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-xs-12 col-md-6">
              <div className="form-group">
                <label>Transaksi Masuk</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="trx_in"
                  className="form-control"
                  value={toRp(parseFloat(this.state.trx_in))}
                />
              </div>
              <div className="form-group">
                <label>Transaksi Keluar</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="trx_out"
                  className="form-control"
                  value={toRp(parseFloat(this.state.trx_out))}
                />
              </div>
              <div className="form-group">
                <label>Catatan</label>
                <textarea
                  onChange={this.handleChange}
                  name="note"
                  className="form-control"
                  value={this.state.note}
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
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(Index);
