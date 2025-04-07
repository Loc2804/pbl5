import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import "./AdminPage.scss";
import * as actions from "../../../store/actions";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSection from './AdminSection';
import './ManageVoc.scss';
import { FormattedMessage } from 'react-intl';
import AddUser from './UserComponent/AddUser';
import {createNewVocService, editVocService, deleteVocService, getAllCategory } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ModalVoc from './VocComponent/ModalVoc';
class ManageVoc extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            vocEdit:{}, //voc edit
            isShowModalAdd:false,
            listVoc:[],
            currentPage:0,
            vocPerPage:5,
            categoryList:[],
        }
    }
    
    async componentDidMount() {
        this.props.getAllVoc();
        this.props.getAllCategory();
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.listCategory !== prevProps.listCategory){
            this.setState({
                categoryList: this.props.listCategory,
            })
        }
        
        if(this.props.listVoc !== prevProps.listVoc){
            this.setState({
                listVoc: this.props.listVoc,
            })
        }
    }

    showAddModal = () =>{
        this.setState({
            isShowModalAdd:true,
        })
    }
    closeAddModal = () =>{
        this.setState({
            isShowModalAdd:false,
        })
    }
    createNewVoc = async (data) =>{
        if(data.word === '' || data.meaning === '' ){
            toast.error("Missing word or meaning!");
            return;
        }
        let res = await createNewVocService(data);
        if(res && res.errCode === 0){
            this.setState({
                isShowModalAdd:false,
            })
            toast.success("Create new vocabulary succeed!");
            await this.props.getAllVoc();
        }
        else
        {
            toast.error(res.message);
        }
    }

    handlePageClick = (event) =>{
        let selectedPage = event.selected;
        this.setState({
            currentPage:selectedPage
        })
    }

    editVoc = (data) =>{
        this.setState({
            isShowModalAdd:true,
            vocEdit:data,
        })
    }

    handleEditVoc = async (data) =>{
        let res = await editVocService(data);
        if(res && res.errCode === 0){
            this.setState({
                isShowModalAdd:false,
            })
            toast.success("Edit Voc succeed!");
            await this.props.getAllVoc();
        }
        else
        {
            toast.error(res.message);
        }
    }
    handleDeleteVoc = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await deleteVocService(data.id);
                if (res && res.errCode === 0) {
                    toast.success("Delete Vocab succeed!");
                    await this.props.getAllVoc();
                } else {
                    toast.error(res.message);
                }
            }
        });
    }
    render() {     
        let arrVoc = this.state.listVoc || [];
        const { currentPage, vocPerPage } = this.state;
        const offset = currentPage * vocPerPage;
        const currentVoc = arrVoc.slice(offset, offset + vocPerPage);
        const pageCount = Math.ceil(arrVoc.length / vocPerPage);
        return (
            <Fragment> 
                <div className="sb-nav-fixed">
                    <AdminHeader/>
                    <div id="layoutSidenav">
                        <AdminSection/>
                        <div id="layoutSidenav_content">
                            <div className='body-container'>
                                <div className='body-title'>
                                    <h2>Manage Vocabularies</h2>
                                    <button className='btn btn-primary btn-add' onClick={() => this.showAddModal()}>Add new Vocabulary</button>
                                    <ModalVoc isShow = {this.state.isShowModalAdd}
                                        closeModal = {this.closeAddModal}
                                        handleCreateVocabulary = {this.createNewVoc}
                                        vocabEdit = {this.state.vocEdit}
                                        editVoc = {this.editVoc}
                                        handleEditVocabulary = {this.handleEditVoc}
                                        categoryList = {this.state.categoryList}
                                    />
                                </div>
                                <div className='body-content'>
                                <div className='users-table my-4'>
                                    <table id="customers">
                                        <thead>
                                            <tr>
                                                <th>Word</th>
                                                <th>Pronunciation</th>
                                                <th>Meaning</th>
                                                <th>Example</th>
                                                <th>Category</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            currentVoc && currentVoc.map((item,index) =>{
                                                return( 
                                                    <tr key={index}>  
                                                        <td>{item.word}</td>
                                                        <td>{item.pronunciation}</td>
                                                        <td>{item.meaning}</td>
                                                        <td>{item.example}</td>
                                                        <td>{item.category.category_value}</td>
                                                        <td>
                                                            <button className="btn-edit" onClick={() => this.editVoc(item)}>
                                                                <i className="fas fa-pencil-alt btn-edit"></i>
                                                            </button>
                                                            <button className="btn-delete" onClick={() => this.handleDeleteVoc(item)}>
                                                                <i className="fas fa-trash btn-delete"></i>
                                                            </button>
                                                        </td> 
                                                    </tr>
                                                    )
                                            })
                                        } 
                                        </tbody>
                                    </table>
                                    <ReactPaginate
                                            breakLabel="..."
                                            nextLabel="Next"
                                            onPageChange={this.handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={pageCount}
                                            previousLabel="Prev"
                                            renderOnZeroPageCount={null}
                                            containerClassName={"pagination"}
                                            activeClassName={"active"}
                                        />
                                </div>
                                </div>
                            </div>
                            <AdminFooter/>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
        listVoc : state.admin.listVoc,
        listCategory: state.admin.listCategory,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllVoc : () => dispatch(actions.getAllVocStart()),
        getAllCategory : () => dispatch(actions.getAllCategoryStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageVoc);
