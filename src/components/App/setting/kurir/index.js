import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import { baseImage, noData, statusQ } from "../../../../helper";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionTableCommon from "../../../common/ButtonActionTableCommon";
import { fetchKurir, putKurir } from "../../../../redux/actions/setting/kurir.action";

class IndexKurir extends Component {
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
      this.props.dispatch(fetchKurir(whereLocal));
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
  }

  render() {
    const { data } = this.props;
    const { where } = this.state;
    const head = [{ label: "No", className: "text-center", width: "1%" }, { label: "#", className: "text-center", width: "1%" }, { label: "Kurir" }, { label: "Status", width: "1%" }];
    return (
      <Layout page={"Kurir"}>
        <HeaderGeneralCommon
          pathName="kurir"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
        />

        <TableCommon
          head={head}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionTableCommon
                            action={[{ label: v.status === 1 ? "Non aktifkan" : "Aktifkan" }]}
                            callback={(e) => {
                              if (e === 0) this.props.dispatch(putKurir({ status: v.status === 1 ? 0 : 1 }, { where: where, id: v.id }));
                            }}
                          />
                        </td>
                        <td className="middle nowrap">
                          <div className="row">
                            <div className="col-md-1 middle">{baseImage(v.gambar)}</div>
                            {v.title}
                            <br /> {v.deskripsi}
                          </div>
                        </td>
                        <td className="middle nowrap">{statusQ(v.status)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.kurirReducer.data,
  };
};

export default connect(mapStateToProps)(IndexKurir);
