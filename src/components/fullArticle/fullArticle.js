import React, { Component } from 'react';
import axios from 'axios';
import './fullArticle.css';
import _like from './like.svg';

class fullArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            like: false,
            likes: null
        }
        this.formatData = this.formatData.bind(this);
        this.like = this.like.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    formatData(unformattedData) {
        const months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
        var date = new Date(unformattedData);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        if(hour < 10) hour = "0"+hour;
        var minute = date.getMinutes();
        if(minute < 10) minute = "0"+minute;
        var result =  day+" "+months[month]+" "+year+", "+hour+"."+minute;
        return result;   
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    async like() {
        this.setState({like: true});
        var newLike = null;
        await axios.post('/server/articles/' + this.props.title)
            .then(function (response) {
                if(response.data.likes) {
                    newLike = response.data.likes;
                }
                else {
                    newLike = this.props.likes;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            this.setState({likes: newLike});
    }

    render() {
        return(
            <div className="fullArticle">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h2>{this.props.title}</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 subtitle">
                                        <h4>{this.props.subtitle}</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 pubblication">
                                        <p>Pubblicato il {this.formatData(this.props.pubblication)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 author">
                                        <p>Di {this.props.author}</p>
                                    </div>
                                </div>
                                <div className="col-xs-12">
                                    <div className="img-fluid">
                                        <figure className="figure ">
                                            <img className="imageURL-FULL img-fluid rounded" alt="" src={this.props.imageURL} />
                                            <figcaption className="figure-caption">{this.props.imageCaption}</figcaption>
                                        </figure>
                                    </div>    
                        </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <p className="content">{this.props.content}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="likes">
                                <form onSubmit={this.handleSubmit}>
                                    <button type="submit" className="btn btn-lg btn-primary" hidden={this.state.like} onClick={this.like} ><img src={_like} alt="" className="icon" /> Mi Garba</button>
                                    <button type="submit" disabled={true} className="btn btn-lg btn-outline-primary"hidden={!this.state.like} onClick={this.unlike}><img src={_like} alt="" className="icon" /> Ti Garba!</button>
                                </form>
                                <p className="labelLike" hidden={this.state.like}>Garba a {this.props.likes} persone!</p>
                                <p className="labelLike" hidden={!this.state.like}>Garba a {this.state.likes} persone!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default fullArticle;