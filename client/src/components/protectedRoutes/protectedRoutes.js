import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

class protectedRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: sessionStorage.getItem('token'),
            username: '',
            isAdmin: '',
            isSuperUser: '',
            isAuthenticated: this.verifyToken(sessionStorage.getItem('token'))
        };
        this.verifyToken = this.verifyToken.bind(this);
    }

    async verifyToken(token) {
        if(token != null) {
            var valid = false;
            var _username = ''; 
            var _isAdmin = ''; 
            var _isSuperUser = '';
            await axios.post('/server/login/verify', {
                token: token
            })
            .then(function(response) {
                if(response.data.valid) {
                    valid = true;
                    _username = response.data.decoded.username;
                    _isAdmin = response.data.decoded.isAdmin;
                    _isSuperUser = response.data.decoded.isSuperUser;
                }
            })
            .catch(function(error) {
                //console.log(error);
            });
            this.setState({
                isAuthenticated: valid,
                username: _username,
                isAdmin: _isAdmin,
                isSuperUser: _isSuperUser
            });
        }
    }

    /*componentDidMount() {
        this.setState({isAuthenticated: this.verifyToken(sessionStorage.getItem('token'))});
    }*/

    render() {
        const { component: Component, ...props } = this.props;
        return(
            <Route
                {...props}
                    render={props => (
                        this.state.isAuthenticated ? <Component {...props} 
                                                        username={this.state.username}
                                                        isAdmin={this.state.isAdmin}
                                                        isSuperUser={this.state.isSuperUser}
                                                    /> : <Redirect to='/login' />
                    )}
            />
        );
    }
}

export default protectedRoutes;