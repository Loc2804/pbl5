import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import './UserAccount.scss';
import { FormattedMessage } from 'react-intl';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
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
                        <h4 className="card-title text-center mb-4">Login</h4>

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
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={this.state.password}
                                onChange={(event) => this.handleOnChangeInput(event, 'password')}
                            />
                        </div>

                        <button className="btn btn-primary w-100" onClick={this.handleSubmit}>
                            Login
                        </button>

                        <div className="text-center mt-3">
                            <p>
                                Don't have an account?{' '}
                                <span
                                    className="text-primary cursor-pointer"
                                    onClick={this.handleToggleMode}
                                >
                                <a href="/pages/regist" className="text-decoration-none">
                                    Sign Up
                                </a>
                                </span>
                            </p>
                        </div>
                        <div className="text-center mt-3">
                            <a href="/pages/forgot-password" className="text-decoration-none">
                                Forgot Password?
                            </a>
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
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
