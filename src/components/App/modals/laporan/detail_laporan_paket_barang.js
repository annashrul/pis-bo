import React,{Component} from 'react';
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {
    ModalBody,
    ModalHeader
} from "reactstrap";
import {ModalToggle} from "../../../../redux/actions/modal.action";
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";
import Paginationq, {toCurrency, toExcel, toRp} from "../../../../helper";
import {
    getDetailReportBarang,
    getExcelDetailReportBarang
} from "../../../../redux/actions/laporan/report_barang.action";


class DetailLaporanBarang extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.printDocumentXLsx = this.printDocumentXLsx.bind(this);
    }


    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    componentWillMount(){
        this.props.dispatch(getDetailReportBarang(this.props.detail.id,`page=1&${this.props.detail.where}`));
    }
    handlePage(num){
        this.props.dispatch(getDetailReportBarang(this.props.detail.id,`page=${num}&perpage=10&${this.props.detail.where}`));
    }

    printDocumentXLsx = (e,param) => {
        this.props.dispatch(getExcelDetailReportBarang(this.props.detail.id,`perpage=${param}&${this.props.detail.where}`));

    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataExcel.data!==this.props.dataExcel.data){
            this.getExcel(this.props);
        }
    }
    getStatus(param){
        if(param===0){
            return 'Menunggu Pembayaran';
        }
        if(param===1){
            return 'Dikemas';
        }
        if(param===2){
            return 'Dikirim';
        }
        if(param===3){
            return 'Selesai';
        }
        if(param===4){
            return 'Dibatalkan';
        }
    }
    getExcel(props){
        if(props.dataExcel.data!==undefined){
            if(props.dataExcel.data.length>0){
                let content=[];
                // console.log(props);
                props.dataExcel.data.map((v,i)=>{
                    content.push([
                        v.kd_trx,
                        parseInt(v.point_volume,10),
                        parseInt(v.price,10),
                        parseInt(v.qty,10),
                        parseInt(v.ppn,10),
                        this.getStatus(v.status),
                        moment(v.tgl_beli).format('YYYY-MM-DD'),
                    ]);
                    return null;
                });
                toExcel(
                    `LAPORAN ${this.props.detail.nama}`.toUpperCase(),
                    ``,
                    [
                        'KODE TRANSAKSI',
                        'POINT VOLUME',
                        'HARGA',
                        'QTY',
                        'PPN',
                        'STATUS',
                        'TANGGAL BELI'
                    ],
                    content,
                )
            }
        }
    }
    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            last_page,
            current_page,
            data,
        } = this.props.data;
        let totQty=0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailLaporanBarangPaket"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail {this.props.detail.nama}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group" style={{textAlign:"right"}}>
                                <button style={{marginRight:"5px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                    <i className="fa fa-print"/> {!this.props.isLoadingExcel?'Export':'loading...'}
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead>
                                    <tr>
                                        <th className="text-light" style={columnStyle}>NO</th>
                                        <th className="text-light" style={columnStyle}>KD TRX</th>
                                        <th className="text-light" style={columnStyle}>PV</th>
                                        <th className="text-light" style={columnStyle}>HARGA</th>
                                        <th className="text-light" style={columnStyle}>QTY</th>
                                        <th className="text-light" style={columnStyle}>PPN</th>
                                        <th className="text-light" style={columnStyle}>STATUS</th>
                                        <th className="text-light" style={columnStyle}>TANGGAL</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        !this.props.isLoading? typeof data==='object'? data.length > 0 ?
                                            data.map((v, i) => {
                                            totQty=totQty+v.qty;
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>
                                                            <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                        </td>
                                                        <td style={columnStyle}>{v.kd_trx}</td>
                                                        <td style={numStyle}>{toRp(v.point_volume)}</td>
                                                        <td className={"txtRed"} style={numStyle}>{toCurrency(parseFloat(v.price).toFixed(2))}</td>
                                                        <td style={numStyle}>{toRp(v.qty)}</td>
                                                        <td style={numStyle}>{toRp(v.ppn)}</td>
                                                        <td style={columnStyle}>{this.getStatus(v.status)}</td>
                                                        <td style={columnStyle}>{moment(v.tgl_beli).format('YYYY-MM-DD')}</td>
                                                    </tr>
                                                );
                                            })
                                            : <tr>
                                                <td colSpan={8} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA} alt="img"/></td>
                                            </tr>:
                                            <tr>
                                                <td colSpan={8} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA} alt="img"/></td>
                                            </tr> : (()=>{
                                            let container =[];
                                            for(let x=0; x<7; x++){
                                                container.push(
                                                    <tr key={x}>
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
                                    <tfoot className="bg-dark text-light">
                                    <tr>
                                        <th colSpan={4}>TOTAL PERHALAMAN</th>
                                        <th colSpan={1} style={numStyle}>{totQty===0?0:toRp(totQty)}</th>
                                        <th colSpan={3}/>
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
                </ModalBody>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        data:state.reportBarangReducer.detail,
        isLoading:state.reportBarangReducer.isLoadingDetail,
        dataExcel:state.reportBarangReducer.detailExcel,
        isLoadingExcel:state.reportBarangReducer.isLoadingDetailExcel,
    }
}

export default connect(mapStateToProps)(DetailLaporanBarang);
