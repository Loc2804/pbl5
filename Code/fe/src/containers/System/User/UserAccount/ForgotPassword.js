import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class ForgotPassword extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            username:'',
            phone:'',
        }
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }
 handleOnChangeInput = (event, id) => {
            let copyState = { ...this.state };
            copyState[id] = event.target.value;
            this.setState({
                ...copyState
            });
        };
    handleToggleMode = () => {
        this.setState(prevState => ({ isSignUp: !prevState.isSignUp }));
    };

    handleSubmit = () => {
        console.log(this.state);
    };
    render() {     
        
        return (
            <Fragment> 
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="card shadow-sm p-4" style={{ width: '22rem' }}>
                        <h4 className="card-title text-center mb-4">Forgot Password</h4>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="Enter your username"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, 'username')}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Phone Number</label>
                            <input
                                type="phone"
                                id="phone"
                                className="form-control"
                                placeholder="Enter your phone"
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangeInput(event, 'phone')}
                            />
                        </div>

                        <button className="btn btn-primary w-100" onClick={this.handleSubmit}>
                            Find Password
                        </button>

                        <div className="text-center mt-3">
                            <p>
                                Do have an account?{' '}
                                <span
                                    className="text-primary cursor-pointer"
                                    onClick={this.handleToggleMode}
                                >
                                <a href="/pages/logon" className="text-decoration-none">
                                   Login
                                </a>
                                </span>
                            </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
