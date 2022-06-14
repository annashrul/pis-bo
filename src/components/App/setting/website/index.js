import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Header from './header'
import Plan from './plan'
import Benefit from './benefit'
import Pricing from './pricing'
import Footer from './footer'
import Tambahan from './tambahan'
import {fetchLanding, updateLanding} from 'redux/actions/setting/general.action'
import Preloader from 'Preloader'
import { updateGeneral } from '../../../../redux/actions/setting/general.action';

class Website extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            section:'header',
        };
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleUpdatetambahan = this.handleUpdatetambahan.bind(this)
    }
    componentDidMount(){
        this.props.dispatch(fetchLanding());
    }

    handleOnchange(e,sct){
        this.setState({
            section:sct
        })
    }
    handleUpdate(e,data,id,type){
        this.props.dispatch(updateLanding(data,id,type))
    }
    handleUpdatetambahan(data){
        this.props.dispatch(updateGeneral(data,'general'))
    }
   

    render(){
        let header={};
        let plan={};
        let benefit={};
        let pricing={};
        let footer={};
        let tambahan={};
        if(this.props.landing.landing!==undefined && this.props.landing.landing.length>0){
            const snap=this.props.landing.landing;
            const snapPlan=this.props.landing.landing[1];
            const snapBenefit=this.props.landing.landing[2];
            const snapPricing=this.props.landing.landing[3];

            const indexHeader = snap.findIndex(item => item.id === 1);

            const indexPlan = snapPlan.findIndex(item => item.id === 2);
            const plan1 = snapPlan.findIndex(item => item.id === 3);
            const plan2 = snapPlan.findIndex(item => item.id === 4);

            const indexBenefit = snapBenefit.findIndex(item => item.id === 5);
            const benefit1 = snapBenefit.findIndex(item => item.id === 6);
            const benefit2 = snapBenefit.findIndex(item => item.id === 7);
            const benefit3 = snapBenefit.findIndex(item => item.id === 8);

            const indexPricing = snapPricing.findIndex(item => item.id === 9);
            const pricing1 = snapPricing.findIndex(item => item.id === 10);
            const pricing2 = snapPricing.findIndex(item => item.id === 11);
            const pricing3 = snapPricing.findIndex(item => item.id === 12);

            const indexFooter = snap.findIndex(item => item.id === 13);
            
            header={
                id: snap[indexHeader].id,
                title: snap[indexHeader].title,
                tag: snap[indexHeader].tag,
                deskripsi: snap[indexHeader].deskripsi
            }
            footer={
                id: snap[indexFooter].id,
                title: snap[indexFooter].title,
                deskripsi: snap[indexFooter].deskripsi
            }
            plan={
                id: snapPlan[indexPlan].id,
                title: snapPlan[indexPlan].title,
                data: [{
                    id: snapPlan[plan1].id,
                    title: snapPlan[plan1].title,
                    deskripsi: snapPlan[plan1].deskripsi
                }, {
                    id: snapPlan[plan2].id,
                    title: snapPlan[plan2].title,
                    deskripsi: snapPlan[plan2].deskripsi
                }]
            }
            benefit={
                id: snapBenefit[indexBenefit].id,
                title: snapBenefit[indexBenefit].title,
                data: [{
                    id: snapBenefit[benefit1].id,
                    title: snapBenefit[benefit1].title,
                    deskripsi: snapBenefit[benefit1].deskripsi
                }, {
                    id: snapBenefit[benefit2].id,
                    title: snapBenefit[benefit2].title,
                    deskripsi: snapBenefit[benefit2].deskripsi
                }, {
                    id: snapBenefit[benefit3].id,
                    title: snapBenefit[benefit3].title,
                    deskripsi: snapBenefit[benefit3].deskripsi
                },
                ]
            }
            pricing={
                id: snapPricing[indexPricing].id,
                title: snapPricing[indexPricing].title,
                data: [{
                    id: snapPricing[pricing1].id,
                    title: snapPricing[pricing1].title,
                    deskripsi: snapPricing[pricing1].deskripsi,
                    harga: snapPricing[pricing1].harga
                }, {
                    id: snapPricing[pricing2].id,
                    title: snapPricing[pricing2].title,
                    deskripsi: snapPricing[pricing2].deskripsi,
                    harga: snapPricing[pricing2].harga
                }, {
                    id: snapPricing[pricing3].id,
                    title: snapPricing[pricing3].title,
                    deskripsi: snapPricing[pricing3].deskripsi,
                    harga: snapPricing[pricing3].harga
                },
                ]
            }
        }
        if(this.props.landing.tambahan!==undefined && this.props.landing.tambahan.length>0){
            const snap=this.props.landing.tambahan[0];
            tambahan={
                telp_cs: snap.telp_cs,
                fb: snap.fb,
                tw: snap.tw,
                ig: snap.ig
            }
        }
        return(
            <Layout page={"Pengaturan Umum"}>
                <div className="row">
                    <div className="col-md-3 box-margin">
                        <div className="card bg-dark">
                            <div className="card-body">
                                <div className="nav flex-column nav-pills">
                                    <a className={this.state.section==='header'?"nav-link active":"nav-link"} onClick={(event)=>this.handleOnchange(event,'header')} href="#" >Header</a>
                                    <a className={this.state.section==='plan'?"nav-link active":"nav-link"}  onClick={(event)=>this.handleOnchange(event,'plan')} href="#">Plan</a>
                                    <a className={this.state.section==='benefit'?"nav-link active":"nav-link"}  onClick={(event)=>this.handleOnchange(event,'benefit')} href="#" >Benefit</a>
                                    <a className={this.state.section==='pricing'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'pricing')} href="#">Pricing</a>
                                    <a className={this.state.section==='footer'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'footer')} href="#">Footer</a>
                                    <a className={this.state.section==='tambahan'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'tambahan')} href="#">Tambahan</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 box-margin">
                        <div className="alert bg-secondary text-light">
                            Setelah melakukan perubahan silahkan <span style={{fontWeight:'800', color:'yellow'}}>tekan tombol <button onClick={e=>false} className="badge badge-success">simpan</button></span> untuk melakukan update sebelum merubah field yang lain.
                        </div>
                        <div className="card bg-dark">
                            <div class="card-header text-light">Section {this.state.section==='how'?"How it work":this.state.section.charAt(0).toUpperCase() + this.state.section.slice(1)}</div>
                            <div className="card-body">
                                {
                                    this.props.isLoading?
                                    <Preloader/>:
                                    this.state.section==='header'?
                                    <Header 
                                        data={header}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='plan'?
                                    <Plan 
                                        data={plan}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='benefit'?
                                    <Benefit
                                        data={benefit}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='pricing'?
                                    <Pricing
                                        data={pricing}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='footer'?
                                    <Footer 
                                        data={footer}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='tambahan'?
                                    <Tambahan 
                                        data={tambahan}
                                        handleUpdate={this.handleUpdatetambahan}
                                    />
                                    :''


                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    console.log("landing",state.generalReducer.landing);
    return {
        isLoading: state.generalReducer.isLoading,
        isOpen:state.modalReducer,
        landing:state.generalReducer.landing,
    }
}


export default connect(mapStateToProps)(Website);