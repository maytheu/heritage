import React, { Component } from 'react';

import HeaderHome from '../header_footer/HeaderHome';
import Categories from './Categories';

class Home extends Component {
    render() {
        return (
            <div>
                <HeaderHome />
                <Categories />
            </div>
        );
    }
}

export default Home;