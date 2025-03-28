import React, { Component } from 'react';
import { connect } from "react-redux";
import { Router, Redirect, Route, Switch } from 'react-router-dom';
import { history } from '../redux'
import Header from '../containers/Header/Header';
import AdminPage from '../containers/System/Admin/AdminPage'
import ManageUser from '../containers/System/Admin/ManageUser'
import ManageVoc from '../containers/System/Admin/ManageVoc'
class System extends Component {
    render() {     
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        return (
            // userInfo && userInfo.roleId === 'ad' ? (
                <React.Fragment>
                    {/* {isLoggedIn && <Header />}  */}
                    <Router history={history}>
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route exact path="/system/admin" component={AdminPage} /> 
                                <Route path="/system/admin/user" exact component={ManageUser} /> 
                                <Route path="/system/admin/voc" exact component={ManageVoc} /> 
                                <Route component={() => <Redirect to={"/system/admin"} />} />
                            </Switch>
                        </div>
                    </div>
                    </Router>
                </React.Fragment>
            // ) : (
            //     <div>
            //         {isLoggedIn && <Header />} 
            //         <div className='title mt-3 text-danger'>
            //             BẠN KHÔNG CÓ QUYỀN HẠN CỦA ADMIN ĐỂ SỬ DỤNG CÁC CHỨC NĂNG NÀY !
            //         </div>
            //     </div>
            // )
            
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo : state.user.userInfo,
        started: state.app.started,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
