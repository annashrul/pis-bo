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
import FormUserList from "../../modals/masterdata/pengguna/form_user_list";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import {
  deleteBankPerusahaan,
  getBankPerusahaan,
} from "../../../../redux/actions/setting/bank.action";
import FormBankPerusahaan from "../../modals/setting/bank.modal";
import { getGeneralBank } from "../../../../redux/actions/masterdata/bank.action";

class IndexBankPerusahaan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
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
      this.props.dispatch(getBankPerusahaan(whereLocal));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par) {
    this.props.dispatch(getGeneralBank());
    let data = { id: "", where: this.state.where };
    if (par !== null) {
      Object.assign(data, { id: par.id });
      Object.assign(data, { val: par });
      this.setState({ detail: data });
    } else {
      this.setState({ detail: data });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formBankPerusahaan"));
  }

  render() {
    const { pagination, data } = this.props;
    console.log("props", data);
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Bank" },
      { label: "Akun", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Paket"}>
        <HeaderGeneralCommon
          pathName="daftarPaket"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />

        <TableCommon
          head={head}
          meta={{
            total: pagination.total,
            current_page: pagination.current_page,
            per_page: pagination.per_page,
          }}
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
                            action={[{ label: "Ubah" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1)
                                this.props.dispatch(
                                  deleteBankPerusahaan({
                                    total: data.length,
                                    id: v.id,
                                    where: where,
                                  })
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          <img
                            src={v.logo}
                            style={{
                              float: "left",
                              height: "40px",
                              width: "80px",
                              marginRight: "10px",
                            }}
                          />
                          {v.name}
                          <br />
                          <small>{v.kode}</small>
                        </td>
                        <td className="middle nowrap">
                          {v.acc_name}
                          <br />
                          <small>{v.acc_no}</small>
                        </td>
                        <td className="middle nowrap text-center">
                          {statusQ(v.status)}
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
        {this.props.isOpen === true ? (
          <FormBankPerusahaan detail={detail} />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.bankPerusahaanReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.bankPerusahaanReducer.data,
    pagination: state.bankPerusahaanReducer.pagination,
  };
};

export default connect(mapStateToProps)(IndexBankPerusahaan);
