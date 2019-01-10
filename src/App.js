import React, { Component } from 'react';

import './App.css';
import Home from './component/home/Home';
import Footer from './component/header_footer/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Home />
        <Footer />
      </div>
    );
  }
}

export default App;
