import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

class SignUp extends Component {
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
