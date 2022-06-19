import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  generateNo,
  myDate,
  noData,
  statusQ,
  toCurrency,
} from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import {
  deleteMember,
  getMember,
  getMemberDetail,
} from "../../../../redux/actions/masterdata/member.action";
import FormMember from "../../modals/masterdata/member/form_member";
import FormBankMember from "../../modals/masterdata/member/form_bank_member";
import { getGeneralBank } from "../../../../redux/actions/masterdata/bank.action";

class IndexMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
      isModalFormMember: false,
      isModalFormBankMember: false,
    };
    this.handleModal = this.handleModal.bind(this);
  }
  componentWillMount() {
    this.handleGet("", 1);
  }

  handleGet(res, page = 1) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(getMember(whereLocal));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par, type) {
    const bool = !this.props.isOpen;
    let data = { id: "", where: this.state.where };
    if (par !== null) {
      Object.assign(data, { id: par.id });
      Object.assign(data, { val: par });
      this.setState({ detail: data });
    }

    if (type === "formMember") {
      this.setState({ isModalFormMember: true, isModalFormBankMember: false });
    } else {
      this.props.dispatch(getMemberDetail(par.id));
      this.props.dispatch(getGeneralBank());
      this.setState({
        isModalFormBankMember: true,
        isModalFormMember: false,
      });
    }
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(type));
  }

  render() {
    const { pagination, data } = this.props;
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "No.Handphone", width: "1%" },
      { label: "Referral", width: "1%" },
      { label: "Sponsor", width: "1%" },
      { label: "Saldo Pending", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Tanggal Recycle", width: "1%" },
      { label: "Tanggal Gabung", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Member"}>
        <HeaderGeneralCommon
          col={"col-md-6"}
          pathName="daftarMember"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
        />
        <TableCommon
          head={head}
          meta={{
            total: pagination.total,
            current_page: pagination.current_page,
            per_page: pagination.per_page,
          }}
          callbackPage={this.handlePageChange.bind(this)}
          current_page={pagination.current_page}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, pagination.current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[
                              { label: "Ubah Data Diri" },
                              { label: "Ubah Data Bank" },
                            ]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v, "formMember");
                              if (e === 1)
                                this.handleModal(v, "formBankMember");
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          <img
                            src={v.foto}
                            style={{ width: "20px", marginRight: "5px" }}
                          />{" "}
                          {v.fullname}
                        </td>
                        <td className="middle nowrap">{v.mobile_no}</td>
                        <td className="middle nowrap">{v.referral}</td>
                        <td className="middle nowrap">
                          {v.sponsor_referral === null
                            ? "-"
                            : v.sponsor_referral}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toCurrency(parseFloat(v.saldo_pending).toFixed(0))}
                        </td>
                        <td className="middle nowrap text-center">
                          {v.status === 0
                            ? "Belum Bayar"
                            : v.status === 1
                            ? "Aktif"
                            : "Recycle"}
                        </td>
                        <td className="middle nowrap">
                          {myDate(v.recycle_date)}
                        </td>
                        <td className="middle nowrap">
                          {myDate(v.created_at)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen && this.state.isModalFormMember ? (
          <FormMember detail={detail} />
        ) : null}
        {this.props.isOpen && this.state.isModalFormBankMember ? (
          <FormBankMember detail={detail} />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.memberReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.memberReducer.data,
    pagination: state.memberReducer.pagination,
  };
};

export default connect(mapStateToProps)(IndexMember);
