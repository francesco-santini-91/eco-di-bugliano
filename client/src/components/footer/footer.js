import React, { Component } from 'react';
import './footer.css';

class footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            GDPRAccepted: false
        }
        this.accept = this.accept.bind(this);
    }

    componentDidMount() {
        if(sessionStorage.getItem('GDPR')) {
            this.setState({GDPRAccepted: true});
        }
    }

    accept() {
        this.setState({GDPRAccepted: true});
        sessionStorage.setItem('GDPR', true);
    }

    render() {
        return(
            <div className="Footer">
                <nav className="navbar navbar-dark bg-dark fixed-bottom footerContent">
                    <div className="accepted" hidden={!this.state.GDPRAccepted}>
                        <p className="powered">www.ecodibugliano.it</p>
                        <p className="powered">Powered by <a href="https://facebook.com/santo1991" target="_blank" rel="noopener noreferrer">Francesco Santini</a></p>
                    </div>
                    <div className="notAccepted" hidden={this.state.GDPRAccepted}>
                        <div className="container fluid">
                            <div className="row">
                                <div className="col-xs-6">
                                    <p className="cookie">Questo sito utilizza dei cookie tecnici, necessari al proprio funzionamento. Premendo il tasto "Ok", oppure proseguendo con la navigazione, acconsentirai al loro utilizzo. </p>
                                    <button type="submit" className="btn btn-sm btn-primary cookieButton" onClick={this.accept}>Ok, ho capito</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default footer;
