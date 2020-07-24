import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './articlesByAuthor.css';

class ArticleByAuthor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: sessionStorage.getItem('token'),
            showConfirmDelete: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.edit = this.edit.bind(this);
        this.showConfirmDelete = this.showConfirmDelete.bind(this);
        this.abortDelete = this.abortDelete.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    edit() {
        window.location.replace('/users/'+this.props.author+'/edit/'+this.props.title);
    }

    showConfirmDelete() {
        this.setState({showConfirmDelete: true});
    }

    abortDelete() {
        this.setState({showConfirmDelete: false});
    }

    delete() {
        var _unhautorized = false;
        axios.patch('/server/articles/'+this.props.title, {
            token: this.state.token
        })
        .then(function (response) {
            if(response.data.deleted) {
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

    render() {
        return(
            <div className="Articles">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            <img className="imageURL rounded" alt="" src={this.props.imageURL} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs col-12">
                                        <div className="title">
                                            <h4>{this.props.title}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs col-12">
                                        <div className="subtitle">
                                            {this.props.subtitle}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs col-12">
                                        <div className="author">
                                            <p>{this.props.author}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs col-12">
                                        <div className="linkToURL">
                                            <Link to={"/articles/"+this.props.title}>Vai all'articolo</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs col-12">
                                        <div className="editDelete">
                                        <form onSubmit={this.handleSubmit}>
                                            <button type="submit" className="btn btn-lg btn-block btn-warning buttons" hidden={this.state.showConfirmDelete} onClick={this.edit}>Modifica</button>
                                            <button type="submit" className="btn btn-lg btn-block btn-danger buttons" hidden={this.state.showConfirmDelete} onClick={this.showConfirmDelete}>Elimina</button>
                                            <button type="submit" className="btn btn-lg btn-block btn-dark buttons" hidden={!this.state.showConfirmDelete} onClick={this.abortDelete}>Annulla</button>
                                            <button type="submit" className="btn btn-lg btn-block btn-danger buttons buttonDelete" hidden={!this.state.showConfirmDelete} onClick={this.delete}>Conferma eliminazione</button>
                                            <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.unhautorized}>Utente non autorizzato!</div>
                                        </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }
}

export default ArticleByAuthor;