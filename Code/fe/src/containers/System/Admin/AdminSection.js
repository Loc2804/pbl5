import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import "./AdminPage.scss";
import { withRouter } from 'react-router-dom';
import {injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

class AdminSection extends Component {
    
    constructor(props)
    {
        
        super(props);
        this.state = {
            
        }
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    changePage = (link, event) => {
        event.preventDefault(); // Ngăn trang web tải lại
        this.props.history.push(link); // Điều hướng đúng cách
    };

    render() {     
        const currentPath = this.props.location.pathname; // Lấy đường dẫn hiện tại
        return (
            <Fragment> 
                <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                            <a 
                                className={`nav-link ${currentPath === "/system/admin" ? "active" : ""}`}  
                                href="/system/admin" 
                                onClick={(e) => { this.changePage('/system/admin',e); }}
                            >
                                Dashboard
                            </a>

                            <a 
                                className={`nav-link ${currentPath === "/system/admin/user" ? "active" : ""}`}  
                                href="/system/admin/user" 
                                onClick={(e) => { this.changePage('/system/admin/user',e); }}
                            >
                                Users
                            </a>

                            <a 
                                className={`nav-link ${currentPath === "/system/admin/voc" ? "active" : ""}`}  
                                href="/system/admin/voc" 
                                onClick={(e) => { this.changePage('/system/admin/voc',e); }}
                            >
                                Vocabularies
                            </a>
                        <div className="sb-sidenav-menu-heading">Interface</div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts">
                            <div className="sb-nav-link-icon">
                                {/* <FontAwesomeIcon icon={faColumns} /> */}
                            </div>
                            Layouts
                        <div className="sb-sidenav-collapse-arrow">
                            {/* <FontAwesomeIcon icon={faAngleDown} /> */}
                        </div>
                        </a>
                        <div className="collapse" id="collapseLayouts" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <a className="nav-link" href="layout-static.html">Static Navigation</a>
                            <a className="nav-link" href="layout-sidenav-light.html">Light Sidenav</a>
                        </nav>
                        </div>
                        <div className="sb-sidenav-menu-heading">Addons</div>
                        <a className="nav-link" href="charts.html">
                        <div className="sb-nav-link-icon">
                            {/* <FontAwesomeIcon icon={faChartArea} /> */}
                        </div>
                        Charts
                        </a>
                        <a className="nav-link" href="tables.html">
                        <div className="sb-nav-link-icon">
                            {/* <FontAwesomeIcon icon={faTable} /> */}
                        </div>
                        Tables
                        </a>
                    </div>
                    </div>
                </nav>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(injectIntl(AdminSection)));