import React from 'react';
import './App.css';
import UpperBar from './pages/navigation/upperBar.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <Router> {/* Move Router to a higher level */}
        <UpperBar />
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

export default App;
