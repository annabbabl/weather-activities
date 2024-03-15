import React, { Component } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import UpperBar from './components/navigation/upperBar';
import MessagePage from './pages/messagePage';


interface AppState {
  apiResponse: string;
  username: string, 
}

class App extends Component<{}, AppState> {
  
  constructor(props: {}) {
    super(props);
    this.state = { 
      apiResponse: "",
      username: "", 
    };
  }

  callAPI() {
    fetch("http://localhost:3001/")
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
          <UpperBar/>
          <Routes>
            <Route path="/messages/:userId" element={<MessagePage/>} />
          </Routes>
          <div className="App-content">
            <header>{/* Your header content */}</header>
            <main>
            </main>
          </div>
          
        </Router>
      </div>
    );
  }
}

export default App; 