import React, { Component } from 'react';

import NearbyBanksMap from './components/NearbyBanksMap'
import './App.css';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <NearbyBanksMap  />
      </div>
    );
  }
}

export default App;
