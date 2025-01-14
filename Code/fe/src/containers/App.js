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
import { PhoneOutlined, MessageOutlined  } from '@ant-design/icons';
import { FloatButton } from 'antd';
import 'antd/dist/reset.css'; // Sử dụng phiên bản Ant Design mới hơn


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