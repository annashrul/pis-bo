import React,{Component} from 'react';
import {connect} from "react-redux";
import {ToastQ} from "helper"
import {EditorState,convertToRaw, ContentState,convertFromHTML} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import File64 from 'components/common/File64'

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            deskripsi:'',
            id:'',
            telp_cs:'',
            fb:'',
            tw:'',
            ig:'',
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
        };

        this.handleBtnSubmit = this.handleBtnSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
   
    static getDerivedStateFromProps(props, state) {
        if (props.data !== undefined && props.data.length !== 0) {
            if (props.data !== state.prevDataProps) {
                return {
                    prevDataProps: props.data,
                    id:props.data.id,
                    telp_cs: props.data.telp_cs,
                    fb: props.data.fb,
                    tw: props.data.tw,
                    ig: props.data.ig
                }

            }
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            deskripsi: ((draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState,
        });
    };
    handleChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    handleBtnSubmit(e,type){
        e.preventDefault();
        let data=null;
        if (type === 'deskripsi') {
            if (this.state.deskripsi === '') {
                ToastQ.fire({
                    icon: 'error',
                    title: `Belum ada perubahan.`
                });
            }else{
                data={deskripsi:this.state.deskripsi}
            }
        }else data={[type]:this.state[type]}

        if(data!==null){
            this.props.handleUpdate(data)
        }
    }

    render(){
        return(
            <div className="card">
                <div className="card-body" style={{backgroundColor:"#343a40f0"}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className='form-group'>
                                <label>Whatsapp CS <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'telp_cs')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='telp_cs' onChange={this.handleChange} value={this.state.telp_cs} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Facebook <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'fb')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='fb' onChange={this.handleChange} value={this.state.fb} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Twitter <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'tw')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='tw' onChange={this.handleChange} value={this.state.tw} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Instagram <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'ig')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='ig' onChange={this.handleChange} value={this.state.ig} className="form-control" placeholder="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Index;