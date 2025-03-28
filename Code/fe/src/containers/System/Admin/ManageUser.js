import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import "./AdminPage.scss";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSection from './AdminSection';
import './ManageUser.scss';
import { FormattedMessage } from 'react-intl';
import AddUser from './UserComponent/AddUser';
class ManageUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            isShowModalAdd:false,
        }
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
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
    render() {     
        
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
                                    />
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
