import React,{Component} from 'react';
import Layout from "../../../Layout";
import connect from "react-redux/es/connect/connect";
// import {approvalProduct} from "../../../../redux/actions/laporan/report_Product.action";
import  { noImage, generateNo, noData} from "../../../../helper";
import moment from "moment";
import imgDefault from 'assets/default.png'
import HeaderGeneralCommon from '../../../common/HeaderGeneralCommon';
import TableCommon from '../../../common/TableCommon';
import ButtonActionTableCommon from '../../../common/ButtonActionTableCommon';
import Swal from 'sweetalert2';
import { approvalProduct, getTrxProduct } from '../../../../redux/actions/laporan/report_barang.action';

const prefix='ReportProduct';

class IndexReportProduct extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            where:"",
            status_data: [
              { value: "", label: "semua status" },
              { value: "0", label: "pending" },
              { value: "1", label: "diterima" },
              { value: "2", label: "ditolak" },
            ],
            status: "",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
        };
        this.handleChange      = this.handleChange.bind(this);
        this.handlePage      = this.handlePage.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handleEvent      = this.handleEvent.bind(this);

    }
    handleValidate(){
        let sessPage=localStorage.getItem(`page${prefix}`);
        let sessDateFrom=localStorage.getItem(`dateFrom${prefix}`);
        let sessDateTo=localStorage.getItem(`dateTo${prefix}`);
        let page = sessPage!==null?sessPage:"1";
        let dateFrom=sessDateFrom!==null?sessDateFrom:this.state.dateFrom;
        let dateTo=sessDateTo!==null?sessDateTo:this.state.dateTo;
        let any = this.state.any;
        let where=`page=${page}&perpage=10&datefrom=${dateFrom}&dateto=${dateTo}`;
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    componentWillUnmount(){
        localStorage.removeItem(`dateFrom${prefix}`);
        localStorage.removeItem(`dateTo${prefix}`);
        localStorage.removeItem(`page${prefix}`);
    }
    componentWillMount(){
        let where=this.handleValidate();
        this.props.dispatch(getTrxProduct(where));
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handlePage(num){
        localStorage.setItem(`page${prefix}`,num);
        let where = this.handleValidate();
        this.props.dispatch(getTrxProduct(where));

    }
    
    handleApprove(kd_trx) {        
    Swal.fire({
        title: "Perhatian !!!",
        html: `anda yakin akan approve data ini ??`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Oke, Approve`,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.value) {
          this.props.dispatch(approvalProduct(kd_trx, 1));
        }
      });
    }
    handleGet(res, page = 1) {
        if (res !== undefined) {
          let whereLocal = `page=${page}${res}`;
          this.setState({ where: whereLocal });
          this.props.dispatch(getTrxProduct(whereLocal));
        }
      }
      handlePageChange(pageNumber) {
        this.handleGet(this.state.where, pageNumber);
      }
    handleEvent = (event, picker) => {
        event.preventDefault();
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem(`dateFrom${prefix}`,`${this.state.dateFrom}`);
        localStorage.setItem(`dateTo${prefix}`,`${this.state.dateTo}`);
        localStorage.removeItem(`page${prefix}`);
        let where = this.handleValidate();
        this.props.dispatch(getTrxProduct(where));
    }
    rowProduk(image, title, qty, hrg){
        return (
            <div className="card shadow-1">
                <div className="row">
                    <div className="col-md-3">
                        <div style={{width:'50px',height:'50px'}}>
                            <img src={image} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="barang" className="img-responsive" />
                        </div>
                    </div>
                    <div className="col-md-8" style={{padding: '6px 0px', wordBreak:'break-word'}}>{title}
                        <div className={"txtRed"} style={{fontSize: '10px'}}>{qty}</div>
                    </div>
                </div>
            </div>
        )
    }
    render(){
        const { total, per_page, current_page, data } = this.props.data;
        const head = [
          { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
          { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
          { label: "KODE TRX", width: "1%", rowSpan: 2 },
          { label: "FOTO", width: "7%", rowSpan: 2 },
          { label: "NAMA", rowSpan: 2 },
          { label: "TELPON", width: "1%", rowSpan: 2 },
          { label: "ALAMAT", rowSpan: 2 },
          { label: "STATUS", width: "1%", rowSpan: 2 },
        ];
        return (
            <Layout page="Klaim Product" headers="Klaim Product" >
                <HeaderGeneralCommon
                pathName="reportPin"
                col="col-md-5"
                callbackGet={(res) => {
                  this.setState({ any: res });
                  this.handleGet(res, 1);
                }}
                isOther={true}
                otherName="status"
                otherData={this.state.status_data}
                other={this.state.status}
                otherState="status"
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
                            let status = "";
                            if (v.status === 0) {
                            status = <span className={"badge badge-warning"}>Pending</span>;
                            }
                            if (v.status === 1) {
                            status = <span className={"badge badge-success"}>Diterima</span>;
                            }
                            if (v.status === 2) {
                            status = <span className={"badge badge-danger"}>Ditolak</span>;
                            }
                          return (
                            <tr key={i}>
                              <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                              <td className="middle nowrap text-center">
                                  {v.status===0?
                                    <ButtonActionTableCommon action={[{ label: "Approve" }]} callback={(e) => {if (e === 0) this.handleApprove(v.kd_trx);}} />
                                    :''}
                              </td>
                              <td>
                                  {v.kd_trx}
                              </td>
                              <td className="middle nowrap">
                                <img  style={{height:'50px',width:'50px',objectFit:"scaleDown"}} src={v.foto} onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}} alt="member_image"/>
                              </td>
                              <td>
                                  {v.fullname}
                              </td>
                              <td>
                                  {v.mobile_no}
                              </td>
                              <td>
                                  {v.main_address}
                              </td>
                              <td>
                                  {status}
                              </td>
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
        data:state.reportBarangReducer.data_trx_product,
        isLoading: state.reportBarangReducer.isLoadingTrxProduct,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(IndexReportProduct)