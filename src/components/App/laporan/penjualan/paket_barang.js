import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import { noImage, toCurrency, toExcel,
    statusOrder,
    generateNo,
    noData
} from "../../../../helper";
import {ModalToggle, ModalType} from "../../../../redux/actions/modal.action";
import moment from "moment";
import DetailLaporanBarang from '../../modals/laporan/detail_laporan_paket_barang';
import {getExcelReportBarang, getReportBarang} from "../../../../redux/actions/laporan/report_barang.action";
import imgDefault from 'assets/default.png'
import HeaderGeneralCommon from '../../../common/HeaderGeneralCommon';
import TableCommon from '../../../common/TableCommon';
import ButtonActionTableCommon from '../../../common/ButtonActionTableCommon';

class IndexReportBarang extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            where:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            data:[],
            isLoading:false,
        };
        this.handleChange      = this.handleChange.bind(this);
        this.handlePageChange      = this.handlePageChange.bind(this);
        this.handlePage      = this.handlePage.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handleEvent      = this.handleEvent.bind(this);
        this.handleDetail      = this.handleDetail.bind(this);
        this.printDocumentXLsx      = this.printDocumentXLsx.bind(this);

    }
    handleValidate(){
        let page = localStorage.pageLaporanSaldo!==undefined?localStorage.pageLaporanSaldo:"1";
        let dateFrom=localStorage.dateFromLaporanSaldo!==undefined?localStorage.dateFromLaporanSaldo:this.state.dateFrom;
        let dateTo=localStorage.dateToLaporanSaldo!==undefined?localStorage.dateToLaporanSaldo:this.state.dateTo;
        let any = this.state.any;
        let where=`page=${page}&perpage=10&datefrom=${dateFrom}&dateto=${dateTo}`;
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }

        return where;

    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    componentWillUnmount(){
        localStorage.removeItem("dateFromReportBarang");
        localStorage.removeItem("dateToReportBarang");
        localStorage.removeItem("pageReportBarang");
    }
    componentWillMount(){
        let where=this.handleValidate();
        this.props.dispatch(getReportBarang(where));

    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataExcel.data!==this.props.dataExcel.data){
            this.getProps(this.props);
        }
    }
    getProps(props){
        if(props.dataExcel.data!==undefined){
            if(props.dataExcel.data.length>0){
                let content=[],totMenungguPembayaran=0,totDikemas=0,totDikirim=0,totSelesai=0,totDibatalkan=0,totOmset=0;
                props.dataExcel.data.map((v,i)=>{
                    content.push([
                        v.title,
                        parseInt(v.menunggu_pembayaran,10),
                        parseInt(v.dikemas,10),
                        parseInt(v.dikirim,10),
                        parseInt(v.selesai,10),
                        parseInt(v.dibatalkan,10),
                        parseInt(v.total_omset,10),
                    ]);
                    totMenungguPembayaran=totMenungguPembayaran+parseInt(v.menunggu_pembayaran,10);
                    totDikemas=totDikemas+parseInt(v.dikemas,10);
                    totDikirim=totDikirim+parseInt(v.dikirim,10);
                    totSelesai=totSelesai+parseInt(v.selesai,10);
                    totDibatalkan=totDibatalkan+parseInt(v.dibatalkan,10);
                    totOmset=totOmset+parseInt(v.total_omset,10);
                    return null;
                });
                // console.log(content);
                toExcel(
                    'LAPORAN TRASANSAKSI BARANG',
                    `${this.state.dateFrom} - ${this.state.dateTo}`,
                    [
                        'NAMA',
                        'MENUNGGU PEMBAYARAN',
                        'DIKEMAS',
                        'DIKIRIM',
                        'SELESAI',
                        'DIBATALKAN',
                        'TOTAL OMSET'
                    ],
                    content,
                    [
                        [''],
                        [''],
                        [
                            'TOTAL',
                            totMenungguPembayaran,
                            totDikemas,
                            totDikirim,
                            totSelesai,
                            totDibatalkan,
                            totOmset,
                        ]
                    ]


                )
            }
        }
    }
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("dateFromReportBarang",`${this.state.dateFrom}`);
        localStorage.setItem("dateToReportBarang",`${this.state.dateTo}`);
        localStorage.removeItem("pageReportBarang");
        let where = this.handleValidate();
        this.props.dispatch(getReportBarang(where));
    }
    handlePage(num){
        localStorage.setItem("pageLaporanSaldo",num);
        let where = this.handleValidate();
        this.props.dispatch(getReportBarang(where));

    }
    handleGet(res, page = 1) {
      if (res !== undefined) {
        let whereLocal = `page=${page}${res}`;
        this.setState({ where: whereLocal });
        this.props.dispatch(getReportBarang(whereLocal));
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
    handleDetail(id,nama){
        this.setState({detail:{"id":id,"nama":nama,where:this.state.where}});
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailLaporanBarangPaket"));
    }
    printDocumentXLsx = (e,param) => {
        let where=`perpage=${param}`;
        if(this.state.any!==null&&this.state.any!==undefined&&this.state.any!==""){
            where+=`&q=${this.state.any}`;
        }
        this.props.dispatch(getExcelReportBarang(where));

    }

    render(){
        // const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        // const numStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        // // const data = this.state.data;
        // let tot0=0;
        // let tot1=0;
        // let tot2=0;
        // let tot3=0;
        // let tot4=0;
        // let totOmset=0;
        // const {
        //     total,
        //     per_page,
        //     offset,
        //     to,
        //     last_page,
        //     current_page,
        //     from,
        //     data,
        //     summary
        // } = this.props.data;
        const { total, per_page, current_page, data } = this.props.data;
        const head = [
          { label: "No", width: "1%", rowSpan: 2, className: "text-center" },
          { label: "#", width: "1%", rowSpan: 2, className: "text-center" },
          { label: "GAMBAR", width: "1%", rowSpan: 2 },
          { label: "NAMA", rowSpan: 2 },
          { label: "STATUS", width: "1%", colSpan: 5 },
          { label: "TOTAL OMSET",width: "1%", rowSpan: 2 },
        ];
        const rowSpan = [
          { label: "MENUNGGU PEMBAYARAN", className: "text-center" },
          { label: "DIKEMAS", className: "text-center" },
          { label: "DIKIRIM", className: "text-center" },
          { label: "SELESAI", className: "text-center" },
          { label: "DIBATALKAN", className: "text-center" },
        ];
        return(
            <Layout page={"Laporan Paket Barang"}>
              <HeaderGeneralCommon
                pathName="reportPin"
                col="col-md-5"
                callbackGet={(res) => {
                  this.setState({ any: res });
                  this.handleGet(res, 1);
                }}
                isPeriode={true}
                callbackExport={(e) => this.printDocumentXLsx(e,total)}
              />
              <TableCommon
                head={head}
                rowSpan={rowSpan}
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
                                <ButtonActionTableCommon action={[{ label: "Detail" }]} callback={(e) => {if (e === 0) this.handleDetail(v.id, v.title);}} />
                              </td>
                              <td className="middle nowrap">
                              <img
                                style={{height:'50px',width:'50px',objectFit:"scaleDown"}}
                                src={v.foto}
                                onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}}
                                alt="member_image"/>
                              </td>
                              <td className="middle nowrap text-left">{v.title}</td>
                              <td className="middle nowrap text-center">
                                <img
                                alt="images"
                                style={{width:'40px'}}
                                onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}}
                                className="svg icon" id="Dibatalkan"
                                src={statusOrder('dollar',4)}/>
                                &nbsp;&nbsp;&nbsp;{v.menunggu_pembayaran}
                              </td>
                              <td className="middle nowrap text-center">
                                <img alt="images" style={{width:'40px'}} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dibatalkan" src={statusOrder('packing',1)}/>
                                &nbsp;&nbsp;&nbsp;{v.dikemas}
                              </td>
                              <td className="middle nowrap text-center">
                                <img alt="images" style={{width:'40px'}} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dibatalkan" src={statusOrder('truck',2)}/>
                                &nbsp;&nbsp;&nbsp;{v.dikirim}
                              </td>
                              <td className="middle nowrap text-center">
                                <img alt="images" style={{width:'40px'}} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dibatalkan" src={statusOrder('confirm',3)}/>
                                &nbsp;&nbsp;&nbsp;{v.selesai}
                              </td>
                              <td className="middle nowrap text-center">
                                <img alt="images" style={{width:'40px'}} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dibatalkan" src={statusOrder('dollar',4)}/>
                                &nbsp;&nbsp;&nbsp;{v.dibatalkan}
                              </td>
                              <td className="middle nowrap text-right">
                                {parseInt(v.total_omset,10)===0?0:toCurrency(v.total_omset)}
                              </td>

                            </tr>
                          );
                        })
                      : noData(head.length)
                    : noData(head.length)
                }
              />
                {/* <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Laporan Saldo</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-6 col-xs-6 col-md-3">
                                                <div className="form-group">
                                                    <label>Periode </label>
                                                    <DateRangePicker
                                                        autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.handleEvent}>
                                                        <input type="text" readOnly={true} className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                                    </DateRangePicker>
                                                </div>
                                            </div>

                                            <div className="col-12 col-xs-12 col-md-3">
                                                <div className="form-group">
                                                    <label>Cari</label>
                                                    <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xs-6 col-md-2" style={{textAlign:"right"}}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                                        <i className="fa fa-search"/>
                                                    </button>
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                                        <i className="fa fa-print"/> {!this.props.isLoadingExcel?'Export':'loading...'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>NO</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>#</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>GAMBAR</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>NAMA</th>
                                            <th className="text-black" colSpan="5" style={columnStyle}>STATUS</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>TOTAL OMSET</th>

                                        </tr>
                                        <tr>
                                            <th className="text-black" style={columnStyle}>MENUNGGU PEMBAYARAN</th>
                                            <th className="text-black" style={columnStyle}>DIKEMAS</th>
                                            <th className="text-black" style={columnStyle}>DIKIRIM</th>
                                            <th className="text-black" style={columnStyle}>SELESAI</th>
                                            <th className="text-black" style={columnStyle}>DIBATALKAN</th>
                                        </tr>


                                        </thead>
                                        <tbody>
                                        {

                                            !this.props.isLoading? typeof data==='object'? data.length > 0 ?
                                                data.map((v, i) => {
                                                tot0=tot0+parseInt(v.menunggu_pembayaran,10);
                                                tot1=tot1+parseInt(v.dikemas,10);
                                                tot2=tot2+parseInt(v.dikirim,10);
                                                tot3=tot3+parseInt(v.selesai,10);
                                                tot4=tot4+parseInt(v.dibatalkan,10);
                                                totOmset=totOmset+parseInt(v.total_omset,10);
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <button className={"btn btn-primary btn-sm"} onClick={(e)=>this.handleDetail(e,v.id,v.title)}><i className={"fa fa-eye"}/></button>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <img  style={{height:'50px',width:'50px',objectFit:"scaleDown"}} src={v.foto} onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}} alt="member image"/>
                                                            </td>
                                                            <td style={columnStyle}>{v.title}</td>
                                                            <td style={numStyle}>
                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="BelumBayar" src={statusOrder('dollar',4)}/>
                                                                &nbsp;&nbsp;&nbsp;{v.menunggu_pembayaran}
                                                            </td>
                                                            <td style={numStyle}>
                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dikemas" src={statusOrder('packing',1)}/>
                                                                &nbsp;&nbsp;&nbsp;{v.dikemas}
                                                            </td>
                                                            <td style={numStyle}>
                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dikirim" src={statusOrder('truck',2)}/>
                                                                &nbsp;&nbsp;&nbsp;{v.dikirim}
                                                            </td>
                                                            <td style={numStyle}>
                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Selesai" src={statusOrder('confirm',3)}/>
                                                                &nbsp;&nbsp;&nbsp;{v.selesai}
                                                                </td>
                                                            <td style={numStyle}>
                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="Dibatalkan" src={statusOrder('dollar',4)}/>
                                                                &nbsp;&nbsp;&nbsp;{v.dibatalkan}
                                                            </td>
                                                            <td className={"txtRed"} style={numStyle}>Rp {parseInt(v.total_omset,10)===0?0:toCurrency(v.total_omset)} .-</td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={10} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                                </tr>:
                                                <tr>
                                                    <td colSpan={10} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                                </tr> : (()=>{
                                                let container =[];
                                                for(let x=0; x<10; x++){
                                                    container.push(
                                                        <tr key={x}>
                                                            <td style={columnStyle}>{<Skeleton circle={true} height={40} width={40}/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton circle={true} height={40} width={40}/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                            <td style={columnStyle}>{<Skeleton/>}</td>
                                                        </tr>
                                                    )
                                                }
                                                return container;
                                            })()
                                        }
                                        </tbody>
                                        <tfoot style={{backgroundColor:"#EEEEEE"}}>
                                        <tr>
                                            <th colSpan={4}>TOTAL PERHALAMAN</th>
                                            <th colSpan={1} style={numStyle}>{tot0===0?0:toCurrency(tot0)}</th>
                                            <th colSpan={1} style={numStyle}>{tot1===0?0:toCurrency(tot1)}</th>
                                            <th colSpan={1} style={numStyle}>{tot2===0?0:toCurrency(tot2)}</th>
                                            <th colSpan={1} style={numStyle}>{tot3===0?0:toCurrency(tot3)}</th>
                                            <th colSpan={1} style={numStyle}>{tot4===0?0:toCurrency(tot4)}</th>
                                            <th className={"txtRed"} colSpan={1} style={numStyle}>Rp {totOmset===0?0:toCurrency(totOmset)} .-</th>

                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div style={{"marginTop":"20px","marginBottom":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={current_page}
                                        per_page={per_page}
                                        total={total}
                                        callback={this.handlePage}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div> */}
                {
                    this.props.isOpen===true?<DetailLaporanBarang detail={this.state.detail}/>:null
                }
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
        isLoading: state.reportBarangReducer.isLoading,
        data:state.reportBarangReducer.data,
        isLoadingExcel: state.reportBarangReducer.isLoadingExcel,
        dataExcel:state.reportBarangReducer.excel,
    }
}


export default connect(mapStateToProps)(IndexReportBarang);