import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { userRegister } from '../../../../services/userService';
import { toast } from 'react-toastify';

class SignUp extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            username:'',
            password:'',
            age:'',
            phone:'',
            address:'',
            fullname:'',
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

    handleClearInput = () => {
        this.setState({
            username: '',
            password: '',
            age: '',
            phone: '',
            address: '',
            fullname: '',
        });
    };

    handleSubmit = async () => {
        let data ={
            username: this.state.username,
            password: this.state.password,
            age: this.state.age,
            phone: this.state.phone,
            address: this.state.address,
            fullname: this.state.fullname,
        }
        let res = await userRegister(data);
        if (res && res.errCode === 0) {
            toast.success('Register success!');
            this.handleClearInput();
        } else {
            toast.error(res.error);
        }
    };
    render() {     
        
        return (
            <Fragment> 
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="card shadow-sm p-4" style={{ width: '40rem' }}>
                        <h4 className="card-title text-center mb-4">Sign Up</h4>

                        <div className='row'>
                            <div className="mb-3 col-6">
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

                            <div className="mb-3 col-6">
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
                        </div>
                        <div className='row'>
                            <div className="mb-3 col-6">
                                <label htmlFor="fullname" className="form-label">Full name</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    className="form-control"
                                    placeholder="Enter your name"
                                    value={this.state.fullname}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullname')}
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    className="form-control"
                                    placeholder="Enter your address"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="phone" className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="form-control"
                                    placeholder="Enter your phone number"
                                    value={this.state.phone}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phone')}
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="age" className="form-label">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    className="form-control"
                                    placeholder="Enter your age"
                                    min="10"
                                    max="100"
                                    value={this.state.age}
                                   onChange={(event) => this.handleOnChangeInput(event, 'age')}
                                />
                            </div>
                        </div>
                        

                        <button className="btn btn-primary w-100" onClick={this.handleSubmit}>
                            Sign Up
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
