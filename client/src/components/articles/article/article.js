import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './article.css';

class Article extends Component {

    render() {
        return(
            <div className="Articles">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            <Link to={"/articles/"+this.props.title}><img className="imageURL rounded" alt="" src={this.props.imageURL} /></Link>
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
                                        <div className="text-truncate">
                                            <p>{this.props.content}</p>
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
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }
}

export default Article;