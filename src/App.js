// src/App.js
import './App.css';
import { Provider } from "./components/ui/provider";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CadastroPage from './pages/CadastroPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TournamentCreationPage from './pages/TournamentCreationPage';
import CategoryCreationPage from './pages/CategoryCreationPage';
import DadosPessoais from './pages/DadosPessoais';
import TournamentRegistrationPage from './pages/TournamentRegistrationPage';
import TournamentCalendarPage from './pages/TournamentCalendarPage';

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
          <Route path="/categories/creation" element={<CategoryCreationPage />} />
          <Route path="/me/dados-pessoais" element={<DadosPessoais />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;