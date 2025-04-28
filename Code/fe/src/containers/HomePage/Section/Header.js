import React, { act, Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import './Section.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import * as action from '../../../store/actions';
import { withRouter } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false
        };
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            showMenu: !prevState.showMenu
        }));
    }

    logOut = () => {
        this.props.processLogout();
    }
    render() {
        const { isLoggedIn, userInfo } = this.props;
        const { showMenu } = this.state;

        return (
            <Fragment>
                <header className="app-header d-flex justify-content-between align-items-center px-4 py-2 shadow-sm bg-white">
                    {/* Logo */}
                    <div className="logo">
                        <Link to="/app/home" className="text-decoration-none text-dark fs-4 fw-bold">VOCA AI</Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="nav-links d-flex gap-4">
                        <Link to="/app/about" className="nav-link text-dark">Giới thiệu</Link>
                        <Link to="/app/courses" className="nav-link text-dark">Khóa học</Link>
                        <Link to="/app/contact" className="nav-link text-dark">Liên hệ</Link>
                    </nav>

                    {/* Account Section */}
                    <div className="account-section">
                        {userInfo ? (
                            <div className="user-area position-relative">
                                <FontAwesomeIcon
                                    icon={faUserCircle}
                                    size="2x"
                                    className="text-primary cursor-pointer"
                                    onClick={this.toggleMenu}
                                />
                                {showMenu && (
                                    <div className="dropdown-menu-custom">
                                        <p className="mb-2 fw-semibold">Xin chào, {userInfo?.full_name || 'User'}</p>
                                        <Link to="/app/account" className="dropdown-item">Tài khoản</Link>
                                        <Link to="/app/settings" className="dropdown-item">Cài đặt</Link>
                                        <div className="dropdown-item text-danger" onClick={()=>this.logOut()}>
                                            Đăng xuất
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons d-flex">
                                <Link to="/pages/logon" className="btn btn-outline-primary me-2 rounded-pill">Đăng nhập</Link>
                                <Link to="/pages/register" className="btn btn-primary text-white rounded-pill">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </header>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
