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
            title:'',
            tag:'',
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
                    editorState: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.deskripsi)
                        )
                    ),
                    id:props.data.id,
                    title: props.data.title,
                    tag: props.data.tag
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
            this.props.handleUpdate(e,data,this.state.id,type)
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
                            <div className='form-group'>
                                <label>Tag <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'tag')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='tag' onChange={this.handleChange} value={this.state.tag} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'deskripsi')}>Simpan</button></label>
                                <Editor
                                    editorState={this.state.editorState}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="main-editor text-light bg-dark px-2"
                                    onEditorStateChange={this.onEditorStateChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Index;