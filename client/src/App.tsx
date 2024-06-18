import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuBar from './components/navigation/menuBar';
import Homepage from './pages/aboutPage';
import { Login } from './pages/login';
import { RegistrationForm } from './pages/registration/registration';
import { CandidateRegistration } from './pages/registration/candidateInformation';
import CandidateDetail from './pages/candidates/candidateDetail';
import Candidates from './pages/candidates/candidates';
import ElectionStart from './pages/election/start';
import ElectionProcess from './pages/election/process';
import { FinishElection } from './pages/election/final';
import { GoodLuck } from './pages/registration/goodLuck';
import { Analytics } from './pages/analytics';

function App() {
  return (
    <div className="px-8">
      <Router>
        <MenuBar />
        <Routes>
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidate/:uid" element={<CandidateDetail />} />
        </Routes>
        <div>
          <header>{/* Your header content */}</header>
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<RegistrationForm />} />
              <Route path="/registration/admin" element={<RegistrationForm />} />
              <Route path="/registration/candidate" element={<RegistrationForm />} />
              <Route path="/registration/candidate/candidate-info" element={<CandidateRegistration />} />
              <Route path="/registration/candidate/goodLuck" element={<GoodLuck/>} />
              <Route path="/analytics" element={<Analytics/>} />
            </Routes>
            <Routes>
              <Route path="/election/startElection" element={<ElectionStart />} />
              <Route path="/election/process" element={<ElectionProcess />} />
              <Route path="/election/finishElection" element={<FinishElection/>} />
            </Routes>
          </main>  
        </div>
      </Router>
    </div>
  );
}

export default App;
