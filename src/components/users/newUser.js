import React, { Component } from 'react';
import axios from 'axios';
import './userDetail.css';

class newUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
            isSuperUser: false,
            unhautorized: false,
            userAlreadyExist: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
        this.handleIsSuperUserChange = this.handleIsSuperUserChange.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value, userAlreadyExist: false});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleIsAdminChange(event) {
        this.setState({isAdmin: event.target.checked});
    }

    handleIsSuperUserChange(event) {
        this.setState({isSuperUser: event.target.checked});
    }

    async addNewUser() {
        var _unhautorized = false;
        var _userAlreadyExist = false;
        await axios.post('/server/users/newUser', {
            token: sessionStorage.getItem('token'),
            username: this.state.username,
            password: this.state.password,
            isAdmin: this.state.isAdmin,
            isSuperUser: this.state.isSuperUser
        })
        .then(function (response) {
            if(response.data.created) {
                window.location.replace('/users');
            }
            if(response.data.unhautorized === true) {
                _unhautorized = true;
            }
            if(response.data.userAlreadyExist === true) {
                _userAlreadyExist = true;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        this.setState({unhautorized: _unhautorized, userAlreadyExist: _userAlreadyExist});
    }

    render() {
        return(
            <div className="newUser">
                <div className="hautorized" hidden={!this.props.isSuperUser}>
                    <h4 className="titleLabel">Nuovo utente</h4>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" className="form-control form-control-lg" id="username" required={true} onChange={this.handleUsernameChange} placeholder="Username" />
                        <input type="password" className="form-control form-control-lg" id="password" required={true} onChange={this.handlePasswordChange} placeholder="Password" />
                        <input type="checkbox" className="form-check-input check" id="isAdmin" onChange={this.handleIsAdminChange} />
                        <label className="form-check-label checkLabel" htmlFor="isAdmin">Admin</label>
                        <br />
                        <input type="checkbox" className="form-check-input check" id="isSuperUser" onChange={this.handleIsSuperUserChange} />
                        <label className="form-check-label checkLabel" htmlFor="isSuperUser">Super User</label>
                        <br />
                        <br />
                        <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.unhautorized}>Utente non autorizzato!</div>
                        <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.userAlreadyExist}>Nome utente già inserito!</div>
                        <button type="submit" className="btn btn-lg btn-block btn-primary buttonNewUser" onClick={this.addNewUser}>Aggiungi utente</button>
                    </form>
                </div>
                <div className="unhautorized" hidden={this.props.isSuperUser}>
                <div className="alert alert-danger alertLabel" role="alert">Utente non autorizzato!</div>
                </div>
            </div>
        );
    }
}

export default newUser;