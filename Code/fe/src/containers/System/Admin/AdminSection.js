import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import "./AdminPage.scss";

class DefaultClass extends Component {
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

    render() {     
        
        return (
            <Fragment> 
                <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <a className="nav-link" href="index.html">
                            <div className="sb-nav-link-icon">
                                {/* <FontAwesomeIcon icon={faTachometerAlt} /> */}
                            </div>
                            Dashboard
                        </a>
                        <a className="nav-link" href="index.html">
                            <div className="sb-nav-link-icon">
                                {/* <FontAwesomeIcon icon={faTachometerAlt} /> */}
                            </div>
                            Users
                        </a>
                        <a className="nav-link" href="index.html">
                            <div className="sb-nav-link-icon">
                                {/* <FontAwesomeIcon icon={faTachometerAlt} /> */}
                            </div>
                            Products
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
