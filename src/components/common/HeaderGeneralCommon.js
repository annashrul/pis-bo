import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
// import { CURRENT_DATE, dateRange, getStorage, setStorage, toDate, isEmptyOrUndefined } from "../../../../helper";
import SelectCommon from "./SelectCommon";
import {
  CURRENT_DATE,
  dateRange,
  getStorage,
  isEmptyOrUndefined,
  rmStorage,
  setStorage,
  toDate,
} from "../../helper";

/**
 * callbackGet => void
 * callbackAdd => void
 */
class HeaderGeneralCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      any: "",
      column: "",
      dateFrom: CURRENT_DATE,
      dateTo: CURRENT_DATE,
      other: "",
      column_data: [],
      other_data: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getProps(props) {
    let state = {};
    if (props.columnData !== undefined && props.columnData.length > 0) {
      Object.assign(state, { column_data: props.columnData });
      setStorage(
        `columnStorage${this.props.pathName}`,
        props.columnData[0].value
      );
    }
    if (props.otherData !== undefined && props.otherData.length > 0) {
      Object.assign(state, { other_data: props.otherData });
      // setStorage(`otherStorage${this.props.pathName}`, props.otherData[0].value);
      // this.handleSelect("other_data", props.otherData[0]);
    }

    this.handleService();
    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
  }

  handleService() {
    let props = this.props;
    let path = props.pathName;
    let getDateFrom = getStorage(`dateFromStorage${path}`);
    let getDateTo = getStorage(`dateToStorage${path}`);
    let getColumn = getStorage(`columnStorage${path}`);
    let getAny = getStorage(`anyStorage${path}`);
    let getOther = props.isOther
      ? getStorage(`${props.otherState}Storage${path}`)
      : "";
    let where = ``;
    let state = {};

    if (props.isPeriode) {
      if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
        where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
        Object.assign(state, { dateFrom: getDateFrom, dateTo: getDateTo });
      } else {
        where += `&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
      }
    }
    if (this.props.isOther) {
      if (isEmptyOrUndefined(getOther)) {
        where += `&${props.otherState}=${getOther}`;
        Object.assign(state, { other: getOther });
      }
    }

    if (isEmptyOrUndefined(getColumn)) {
      Object.assign(state, { column: getColumn });
      where += `&search_by=${getColumn}`;
    }

    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getColumn === "kd_trx" ? btoa(getAny) : getAny}`;
      Object.assign(state, { any: getAny });
    }

    this.setState(state);
    this.props.callbackGet(where);
  }

  handleSearch(e) {
    e.preventDefault();
    setStorage(`anyStorage${this.props.pathName}`, this.state.any);
    this.handleService();
    // this.props.callbackGet(e.target.value);
  }

  handleChange(e) {
    let val = e.target.value;
    if (val === "") {
      rmStorage(`anyStorage${this.props.pathName}`);
      this.handleService();
    }
    this.setState({ any: e.target.value });
  }
  handleSelect(state, res) {
    console.log(state, res.value);
    this.setState({ [state]: res.value });
    if (this.props.isOther) {
      if (state === this.props.otherState)
        setStorage(`${state}Storage${this.props.pathName}`, res.value);
      this.setState({ other: res.value });
    }

    if (state === "column")
      setStorage(`columnStorage${this.props.pathName}`, res.value);
    this.handleService();
  }

  render() {
    let props = this.props;
    let col = "col-md-3";
    if (this.props.col) {
      col = this.props.col;
    }
    const { dateFrom, dateTo, column, any, column_data, other_data, other } =
      this.state;

    return (
      <div className="row mb-10">
        {props.isPeriode && (
          <div className={`col-6 col-xs-6 ${col}`}>
            {dateRange(
              (first, last, isActive) => {
                setStorage(
                  `activeDateRangePickerStorage${props.pathName}`,
                  isActive
                );
                setStorage(`dateFromStorage${props.pathName}`, first);
                setStorage(`dateToStorage${props.pathName}`, last);
                this.handleService();
              },
              `${toDate(dateFrom)} - ${toDate(dateTo)}`,
              getStorage(`activeDateRangePickerStorage${props.pathName}`)
            )}
          </div>
        )}
        {this.props.isOther && (
          <div className={`col-6 col-xs-6 ${col}`}>
            <SelectCommon
              label={this.props.otherName}
              options={other_data}
              callback={(res) => this.handleSelect(this.props.otherState, res)}
              dataEdit={other}
            />
          </div>
        )}
        {props.isColumn ? (
          <div className={`col-6 col-xs-6 ${col}`}>
            <SelectCommon
              label="Kolom"
              options={column_data}
              callback={(res) => this.handleSelect("column", res)}
              dataEdit={column}
            />
          </div>
        ) : null}

        <div className={`col-12 col-xs-12 ${col}`}>
          {this.props.callbackSearch === "hide" ? "" : <label>Cari</label>}
          <div className="input-group">
            {this.props.callbackSearch === "hide" ? (
              ""
            ) : (
              <input
                type="search"
                name="any"
                className="form-control"
                placeholder="tulis sesuatu disini"
                value={any}
                onChange={this.handleChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.handleSearch(e);
                }}
              />
            )}
            <span className="input-group-append">
              {this.props.callbackSearch === "hide" ? (
                ""
              ) : (
                <button
                  type="button"
                  className={`btn btn-primary ${
                    this.props.callbackExport === undefined && "mr-2"
                  }`}
                  onClick={this.handleSearch}
                >
                  <i className="fa fa-search" />
                </button>
              )}
              {this.props.callbackAdd && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.callbackAdd();
                  }}
                  className={`btn btn-primary`}
                >
                  {this.props.callbackAddText === "" ||
                  this.props.callbackAddText === null ||
                  this.props.callbackAddText === undefined
                    ? ""
                    : this.props.callbackAddText}{" "}
                  <i className="fa fa-plus" />
                </button>
              )}
              {this.props.callbackExport && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.callbackExport();
                  }}
                  className="btn btn-primary mr-2"
                >
                  <i className="fa fa-print" />
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(HeaderGeneralCommon);
