import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UpperBar from './components/navigation/upperBar';
import { User } from 'firebase/auth';


interface AppState {
  apiResponse: string;
  username: string, 
  currentUser: User | undefined
}

class App extends Component<{}, AppState> {
  
  constructor(props: {}) {
    super(props);
    this.state = { 
      apiResponse: "",
      username: "", 
      currentUser: undefined
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
          <UpperBar currentUser={this.state.currentUser}/>
          <div className="App-content">
            <header>{/* Your header content */}</header>
            <main>
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