import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './UserComponent.scss';
import { FormattedMessage } from 'react-intl';

class AddUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            edit:false,
            id:'',
            username: '',
            full_name: '',
            phone: '',
            address: '',
            role: '1', 
            password: '',
        }
    }
    
    async componentDidMount() {
    }
    
    async componentDidUpdate(prevProps) {
        if (this.props.userEdit !== prevProps.userEdit) {
            if (this.props.userEdit && this.props.userEdit.id) {
                this.setState({
                    edit: true,
                    id: this.props.userEdit.id,
                    username: this.props.userEdit.username,
                    full_name: this.props.userEdit.full_name,
                    phone: this.props.userEdit.phone,
                    address: this.props.userEdit.address,
                    role: this.props.userEdit.role ? this.props.userEdit.role.role_id : '1',
                    password: '*********************',
                });
            } else {
                this.setState({
                    edit: false,
                    username: '',
                    password: '',
                    full_name: '',
                    phone: '',
                    address: '',
                    role: '1',
                });
            }
        }
    }

    handleChange = (event,id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleSubmit = () => {
        if( this.props.userEdit && this.props.userEdit.id && this.state.edit === true){
            this.props.handleEditUser({
                id: this.props.userEdit.id,
                username: this.state.username,
                password: this.state.password,
                full_name: this.state.full_name,
                phone: this.state.phone,
                address: this.state.address,
                role: this.state.role,
            })
        }
        else{
            this.props.createNewUser({
                username: this.state.username,
                password: this.state.password,
                full_name: this.state.full_name,
                phone: this.state.phone,
                address: this.state.address,
                role: this.state.role,
            });
        }
        this.clearForm();
    }
    clearForm = () =>{
        this.setState({
            id:'',
            edit:false,
            username: '',
            password: '',
            full_name: '',
            phone: '',
            address: '',
            role: '1',
        })
    }

    closeModal = () =>{
        this.props.closeModal();
    }
    render() {     
        let isShow = this.props.isShow;
        return (
            isShow === true ? 
            <Fragment> 
                <div className={`add-container ${this.props.isShow ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className='add-title'>
                            <h3 className='center'>{this.state.edit ? 'Edit User' : 'Add New User'}</h3>
                            <span className='btn-x' onClick={this.closeModal}>X</span>
                        </div>
                        <div className=' add-body row'>
                            <div className="form-group col-6">
                                <label>Username</label>
                                <input
                                    disabled={this.state.edit ? true : false}
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={this.state.username}
                                    onChange={(event) => this.handleChange(event, 'username')}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Password</label>
                                <input
                                    disabled={this.state.edit ? true : false}
                                    type="password"
                                    name="username"
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={(event) => this.handleChange(event, 'password')}
                                />
                            </div>

                            <div className="form-group col-6">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    className="form-control"
                                    value={this.state.full_name}
                                    onChange={(event) => this.handleChange(event, 'full_name')}
                                />
                            </div>

                            <div className="form-group col-6">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={this.state.phone}
                                    onChange={(event) => this.handleChange(event, 'phone')}
                                />
                            </div>

                            <div className="form-group col-6">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleChange(event, 'address')}
                                />
                            </div>

                            <div className="form-group col-6">
                                <label>Role</label>
                                <select
                                    name="role"
                                    className="form-control"
                                    value={this.state.role}
                                    onChange={(event) => this.handleChange(event, 'role')}
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                </select>
                            </div>

                            <button className="btn btn-primary btn-submit" onClick={this.handleSubmit}>
                                {this.props.userEdit ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
            :
            ''
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
