import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import "./AdminPage.scss";
import "./General.scss"
import * as action from '../../../store/actions';
import { withRouter } from 'react-router-dom';
class AdminHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDropDown: false,
        };
        this.dropdownRef = React.createRef();
        this.navRef = React.createRef();  // Thêm một ref cho toàn bộ navbar
    }

    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleOutsideClick);
    }

    handleOutsideClick = (event) => {
        // Kiểm tra xem sự kiện click có xảy ra bên ngoài dropdown và navbar không
        if (
            this.dropdownRef.current && 
            !this.dropdownRef.current.contains(event.target) && 
            !this.navRef.current.contains(event.target)  // Kiểm tra click ngoài navbar
        ) {
            this.setState({ isShowDropDown: false });
        }
    };

    clickUser = () => {
        this.setState({
            isShowDropDown: !this.state.isShowDropDown,
        });
    }
    logOut = () => {
        this.props.processLogout();
        this.props.history.push('/login');
    }
    render() {     
        return (
            <Fragment>
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark" ref={this.navRef}>
                    <a className="navbar-brand ps-3" href="/system/admin">PBL5 Project</a>
                    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                        <div className="input-group">
                            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." />
                            <button className="btn btn-primary" type="button">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </form>
                    <div className='welcome' style={{ color: 'white' , minWidth: '200px'}}>Welcome, {this.props.userInfo && this.props.userInfo.full_name}</div>
                    <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                        <li className="nav-item dropdown">
                            <a className="nav-link" 
                                id="navbarDropdown" 
                                href="#"
                                onClick={() => this.clickUser()}
                            >
                                <i className="fas fa-user" style={{ color: 'white' }}></i>
                            </a>
                            {this.state.isShowDropDown ? (
                                <ul className="dropdown-menu dropdown-menu-end" ref={this.dropdownRef} aria-labelledby="navbarDropdown" style={{ display: 'block' }}>
                                    <li><a className="dropdown-item" href="#!">Manage Account</a></li>
                                    <li><a className="dropdown-item" href="#!">Settings</a></li>
                                    <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#!" onClick={this.logOut()}>Logout</a></li>
                                </ul>
                            ) : null}
                        </li>
                    </ul>
                </nav>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(action.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminHeader));
