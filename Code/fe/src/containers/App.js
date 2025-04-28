import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
// import Login from '../routes/Login';
import Login from '../containers/Auth/Login'
import Header from './Header/Header';
import System from '../routes/System';
import CustomScrollbars from '../components/CustomScrollbars.js';
import { PhoneOutlined, MessageOutlined , InstagramOutlined} from '@ant-design/icons';
import { FloatButton } from 'antd';
import 'antd/dist/reset.css'; // Sử dụng phiên bản Ant Design mới hơn
import SignIn from './System/User/UserAccount/SignIn.js';
import ForgotPassword  from './System/User/UserAccount/ForgotPassword.js';
import SignUp  from './System/User/UserAccount/SignUp.js';
import ManageUser from './System/Admin/ManageUser.js';
import HomePage from './HomePage/App/HomePage.js';
import CameraLearning from './HomePage/App/CameraLearning.js';
import Learning from './HomePage/App/Learning.js';
import Review from './HomePage/App/Review.js';
import Test from './HomePage/App/Test.js';
import Speaking from './HomePage/App/Speaking.js';
import AccountUser from './System/User/UserInfo/AccountUser.js';
import TestHistory from './System/User/UserInfo/TestHistory.js';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }
    handleClick = () =>{
        window.open('https://www.facebook.com/nguyenloc2804', '_blank');
    }
    handleClick1 = () =>{
        window.open('https://www.facebook.com/ngoc.huynh.946499', '_blank');
    }
    handleClick2 = () =>{
        window.open('https://www.facebook.com/an.van.26751', '_blank');
    }
    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        
                        <div className="content-container">
                            <CustomScrollbars style={{height: '100vh', width:'100%'}}>
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />

                                <Route path={path.SIGNIN} exact component={(SignIn)} />
                                <Route path={path.REGIST} exact component={(SignUp)} />
                                <Route path={path.FORGOT} exact component={(ForgotPassword)} />

                                <Route path={path.HOMEPAGE} exact component={(HomePage)} />
                                <Route path={path.CAMERA} exact component={(CameraLearning)} />
                                <Route path={path.LEARNING} exact component={(Learning)} />
                                <Route path={path.REVIEW} exact component={(Review)} />
                                <Route path={path.TEST} exact component={(Test)} />
                                <Route path={path.SPEAKING} exact component={(Speaking)} />

                                <Route path={path.ACCOUNT} exact component={(AccountUser)} />   
                                <Route path={path.HISTORY} exact component={(TestHistory)} />  

                            </Switch>  
                            </CustomScrollbars>
                        </div>
                        <FloatButton
                            icon={<PhoneOutlined  />}
                            type="primary"
                            onClick={()=> this.handleClick()}
                            className="custom-float-btn"
                            fontSizeIcon='20px'
                            style={{
                                // insetInlineEnd: 24,      // Cách lề phải 24px
                                bottom: 150,             // Cách đáy 100px
                                // fontSize: '25px !important'          // Kích thước icon
                            }}
                        />
                        <FloatButton
                            icon={<MessageOutlined style={{ fontSize: '20px', color: 'white' }} />}
                            onClick={()=> this.handleClick1()}
                            type="primary"
                            className="custom-float-btn"
                            fontSizeIcon='20px'
                            style={{
                                insetInlineEnd: 24,      // Cách lề phải 24px
                                bottom: 100,             // Cách đáy 100px
                                // fontSize: '25px !important'          // Kích thước icon
                            }}
                        />
                        <FloatButton
                            icon={<InstagramOutlined style={{ fontSize: '20px', color: 'white' }} />}
                            onClick={()=> this.handleClick2()}
                            type="primary"
                            className="custom-float-btn"
                            fontSizeIcon='20px'
                            style={{
                                insetInlineEnd: 24,      // Cách lề phải 24px
                                bottom: 50,             // Cách đáy 100px
                                // fontSize: '25px !important'          // Kích thước icon
                            }}
                        />
                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />

                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);