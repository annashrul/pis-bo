import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import TableCommon from "../../common/TableCommon";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import { ModalToggle, ModalType } from "../../../redux/actions/modal.action";
import { fetchLogGenPin, fetchReportPin } from "../../../redux/actions/laporan/report_pin.action";
import { fetchKategoriBinary } from "../../../redux/actions/masterdata/binary/kategori_binary.action";
import { generateNo, noData, toRp } from "../../../helper";
import FormGeneratePin from "../modals/laporan/pin/form_generate_pin";
import moment from "moment";

class LaporanPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
      any_log_gen: "",
      where_log_gen: "",
    };
  }
  componentWillMount() {
    this.handleGet("", 1);
    this.handleGetLogGen("", 1);
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(fetchReportPin(where));
  }
  handleGetLogGen(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where_log_gen: where });
    this.props.dispatch(fetchLogGenPin(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }
  handlePageChangeLogPin(pageNumber) {
    this.handleGetLogGen(this.state.any_log_gen, pageNumber);
  }
  handleModal() {
    this.props.dispatch(fetchKategoriBinary("page=1&all=true"));
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formGeneratePin"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const data_gen_log = this.props.data_gen_log;

    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Jumlah awal", width: "1%" },
      { label: "Total beli", width: "1%" },
      { label: "Total aktivasi", width: "1%" },
      { label: "Total belum aktivasi", width: "1%" },
      { label: "Sisa", width: "1%" },
    ];
    const head_gen_log = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Title", width: "1%" },
      { label: "Jumlah", width: "1%" },
      { label: "Waktu", width: "1%" },
    ];

    return (
      <Layout page={`Laporan pin`}>
        <HeaderGeneralCommon
          pathName="reportPin"
          col="col-md-5"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
          callbackAddText="Generate PIN"
          callbackSearch="hide"
        />
        <TableCommon
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{v.membership}</td>
                        <td className="middle nowrap text-right">{toRp(v.jumlah_awal)}</td>
                        <td className="middle nowrap text-right">{toRp(v.total_beli)}</td>
                        <td className="middle nowrap text-right">{toRp(v.total_aktivasi)}</td>
                        <td className="middle nowrap text-right">{toRp(v.total_belum_aktivasi)}</td>
                        <td className="middle nowrap text-right">{toRp(v.sisa)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        
        <div className="row">
          <div className="col-md-12"></div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="row box-margin">
          <div className="col-md-12">
            <div className="bg-transparent">
              <div className="text-light">LOG GENERATE PIN</div>
              <div className="mt-2">
                <div style={{ overflowX: "auto" }}>
                <TableCommon
                  head={head_gen_log}
                  meta={{
                    total: data_gen_log.total,
                    current_page: data_gen_log.current_page,
                    per_page: data_gen_log.per_page,
                  }}
                  current_page={data_gen_log.current_page}
                  callbackPage={this.handlePageChangeLogPin.bind(this)}
                  renderRow={
                  //   {
                  //     "totalrecords": "6",
                  //     "id": "267a1dd8-66a6-4901-b63c-8e8295d9cf30",
                  //     "id_user": "fd944cb9-f52f-4463-9958-51027b1332cf",
                  //     "name": "cs",
                  //     "id_membership": "645a4873-8c81-48b9-84b5-23ec523876e2",
                  //     "title": "Diamond",
                  //     "jumlah": 100000,
                  //     "type": 0,
                  //     "created_at": "2021-09-27T20:37:28.000Z"
                  // }
                    typeof data_gen_log.data === "object"
                      ? data_gen_log.data.length > 0
                        ? data_gen_log.data.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td className="middle nowrap text-center">{generateNo(i, data_gen_log.current_page)}</td>
                                <td className="middle nowrap">{v.name}</td>
                                <td className="middle nowrap">{v.title}</td>
                                <td className="middle nowrap text-right">{toRp(v.jumlah)}</td>
                                <td className="middle nowrap">{moment(v.created_at).format(
                                    "YYYY-MM-DD HH:mm"
                                  )}</td>
                              </tr>
                            );
                          })
                        : noData(head.length)
                      : noData(head.length)
                  }
                />

                </div>
              </div>
            </div>
          </div>
        </div>

        {this.props.isOpen ? <FormGeneratePin detail={this.state.where} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.reportPinReducer.data,
    data_gen_log: state.reportPinReducer.data_gen_log,
  };
};

export default connect(mapStateToProps)(LaporanPin);
