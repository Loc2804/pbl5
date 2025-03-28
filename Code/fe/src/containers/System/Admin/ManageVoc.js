import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import "./AdminPage.scss";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSection from './AdminSection';
import './ManageVoc.scss';
import { FormattedMessage } from 'react-intl';

class ManageVoc extends Component {
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
                <div className="sb-nav-fixed">
                    <AdminHeader/>

                    <div id="layoutSidenav">
                        <AdminSection/>
                        <div id="layoutSidenav_content">
                            ManageVoc
                            <AdminFooter/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageVoc);
