import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { deleteReward, fetchReward } from "../../../../redux/actions/masterdata/reward/reward.action";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import FormReward from "../../modals/masterdata/reward/form_reward";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import TableCommon from "../../../common/TableCommon";
import { baseImage, generateNo, noData, toRp } from "../../../../helper";
import { fetchKategoriBinary } from "../../../../redux/actions/masterdata/binary/kategori_binary.action";

class IndexReward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
  }
  componentWillMount() {
    this.handleGet("", 1);
  }
  handleGet(res, page) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(fetchReward(whereLocal));
    }
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(e) {
    if (e === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      this.setState({
        detail: {
          id: e.id,
          val: e,
          where: this.state.where,
        },
      });
    }
    this.props.dispatch(fetchKategoriBinary("page=1&perpage=9999"));
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formReward"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Gambar", width: "1%" },
      { label: "Nama" },
      { label: "Point Kiri" },
      { label: "Point Kanan" },
      { label: "Deskripsi" },
    ];

    return (
      <Layout page={`Reward`}>
        <HeaderGeneralCommon
          pathName="reward"
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
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: "ubah" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal(v);
                              if (e === 1)
                                this.props.dispatch(
                                  deleteReward({
                                    id: v.id,
                                    total: data.length,
                                    where: this.state.where,
                                  })
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{baseImage(v.gambar)}</td>
                        <td className="middle nowrap">{v.title}</td>
                        <td className="middle nowrap text-right">{toRp(v.poin_kiri)}</td>
                        <td className="middle nowrap text-right">{toRp(v.poin_kanan)}</td>
                        <td className="middle nowrap">{v.caption}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {/* {typeof data === "object"
          ? data.length > 0
            ? data.map((v, i) => {
                return (
                  <div id="movie-card-list">
                    <div className="movie-card" style={{ backgroundImage: v.gambar }}>
                      <div className="color-overlay">
                        <div className="movie-content" style={{ paddingTop: "10px" }}>
                          <div className="movie-header">
                            <h1 className="movie-title">{v.title}</h1>
                            <div className="row">
                              <div className="col-6 col-xs-6 col-md-3">
                                <h4 className="movie-info">Poin kiri</h4>
                              </div>
                              <div className="col-6 col-xs-6 col-md-1">
                                <h4 className="movie-info">{v.poin_kiri}</h4>
                              </div>
                            </div>
                            <div className="row" style={{ marginTop: "5px" }}>
                              <div className="col-6 col-xs-6 col-md-3">
                                <h4 className="movie-info">Poin Kanan</h4>
                              </div>
                              <div className="col-6 col-xs-6 col-md-1">
                                <h4 className="movie-info">{v.poin_kanan}</h4>
                              </div>
                            </div>
                          </div>
                          <p className="movie-desc text-white">{v.caption}</p>
                          <div style={{ bottom: "0" }}>
                            <ButtonActionTableCommon
                              action={[{ label: "ubah" }, { label: "Hapus" }]}
                              callback={(e) => {
                                if (e === 0) this.handleModal(v);
                                if (e === 1)
                                  this.props.dispatch(
                                    deleteReward({
                                      id: v.id,
                                      total: data.length,
                                      where: this.state.where,
                                    })
                                  );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null
          : null} */}
        {this.props.isOpen === true ? <FormReward detail={this.state.detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.rewardReducer.data,
  };
};

export default connect(mapStateToProps)(IndexReward);
