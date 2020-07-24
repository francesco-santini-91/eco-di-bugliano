import React, { Component } from 'react';
import axios from 'axios';
import './userDetail.css';

class userDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: sessionStorage.getItem('token'),
            edit: false,
            password: '',
            password2: '',
            noMatch: false,
            tooShort: false,
            showDeleteConfirm: false,
            unhautorized: false
        }
        this.handlePasswordChange1 = this.handlePasswordChange1.bind(this);
        this.handlePasswordChange2 = this.handlePasswordChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.edit = this.edit.bind(this);
        this.abort = this.abort.bind(this);
        this.confirm = this.confirm.bind(this);
        this.delete = this.delete.bind(this);
        this.newArticle = this.newArticle.bind(this);
        this.getArticlesByAuthor = this.getArticlesByAuthor.bind(this);
        this.newUser = this.newUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.allArticles = this.allArticles.bind(this);
        this.logout = this.logout.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.abortDelete = this.abortDelete.bind(this);
    }

    handlePasswordChange1(event) {
        this.setState({password: event.target.value});
        if(event.target.value !== this.state.password2) {
            this.setState({noMatch: true});
        }
        else if(event.target.value === this.state.password2){
            this.setState({noMatch: false});
        }
        if(this.state.password.length < 8 || this.state.password2.length < 8) {
            this.setState({tooShort: true});
        }
        else if(this.state.password.length >= 8 || this.state.password2.length >= 8){
            this.setState({tooShort: false});
        }
        this.forceUpdate();
    }

    handlePasswordChange2(event) {
        this.setState({password2: event.target.value});
        if(this.state.password !== event.target.value) {
            this.setState({noMatch: true});
        }
        else if(this.state.password === event.target.value){
            this.setState({noMatch: false});
        }
        if(this.state.password.length < 8) {
            this.setState({tooShort: true});
        }
        else if(this.state.password.length >= 8){
            this.setState({tooShort: false});
        }
        this.forceUpdate();
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    edit() {
        this.setState({edit: true});
    }

    abort() {
        this.setState({edit: false});
    }

    async confirm() {
        var _unhautorized = false;
        if(this.state.noMatch === false && this.state.tooShort === false) {
                await axios.put('http://localhost:4000/server/users/' + this.props.username, {
                    token: this.state.token,
                    username: this.props.username,
                    password: this.state.password,
                    isAdmin: this.props.isAdmin,
                    isSuperUser: this.props.isSuperUser
                })
                .then(function (response) {
                    if(response.data.success) {
                        window.location.reload();
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
    }

    showDeleteConfirm() {
        this.setState({showDeleteConfirm: true});
    }

    abortDelete() {
        this.setState({showDeleteConfirm: false});
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('/articles');
    }

    async delete() {
        var _unhautorized = false;
        await axios.patch('/server/users/' + this.props.username, {
            token: this.state.token
        })
        .then(function (response) {
            if(response.data.deleted) {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('/login');
            }
            if(response.data.unhautorized) {
                this.setState({unhautorized: _unhautorized});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    newArticle() {
        window.location.replace('/article/new');
    }

    getArticlesByAuthor() {
        window.location.replace('/users/' + this.props.username + '/articles')
    }

    newUser() {
        window.location.replace('/user/new');
    }

    editUser() {
        window.location.replace('/users');
    }

    allArticles() {
        window.location.replace('/allArticles');
    }

    render() {
        return(
            <div className="userDetail">
                <h4 className="profileLabel">Profilo utente</h4>
                <br />
                <label className="label" htmlFor="username">Username:</label>
                <input type="text" className="form-control-plaintext" disabled={true} id="username" onChange={this.handleSubmit} value={this.props.username} />
                <form hidden={!this.state.edit} onSubmit={this.handleSubmit}>
                    <label htmlFor="newPassword">Nuova password:</label>
                    <input type="password" className="form-control inputForm" id="newPassword" onChange={this.handlePasswordChange1}/>
                    <label htmlFor="newPassword2">Inserisci nuovamente la nuova password: </label>
                    <input type="password" className="form-control inputForm" id="newPassword2" onChange={this.handlePasswordChange2}/>
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.noMatch}>Le password non corrispondono!</div>
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.tooShort}>La password deve contenere almeno 8 caratteri!</div>
                    <button type="submit" className="btn btn-lg btn-dark buttons" onClick={this.abort}>Annulla</button>
                    <button type="submit" className="btn btn-lg btn-success buttons" onClick={this.confirm}>Conferma</button>
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.unhautorized}>Utente non autorizzato!</div>
                </form>
                <input readOnly={true} className="form-check-input check" type="checkbox" hidden={this.state.edit} checked={this.props.isAdmin} id="isAdmin" />
                <label className="form-check-label checkLabel" hidden={this.state.edit} htmlFor="isAdmin">Admin</label>
                <br />
                <input readOnly={true} className="form-check-input check" type="checkbox" hidden={this.state.edit} checked={this.props.isSuperUser} id="isSuperUser" />
                <label className="form-check-label checkLabel" hidden={this.state.edit} htmlFor="isSuperUser">Super User</label>
                <br />
                <br />
                <form className="editButtons" hidden={this.state.edit} onSubmit={this.handleSubmit}>
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.showDeleteConfirm}>Sicuro di voler eliminare l'account? L'operazione non sarà reversibile.</div>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.edit}>Modifica password</button>
                    <div className="onlyAdmin" hidden={!this.props.isAdmin}>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.newArticle}>Nuovo articolo</button>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.getArticlesByAuthor}>I tuoi articoli</button>
                    </div>
                    <button type="submit" className="btn btn-lg btn-dark btn-block buttons" hidden={!this.state.showDeleteConfirm} onClick={this.abortDelete}>Annulla</button>
                    <button type="submit" className="btn btn-lg btn-danger btn-block buttons buttonDel" hidden={!this.state.showDeleteConfirm} onClick={this.delete}>Elimina account</button>
                    <div className="onlySuperUser" hidden={!this.props.isSuperUser}>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.newUser} >Nuovo utente</button>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.editUser} >Modifica utente</button>
                    <button type="submit" className="btn btn-lg btn-primary btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.allArticles} >Tutti gli articoli</button>
                    </div>
                    <button type="submit" className="btn btn-lg btn-danger btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.showDeleteConfirm}>Elimina account</button>
                    <button type="submit" className="btn btn-lg btn-dark btn-block buttons" hidden={this.state.showDeleteConfirm} onClick={this.logout}>Logout</button>
                </form>
            </div>
        );
    }
}

export default userDetail;