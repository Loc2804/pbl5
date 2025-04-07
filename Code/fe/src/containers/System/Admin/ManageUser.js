import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import "./AdminPage.scss";
import * as actions from "../../../store/actions";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSection from './AdminSection';
import './ManageUser.scss';
import { FormattedMessage } from 'react-intl';
import AddUser from './UserComponent/AddUser';
import {getAllUserService, createNewUserService, deleteUserService, editUserService } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
class ManageUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            userEdit:{}, //user edit
            isShowModalAdd:false,
            listUser:[],
            currentPage:0,
            userPerPage:3,
        }
    }
    
    async componentDidMount() {
        this.props.getAllUser();
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.listUser !== prevProps.listUser){
            this.setState({
                listUser: this.props.listUser,
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
    createNewUser = async (data) =>{
        if(data.username === '' || data.password === '' ){
            toast.error("Missing username or password!");
            return;
        }
        let res = await createNewUserService(data);
        if(res && res.errCode === 0){
            this.setState({
                isShowModalAdd:false,
            })
            toast.success("Create new user succeed!");
            await this.props.getAllUser();
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

    editUser = (user) =>{
        this.setState({
            isShowModalAdd:true,
            userEdit:user,
        })
    }

    handleEditUser = async (data) =>{
        let res = await editUserService(data);
        console.log("check edit user", res);
        if(res && res.errCode === 0){
            this.setState({
                isShowModalAdd:false,
            })
            toast.success("Edit user succeed!");
            await this.props.getAllUser();
        }
        else
        {
            toast.error(res.message);
        }
    }
    handleDeleteUser = async (user) => {
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
                let res = await deleteUserService(user.id);
                if (res && res.errCode === 0) {
                    toast.success("Delete user succeed!");
                    await this.props.getAllUser();
                } else {
                    toast.error(res.message);
                }
            }
        });
    }
    render() {     
        let arrUser = this.state.listUser || [];
        const { currentPage, userPerPage } = this.state;
        const offset = currentPage * userPerPage;
        const currentUser = arrUser.slice(offset, offset + userPerPage);
        const pageCount = Math.ceil(arrUser.length / userPerPage);
        return (
            <Fragment> 
                <div className="sb-nav-fixed">
                    <AdminHeader/>
                    <div id="layoutSidenav">
                        <AdminSection/>
                        <div id="layoutSidenav_content">
                            <div className='body-container'>
                                <div className='body-title'>
                                    <h2>Manage Users</h2>
                                    <button className='btn btn-primary btn-add' onClick={() => this.showAddModal()}>Add new User</button>
                                    <AddUser isShow = {this.state.isShowModalAdd}
                                        closeModal = {this.closeAddModal}
                                        createNewUser = {this.createNewUser}
                                        userEdit = {this.state.userEdit}
                                        editUser = {this.editUser}
                                        handleEditUser = {this.handleEditUser}
                                    />
                                </div>
                                <div className='body-content'>
                                <div className='users-table my-4'>
                                    <table id="customers">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>Full Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            currentUser && currentUser.map((item,index) =>{
                                                return( 
                                                    <tr key={index}>  
                                                        <td>{item.id}</td>
                                                        <td>{item.username}</td>
                                                        <td>{item.full_name}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.role.role_value}</td>
                                                        <td>
                                                            <button className="btn-edit" onClick={() => this.editUser(item)}>
                                                                <i className="fas fa-pencil-alt btn-edit"></i>
                                                            </button>
                                                            <button className="btn-delete" onClick={() => this.handleDeleteUser(item)}>
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
        listUser : state.admin.listUser,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUser : () => dispatch(actions.getAllUserStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
