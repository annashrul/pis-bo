import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { generateNo, myDate, noData, statusQ } from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import FormUserList from "../../modals/masterdata/pengguna/form_user_list";
import { deleteUserList, getUserList } from "../../../../redux/actions/masterdata/user_list.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import { getUserLevel } from "../../../../redux/actions/masterdata/user_level.action";

class IndexUserList extends Component {
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
      this.props.dispatch(getUserList(whereLocal));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par) {
    this.props.dispatch(getUserLevel());
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
    this.props.dispatch(ModalType("formUserList"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Username", width: "1%" },
      { label: "Akses", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Pengguna"}>
        <HeaderGeneralCommon
          pathName="daftarPengguna"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />

        <TableCommon
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "Ubah" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1)
                                this.props.dispatch(
                                  deleteUserList({
                                    total: data.length,
                                    id: v.id,
                                    where: where,
                                  })
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.name}</td>
                        <td className="middle nowrap">{v.username}</td>
                        <td className="middle nowrap">{v.level}</td>
                        <td className="middle nowrap">{statusQ(v.status)}</td>
                        <td className="middle nowrap">{myDate(v.created_at)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen === true ? <FormUserList detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.userListReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.userListReducer.data,
  };
};

export default connect(mapStateToProps)(IndexUserList);
