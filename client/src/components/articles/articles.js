import React, { Component } from 'react';
import Article from './article/article';

import './articles.css';


class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            total: null,
            articles: []
        };
        this.showPagination = this.showPagination.bind(this);
        this.loading = this.loading.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/articles' + this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({articles: data}))
        .catch(console.log);
        await fetch('/server/articles/count')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalArticles}))
        .catch(console.log);
        this.setState({loaded: true});
    }

    loading() {
        return(
            <div className="spinner-border text-info" hidden={this.state.loaded} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    showContent() {
        if(this.state.articles.length === 0 && this.state.loaded === true) {
            return(
                <div className="NoArticles">
                    <div className="alert alert-danger" role="alert" >
                        Non ci sono articoli!
                    </div>
                    
                </div>
            );
        }
        else{
            let listOfArticles = [];
            for (let article of this.state.articles){
                listOfArticles.push(<Article 
                                        key={article._id} 
                                        id={article.id} 
                                        title={article.title} 
                                        subtitle={article.subtitle} 
                                        imageURL={article.imageURL} 
                                        content={article.content} 
                                    />);
            }
            return listOfArticles;
        }
    }

    showPagination() {
        let pages = [];
        for (let i = 1; i < (this.state.total/5) + 1; i++) {
            pages.push(<li key={i} className="page-item"><a className="page-link" href={'/articles?page=' + i}>{i}</a></li>);
        }
        return pages;
    }
        
    render() {
            return(
            <div className="Articles">
                {this.loading()}
                {this.showContent()}
                <div className="pages">
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            {this.showPagination()}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Articles;