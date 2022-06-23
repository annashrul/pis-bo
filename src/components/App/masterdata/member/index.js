import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import {
  generateNo,
  myDate,
  noData,
  statusQ,
  toCurrency,
  toRp,
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
import FormPin from "../../modals/masterdata/member/form_pin";
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
      isModalFormPin:false,
      status_data: [
        { value: "", label: "semua status" },
        { value: "0", label: "Belum Bayar" },
        { value: "1", label: "Aktif" },
        { value: "3", label: "Recycle" },
      ],
      status: "",
      kolom_data: [
        { value: "fullname", label: "Nama" },
        { value: "mobile_no", label: "No Handphone" },
        { value: "referral", label: "Referral" },
        { value: "referral_sponsor", label: "Referral Sponsor" },
      ],
      kolom: "",
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
      this.setState({
        isModalFormMember: true,
        isModalFormPin: false,
        isModalFormBankMember: false
      });
    } else if (type === 'formMemberPin') {
      this.setState({
        isModalFormBankMember: false,
        isModalFormMember: false,
        isModalFormPin: true,
      });

    } else {
      this.props.dispatch(getMemberDetail(par.id));
      this.props.dispatch(getGeneralBank());
      this.setState({
        isModalFormBankMember: true,
        isModalFormMember: false,
        isModalFormPin: false,
      });
    }
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(type));
  }

  render() {
    const { pagination, data } = this.props;
    const { where, detail } = this.state;
    let totalSaldoPendingPerPage = 0;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Foto", width: "1%" },
      { label: "Nama" },
      { label: "Username", width: "1%" },
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
          col={"col-md-4"}
          pathName="daftarMember"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          otherName="status"
          otherState="status"
          otherData={this.state.status_data}
          isOther={true}
          isColumn={true}
          columnData={this.state.kolom_data}
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
                    totalSaldoPendingPerPage =
                      totalSaldoPendingPerPage + parseFloat(v.saldo_pending);
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
                              { label: "Ubah PIN Transaksi" },
                            ]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v, "formMember");
                              if (e === 1) this.handleModal(v, "formBankMember");
                              if (e === 2) this.handleModal(v, "formMemberPin");
                              
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          <img
                            src={v.foto}
                            style={{
                              width: "25px",
                              height: "25px",
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.fullname}</td>
                        <td className="middle nowrap">{v.uid}</td>
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
                        <td className="middle nowrap">
                          {v.status === 0
                            ? "Belum Bayar"
                            : v.status === 1
                            ? "Aktif"
                            : "Recycle"}
                        </td>
                        <td className="middle nowrap">
                          {v.status === 3 ? myDate(v.recycle_date) : "-"}
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
          footer={[
            {
              data: [
                {
                  colSpan: 8,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: toCurrency(`${totalSaldoPendingPerPage.toFixed(0)}`),
                  className: `text-right poin`,
                },
              ],
            },
          ]}
        />
        {this.props.isOpen && this.state.isModalFormMember ? (
          <FormMember detail={detail} />
        ) : null}
        {this.props.isOpen && this.state.isModalFormBankMember ? (
          <FormBankMember detail={detail} />
        ) : null}

        {this.props.isOpen && this.state.isModalFormPin ? (
          <FormPin detail={detail}/>
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
