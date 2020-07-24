import React, { Component } from 'react';
import axios from 'axios';
import './login.css';

class login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            wrongPassword: false,
            userNotFound: false
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signIn = this.signIn.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
        
    }

    componentDidMount() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value, userNotFound: false});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value, wrongPassword: false});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    redirectToLogin() {
        this.props.history.push('/login');
    }

    async signIn() {
        var authenticated = false;
        var userNotFound = false;
        var wrongPassword = false;
        await axios.post('/server/login', {
            username: this.state.username,
            password: this.state.password
        })
        .then(function(response) {
            if(response.data.token) {
                sessionStorage.setItem('token', response.data.token);
                authenticated = true;
            }
            else if(response.data.userNotFound) {
                userNotFound = true;
            }
            else {
                wrongPassword = true;
            }
        })
        .catch(function(error) {
            console.log(error);
        });
        if(wrongPassword === true) {
            this.setState({wrongPassword: true});
        }
        if(userNotFound === true) {
            this.setState({userNotFound: true});
        }
        if(authenticated === true) {
            this.setState({isAuthenticated: true, wrongPassword: false});
            sessionStorage.setItem('user', this.state.username);
            window.location.replace('/users/' + this.state.username);
        }
        else {
            this.setState({isAuthenticated: false});
            this.redirectToLogin();
        }
    }

    render() {
            return(
                <div className="login">
                    <form onSubmit={this.handleSubmit}>
                        <input 
                            className="form-control form-control-lg" 
                            type="text" 
                            placeholder="Username" 
                            id="username" 
                            required={true}
                            onChange={this.handleUsernameChange}
                        />
                        <input 
                            className="form-control form-control-lg" 
                            type="password" 
                            placeholder="Password" 
                            id="password"
                            required={true}
                            onChange={this.handlePasswordChange}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-block btn-lg btn-dark buttonSubmit"
                            onClick={this.signIn}>Accedi
                        </button>
                    </form>
                    <br />
                    <div className="alert alert-danger" role="alert" hidden={!this.state.wrongPassword}>Password errata!</div>
                    <div className="alert alert-danger" role="alert" hidden={!this.state.userNotFound}>Utente inesistente!</div>
                </div>
            );
        }
    }

export default login;