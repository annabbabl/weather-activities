import React, { Component } from 'react';
import './App.css';
import UpperBar from './pages/navigation/upperBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

interface AppState {
  apiResponse: string;
  username: string, 
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = { 
      apiResponse: "",
      username: ""
    };
  }

  callAPI() {
    fetch("http://localhost:3001/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res, username: res }));
  }

  componentDidMount() { // Changed from componentWillMount
    this.callAPI();
  }

  render() {
    return (
      <div className="App">
        <Router>
          <UpperBar username={this.state.username}/>
          <div className="App-content">
            <header>{/* Your header content */}</header>
            <main>
              <p className="App-intro">{this.state.apiResponse}</p>
              <Routes>
                <Route path="/saved" element={<div>home</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </div>
    );
  }
}

export default App; 