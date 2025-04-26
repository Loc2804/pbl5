import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faRedoAlt, faCamera, faMicrophone, faTable } from '@fortawesome/free-solid-svg-icons';

import './Section.scss'; // Hoặc tách riêng ra Menu.scss
import { FormattedMessage } from 'react-intl';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { location } = this.props;

        const menuItems = [
            { to: "/app/learning", icon: faBook, label: "Học tập trực tuyến" },
            { to: "/app/review", icon: faRedoAlt, label: "Ôn tập" },
            { to: "/app/camera", icon: faCamera, label: "Học tập với Camera" },
            { to: "/app/speaking", icon: faMicrophone, label: "Luyện nói" },
            { to: "/app/test", icon: faTable, label: "Kiểm tra" },
        ];

        return (
            <div className="sidebar-menu bg-light">
                <ul className="menu-list list-unstyled p-3">
                    {menuItems.map(item => {
                        const isActive = location.pathname.startsWith(item.to);
                        return (
                            <li key={item.to} className="menu-item mb-3">
                                <Link
                                    to={item.to}
                                    className={`d-flex align-items-center text-decoration-none ${
                                        isActive ? 'fw-bold text-primary' : 'text-dark'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="me-2" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
});

// Kết hợp withRouter để lấy `location`
export default connect(mapStateToProps)(withRouter(Menu));
