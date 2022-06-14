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
            id:'',
            title:'',
            deskripsi1:'',
            editorState1: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            title2:'',
            deskripsi2:'',
            editorState2: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            title3:'',
            deskripsi3:'',
            editorState3: EditorState.createWithContent(
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
                    title: props.data.title,
                    
                    pricing1: props.data.data[0],
                    pricing2: props.data.data[1],
                    pricing3: props.data.data[2],

                    editorState1: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[0].deskripsi)
                        )
                    ),
                    editorState2: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[1].deskripsi)
                        )
                    ),
                    editorState3: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[2].deskripsi)
                        )
                    ),
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
    onEditorStateChange1 = (editorState) => {
        this.setState({
            deskripsi1: ((draftToHtml(convertToRaw(this.state.editorState1.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState1:editorState,
        });
    };
    onEditorStateChange2 = (editorState) => {
        this.setState({
            deskripsi2: ((draftToHtml(convertToRaw(this.state.editorState2.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState2:editorState,
        });
    };
    onEditorStateChange3 = (editorState) => {
        this.setState({
            deskripsi3: ((draftToHtml(convertToRaw(this.state.editorState3.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState3:editorState,
        });
    };
    handleChange(e){
        const target = e.target.name;
        let res=[];
        if(target === 'title'){
            this.setState({
                title: e.target.value
            })
        } else {
            if (target === 'title1' || target === 'title2' || target === 'title3'){
                const data = target === 'title1' ? this.state.pricing1 : target === 'title2' ? this.state.pricing2 : this.state.pricing3;
                const datum= Object.assign({},data,{
                    title:e.target.value
                })
                this.setState({
                    [target === 'title1'?'pricing1':target === 'title2'?'pricing2':'pricing3']: datum
                })
            } else if (target === 'desc1' || target === 'desc2' || target === 'desc3'){
                const data = target === 'desc1' ? this.state.pricing1 : target === 'desc2' ? this.state.pricing2 : this.state.pricing3;
                const datum= Object.assign({},data,{
                    deskripsi:e.target.value
                })
                this.setState({
                    [target === 'desc1'?'pricing1':target === 'desc2'?'pricing2':'pricing3']: datum
                })
            }else{
                const data = target === 'harga1' ? this.state.pricing1 : target === 'harga2' ? this.state.pricing2 : this.state.pricing3;
                const datum = Object.assign({}, data, {
                    harga: e.target.value
                })
                this.setState({
                    [target === 'harga1' ? 'pricing1' : target === 'harga2' ? 'pricing2' : 'pricing3']: datum
                })
            }
        }
    }

    handleBtnSubmit(e,tipe){
        e.preventDefault();
        let data=null;
        let id='';
        const type = tipe.split("_");
        // console.log(type);
        if(type[0]==='pricing1'){
            if (type[1] === 'deskripsi') {
                if (this.state.pricing1.deskripsi === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.pricing1.deskripsi}
                }
            }else if (type[1]==='title') data={title:this.state.pricing1.title}
            else if (type[1]==='harga') data={harga:this.state.pricing1.harga}
            id=this.state.pricing1.id;
        }else if(type[0]==='pricing2'){
            if (type[1] === 'deskripsi') {
                if (this.state.pricing2.deskripsi === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.pricing2.deskripsi}
                }
            }else if (type[1]==='title') data={title:this.state.pricing2.title}
            else if (type[1]==='harga') data={harga:this.state.pricing2.harga}
            id=this.state.pricing2.id;
        }else if(type[0]==='pricing3'){
            if (type[1] === 'deskripsi') {
                if (this.state.pricing3.deskripsi === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.pricing3.deskripsi}
                }
            }else if (type[1]==='title') data={title:this.state.pricing3.title}
            else if (type[1]==='harga') data={harga:this.state.pricing3.harga}
            id=this.state.pricing3.id;
        }else{
            if (type[0]==='title') data={title:this.state.title}
            
            id=this.state.id;
        }

        if(data!==null){
            // console.log(id);
            this.props.handleUpdate(e,data,id,type)
        }
    }

    render(){
        return(
            <div className="card">
                <div className="card-body" style={{backgroundColor:"#343a40f0"}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title' onChange={this.handleChange} value={this.state.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                        </div>
                        {/* 
                        * STEP SECTION
                        */}
                        <div className="col-md-12">
                            <h6 className="text-light" style={{marginTop:'20px'}}>Pricing 1</h6>
                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing1_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title1' onChange={this.handleChange} value={this.state.pricing1.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing1_harga')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='harga1' onChange={this.handleChange} value={this.state.pricing1.harga} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing1_deskripsi')}>Simpan</button></label>
                                {/* <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState1}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor text-light bg-dark px-2"
                                    onEditorStateChange={this.onEditorStateChange1}
                                /> */}
                                <textarea class="form-control" rows="2" name='desc1' onChange={this.handleChange} value={this.state.pricing1.deskripsi}></textarea>
                                <small className="text-warning">Deskripsi dipisahkan dengan tanda koma (,) untuk 1 barisnya.</small>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h6 className="text-light" style={{marginTop:'20px'}}>Pricing 2</h6>

                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing2_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title2' onChange={this.handleChange} value={this.state.pricing2.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing2_harga')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='harga2' onChange={this.handleChange} value={this.state.pricing2.harga} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing2_deskripsi')}>Simpan</button></label>
                                {/* <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState2}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor text-light bg-dark px-2"
                                    onEditorStateChange={this.onEditorStateChange2}
                                /> */}
                                <textarea class="form-control" rows="2" name='desc2' onChange={this.handleChange} value={this.state.pricing2.deskripsi}></textarea>
                                <small className="text-warning">Deskripsi dipisahkan dengan tanda koma (,) untuk 1 barisnya.</small>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h6 className="text-light" style={{marginTop:'20px'}}>Pricing 3</h6>

                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing3_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title3' onChange={this.handleChange} value={this.state.pricing3.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing3_harga')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='harga3' onChange={this.handleChange} value={this.state.pricing3.harga} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'pricing3_deskripsi')}>Simpan</button></label>
                                {/* <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState3}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor text-light bg-dark px-2"
                                    onEditorStateChange={this.onEditorStateChange3}
                                /> */}
                                <textarea class="form-control" rows="2" name='desc3' onChange={this.handleChange} value={this.state.pricing3.deskripsi}></textarea>
                                <small className="text-warning">Deskripsi dipisahkan dengan tanda koma (,) untuk 1 barisnya.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Index;