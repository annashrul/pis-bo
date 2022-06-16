import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/Layout";
import helper, { myDate, noImage, rmHtml } from "../../../../helper";
import moment from "moment";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  deleteContent,
  getContent,
} from "../../../../redux/actions/konten/konten.action";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import FormBerita from "../../modals/masterdata/berita/form_berita";
import * as Swal from "sweetalert2";
import { NOTIF_ALERT } from "../../../../redux/actions/_constants";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";

moment.locale("id"); // en

class IndexBerita extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      title: "",
      id: "",
      perpage: 10,
      scrollPage: 0,
      isScroll: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentWillMount() {
    this.handleGet("", 1);
  }
  handleGet(res, page) {
    if (res !== undefined) {
      let whereLocal = `page=${page}${res}`;
      this.setState({ where: whereLocal });
      this.props.dispatch(getContent(whereLocal));
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handlePage(pageNumber) {
    localStorage.setItem("pageBerita", pageNumber);
    let where = this.handleValidate();
    this.props.dispatch(getContent("berita", where));
  }

  handleModal(par) {
    if (par !== null) {
      this.setState({
        detail: this.props.data[par],
      });
    } else {
      this.setState({
        detail: {
          id: "",
        },
      });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formBerita"));
  }

  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deleteContent(id, "berita"));
  }

  render() {
    const { data, pagination } = this.props;
    return (
      <Layout page={"Berita"}>
        <HeaderGeneralCommon
          col={"col-md-12"}
          pathName="listBerita"
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />
        <div className="row">
          <div className="col-md-12">
            <main>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    let desc = rmHtml(v.caption);
                    if (desc.length > 100) {
                      desc = desc.substr(0, 100);
                    }
                    return (
                      <article key={i}>
                        <div className="box-margin">
                          <div
                            className="coupon"
                            style={{
                              borderRadius: "15px",
                              margin: "0 auto",
                              breakInside: "avoid-column",
                            }}
                          >
                            <div className="ribbon-wrapper bgWithOpacity">
                              <div className="ribbon ribbon-bookmark ribbon-success">
                                {v.category}
                              </div>
                              <img
                                alt="example"
                                src={v.picture}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = noImage();
                                }}
                              />
                              <br />
                              <div className="row">
                                <div
                                  className="col-md-12"
                                  style={{ padding: "5" }}
                                >
                                  <br />
                                  <p className="text-muted">
                                    {myDate(v.created_at)}
                                  </p>
                                  <h4 className="text-white">{v.title}</h4>
                                  <p className="text-muted">{rmHtml(desc)}</p>
                                </div>
                                <div className="col-md-12">
                                  <div
                                    className="btn-group btn-block"
                                    style={{ textAlign: "right" }}
                                  >
                                    <UncontrolledButtonDropdown nav>
                                      <DropdownToggle
                                        caret
                                        className="myDropdown"
                                      >
                                        Pilihan
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem
                                          onClick={(e) => this.handleModal(i)}
                                        >
                                          Ubah
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={(e) =>
                                            this.handleDelete(v.id)
                                          }
                                        >
                                          Hapus
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <img src={NOTIF_ALERT.NO_DATA} alt="member" />
                )
              ) : (
                <img src={NOTIF_ALERT.NO_DATA} alt="member" />
              )}
            </main>
          </div>
        </div>

        {this.props.isOpen === true ? (
          <FormBerita detail={this.state.detail} />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.contentReducer.isLoading,
    isOpen: state.modalReducer,
    data: state.contentReducer.data,
    pagination: state.contentReducer.pagination,
    kategori: state.kategoriReducer.data,
    isLoadingPost: state.kategoriReducer.isLoadingPost,
    isError: state.kategoriReducer.isError,
    isLoadingKategori: state.kategoriReducer.isLoading,
  };
};

export default connect(mapStateToProps)(IndexBerita);
