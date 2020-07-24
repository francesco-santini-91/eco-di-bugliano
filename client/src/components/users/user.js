import React, { Component } from 'react';
import axios from 'axios';
import './users.css';

class user extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: sessionStorage.getItem('token'),
            _isAdmin: false,
            _isSuperUser: false,
            edit: false,
            delete: false,
            unhautorized: false
        };
        this.showEditConfirm = this.showEditConfirm.bind(this);
        this.abortEdit = this.abortEdit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.abortDelete = this.abortDelete.bind(this);
        this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
        this.handleIsSuperUserChange = this.handleIsSuperUserChange.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleIsAdminChange(event) {
        this.setState({_isAdmin: event.target.checked})
    }

    handleIsSuperUserChange(event) {
        this.setState({_isSuperUser: event.target.checked});
    }

    showEditConfirm() {
        this.setState({edit: true});
    }

    abortEdit() {
        this.setState({edit: false});
    }

    showDeleteConfirm() {
        this.setState({delete: true});
    }

    abortDelete() {
        this.setState({delete: false});
    }

    async edit() {
        var _unhautorized = false;
        await axios.put('/server/users/' + this.props.username, {
            token: this.state.token,
            username: this.props.username,
            isAdmin: this.state._isAdmin,
            isSuperUser: this.state._isSuperUser
        })
        .then(function (response) {
            if(response.data.success) {
                window.location.replace('/users');
            }
            if(response.data.unhautorized) {
                _unhautorized = true;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        this.setState({unhautorized: _unhautorized});
    }

    async delete() {
        var _unhautorized = false;
        await axios.patch('/server/users/' + this.props.username, {
            token: this.state.token
        })
        .then(function (response) {
            if(response.data.deleted) {
                window.location.replace('/users');
            }
            if(response.data.unhautorized) {
                this.setState({unhautorized: _unhautorized});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    

    render() {
        return(
            <div className="user">
                <p>{this.props.username}</p>
                <p hidden={!this.props.isSuperUser}>Super User</p>
                <p hidden={!this.props.isAdmin} >Admin</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="editPermits" hidden={!this.state.edit}>
                        <input className="form-check-input check" type="checkbox" onChange={this.handleIsAdminChange} id="isAdmin" />
                        <label className="form-check-label checkLabel" htmlFor="isAdmin">Admin</label>
                        <input className="form-check-input check" type="checkbox" onChange={this.handleIsSuperUserChange} id="isSuperUser" />
                        <label className="form-check-label checkLabel" htmlFor="isSuperUser">Super User</label>
                    </div>
                    <button type="submit" className="btn btn-lg btn-dark buttons" hidden={!this.state.edit} onClick={this.abortEdit}>Annulla</button>
                    <button type="submit" className="btn btn-lg btn-success buttons" hidden={!this.state.edit} onClick={this.edit}>Salva</button>
                    <button type="submit" className="btn btn-lg btn-dark buttons" hidden={!this.state.delete} onClick={this.abortDelete}>Annulla</button>
                    <button type="submit" className="btn btn-lg btn-danger buttons" hidden={!this.state.delete} onClick={this.delete}>Elimina utente</button>
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.unhautorized}>Utente non autorizzato!</div>
                    <div className="whenDelete" hidden={this.state.delete}>
                        <button type="submit" className="btn btn-lg btn-warning buttons" hidden={this.state.edit} onClick={this.showEditConfirm}>Modifica</button>
                        <button type="submit" className="btn btn-lg btn-danger buttons" hidden={this.state.edit} onClick={this.showDeleteConfirm}>Elimina</button>
                    </div>
                </form>
                <hr />
            </div>
        );
    }

}

export default user;