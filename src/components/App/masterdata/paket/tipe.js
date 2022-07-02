import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { generateNo, myDate, noData, toRp } from "../../../../helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import FormTipePaket from "../../modals/masterdata/paket/form_tipe_paket";
import {
  getTipePaket,
  deleteTipePaket,
} from "../../../../redux/actions/masterdata/tipe_paket.action";

class IndexTipe extends Component {
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
      this.props.dispatch(getTipePaket(whereLocal));
    }
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(par) {
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
    this.props.dispatch(ModalType("formTipePaket"));
  }

  render() {
    const { pagination, data } = this.props;
    const { where, detail } = this.state;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Title" },
      { label: "Bonus Sponsor", width: "1%" },
      { label: "Limit Bonus Nasional", width: "1%" },
      { label: "Minimal WD", width: "1%" },
      { label: "Max WD", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];

    return (
      <Layout page={"Daftar Kategori Paket"}>
        <HeaderGeneralCommon
          col="col-md-12"
          pathName="daftarKategoriPaket"
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
                                  deleteTipePaket({
                                    total: data.length,
                                    id: v.id,
                                    where: where,
                                  })
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.bonus_sponsor)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.limit_bonus_nasional)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.minimal_wd)}
                        </td>
                        <td className="middle nowrap text-right poin">
                          {toRp(v.max_wd)}
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
        {this.props.isOpen === true ? <FormTipePaket detail={detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.tipePaketReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.tipePaketReducer.data,
    pagination: state.tipePaketReducer.pagination,
  };
};

export default connect(mapStateToProps)(IndexTipe);
