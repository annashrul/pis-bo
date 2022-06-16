import React, { Component } from "react";
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "../../../../redux/actions/modal.action";
import { getDetailReportTransaksi } from "../../../../redux/actions/laporan/report_transaksi_member.action";
import moment from "moment";
import { NOTIF_ALERT } from "../../../../redux/actions/_constants";
import Paginationq, {
  generateNo,
  noData,
  toCurrency,
  toDate,
} from "../../../../helper";
import TableCommon from "../../../common/TableCommon";

class DetailReportTransaksiMember extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handlePageChange(num) {
    this.props.dispatch(
      getDetailReportTransaksi(`page=${num}&${this.props.detail.where}`)
    );
  }

  render() {
    let totalTrxInPerPage = 0;
    let totalTrxOutPerPage = 0;
    const { data, paginationDetail } = this.props;
    const rowSpan = [
      { label: "Kode", className: "text-center", width: "1%" },
      { label: "Masuk", className: "text-center", width: "1%" },
      { label: "Keluar", className: "text-center", width: "1%" },
    ];
    const head = [
      { label: "No", width: "1%", className: "text-center", rowSpan: 2 },
      { label: "Transaksi", width: "1%", colSpan: 3 },
      { label: "Catatan", rowSpan: 2 },
      { label: "Tanggal", rowSpan: 2, width: "1%" },
    ];
    return (
      <WrapperModal
        isOpen={
          this.props.isOpen && this.props.type === "detailReportTransaksiMember"
        }
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          Laporan Transaksi {this.props.detail.nama}
        </ModalHeader>
        <ModalBody>
          <TableCommon
            rowSpan={rowSpan}
            head={head}
            meta={{
              total: paginationDetail.total,
              current_page: paginationDetail.current_page,
              per_page: paginationDetail.per_page,
            }}
            current_page={paginationDetail.current_page}
            callbackPage={this.handlePageChange.bind(this)}
            renderRow={
              typeof data === "object"
                ? data.length > 0
                  ? data.map((v, i) => {
                      totalTrxInPerPage += parseFloat(v.trx_in);
                      totalTrxOutPerPage += parseFloat(v.trx_out);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">
                            {generateNo(i, paginationDetail.current_page)}
                          </td>
                          <td className="middle nowrap">{v.kd_trx}</td>
                          <td className={"middle nowrap text-right poin"}>
                            {toCurrency(`${parseFloat(v.trx_in).toFixed(2)}`)}
                          </td>
                          <td className={"middle nowrap text-right poin"}>
                            {toCurrency(`${parseFloat(v.trx_out).toFixed(2)}`)}
                          </td>
                          <td className="middle nowrap">{v.note}</td>
                          <td className="middle nowrap">
                            {toDate(v.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  {
                    colSpan: 2,
                    label: "Total perhalaman",
                    className: "text-left",
                  },
                  {
                    colSpan: 1,
                    label: toCurrency(totalTrxInPerPage.toFixed(2)),
                    className: "text-right poin",
                  },
                  {
                    colSpan: 1,
                    label: toCurrency(totalTrxOutPerPage.toFixed(2)),
                    className: "text-right poin",
                  },
                ],
              },
            ]}
          />
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    data: state.reportTransaksiMemberReducer.detail,
    paginationDetail: state.reportTransaksiMemberReducer.paginationDetail,
    isLoading: state.reportTransaksiMemberReducer.isLoadingDetail,
  };
};

export default connect(mapStateToProps)(DetailReportTransaksiMember);
