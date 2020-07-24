import React, { Component } from 'react';

class homepage extends Component {

    render() {
        window.location.replace('/articles?page=1');
        return(<div></div>);
    }
}

export default homepage;