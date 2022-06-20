import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import Cards from "./src/Cards";
import Default from "assets/default.png";
import { imgDefault, isEmptyOrUndefined, toCurrency } from "../../../helper";
import { getDashboard } from "../../../redux/actions/dashboard/dashboard.action";
import helper from "../../../helper";
//
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_member: "0",
      saldo_bonus_member: "0",
      saldo_nasional_member: "0",
      total_wd: "0",
      omset_nasional: "700000",
    };
  }

  componentWillReceiveProps = (nextProps) => {
    console.log("props", nextProps);
  };

  componentWillMount() {
    this.props.dispatch(getDashboard());
  }

  render() {
    const { data } = this.props;
    return (
      <Layout page="Dashboard">
        <div className="row align-items-center">
          <div className="col-md-12" style={{ zoom: "90%" }}>
            <div className="row">
              <Cards
                classCols="col-md-6 col-xl-12 box-margin"
                title="TOTAL MEMBER"
                data={toCurrency(
                  isNaN(data.total_member)
                    ? 0
                    : parseFloat(data.total_member).toFixed(0),
                  false
                )}
                icon="fa fa-users text-white"
              />
              <Cards
                classCols="col-md-6 col-xl-3 box-margin"
                title="SALDO BONUS MEMBER"
                data={toCurrency(
                  isNaN(data.saldo_bonus_member)
                    ? 0
                    : parseFloat(data.saldo_bonus_member).toFixed(0)
                )}
                icon="fa fa-money text-white"
              />
              <Cards
                classCols="col-md-6 col-xl-3 box-margin"
                title="SALDO NASIONAL MEMBER"
                data={toCurrency(
                  isNaN(data.saldo_nasional_member)
                    ? 0
                    : parseFloat(data.saldo_nasional_member).toFixed(0)
                )}
                icon="fa fa-money text-white"
              />
              <Cards
                classCols="col-md-6 col-xl-3 box-margin"
                title="TOTAL PENARIKAN"
                data={toCurrency(
                  isNaN(data.total_wd)
                    ? 0
                    : parseFloat(data.total_wd).toFixed(0)
                )}
                icon="fa fa-money text-white"
              />
              <Cards
                classCols="col-md-6 col-xl-3 box-margin"
                title="OMSET NASIONAL"
                data={toCurrency(
                  isNaN(data.omset_nasional)
                    ? 0
                    : parseFloat(data.omset_nasional).toFixed(0)
                )}
                icon="fa fa-money text-white"
              />
            </div>
            {/* Dashboard Widget Area */}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-xs-12 col-md-6 col-xl-6 box-margin">
            <div className="bgWithOpacity">
              <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 text-white">LIST MEMBER BARU</h5>
              </div>
              <div
                className="card-body"
                style={{ overflowX: "auto", height: "300px" }}
              >
                <ul className="total-earnings-list">
                  {data.list_member_baru && data.list_member_baru.length > 0
                    ? data.list_member_baru.map((item, i) => (
                        <li key={i}>
                          <div className="author-info d-flex align-items-center">
                            <div className="author-img mr-3">
                              <img
                                style={{ height: "40px" }}
                                src={item.foto}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${imgDefault}`;
                                }}
                                alt={item.fullname}
                              />
                            </div>
                            <div className="author-text">
                              <h6 className="mb-0 text-light">
                                {item.fullname}
                              </h6>
                            </div>
                          </div>
                        </li>
                      ))
                    : ""}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-xs-12 col-md-6 col-xl-6 box-margin">
            <div className="bgWithOpacity">
              <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 text-white">
                  LIST SPONSOR TERBANYAK
                </h5>
              </div>
              <div
                className="card-body"
                style={{ overflowX: "auto", height: "300px" }}
              >
                <ul className="total-earnings-list">
                  {data.list_sponsor_terbanyak &&
                  data.list_sponsor_terbanyak.length > 0
                    ? data.list_sponsor_terbanyak.map((item, i) => (
                        <li key={i}>
                          <div className="author-info d-flex align-items-center">
                            <div className="author-img mr-3">
                              <img
                                style={{ height: "40px" }}
                                src={item.foto}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${Default}`;
                                }}
                                alt={item.fullname}
                              />
                            </div>
                            <div className="author-text">
                              <h6 className="mb-0 text-light">
                                {item.fullname}
                              </h6>
                            </div>
                          </div>
                        </li>
                      ))
                    : ""}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
// Dashboard.propTypes = {
//     auth: PropTypes.object
// }

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    data: state.dashboardReducer.data,
    isLoading: state.dashboardReducer.isLoading,
  };
};

export default connect(mapStateToProps)(Dashboard);
