import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from '../containers/Header/Header';
import AdminPage from '../containers/System/Admin/AdminPage'
class System extends Component {
    render() {     
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        return (
            // userInfo && userInfo.roleId === 'ad' ? (
                <React.Fragment>
                    {/* {isLoggedIn && <Header />}  */}
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/system/admin" component={AdminPage} /> 
                                <Route component={() => <Redirect to={systemMenuPath} />} />
                            </Switch>
                        </div>
                    </div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
