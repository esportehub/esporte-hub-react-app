// src/App.js
import './App.css';
import { Provider } from "./components/ui/provider";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroPage from './pages/CadastroPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TournamentCreationPage from './pages/TournamentCreationPage';

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CadastroPage />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/tournaments/creation" element={<TournamentCreationPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;