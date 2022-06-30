import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import moment from "moment";
import General from "./general";
import Alokasi from "./alokasi";
import Adjusment from "./adjusment";

import {
  getSiteAlokasi,
  getSiteGeneral,
} from "../../../../redux/actions/setting/general.action";
class IndexSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      type: 0,
      last: "",
      dateFrom: moment().format("yyyy-MM-DD"),
      dateTo: moment().format("yyyy-MM-DD"),
    };
  }
  componentWillMount() {
    this.props.dispatch(getSiteAlokasi());
    this.props.dispatch(getSiteGeneral());
  }

  render() {
    console.log(this.props);

    return (
      <Layout page={"Pengaturan Umum"}>
        <div className="row">
          <div className="col-12 box-margin">
            <Tabs>
              <TabList style={{ margin: "0px" }}>
                <Tab>Alokasi</Tab>
                <Tab>General</Tab>
                <Tab>Adjusment</Tab>
              </TabList>

              <TabPanel>
                <Alokasi res_alokasi={this.props.alokasi} />
              </TabPanel>
              <TabPanel>
                <General res_general={this.props.general} />
              </TabPanel>
              <TabPanel>
                <Adjusment res_alokasi={this.props.alokasi} />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    alokasi: state.generalReducer.alokasi,
    general: state.generalReducer.general,
  };
};

export default connect(mapStateToProps)(IndexSetting);
