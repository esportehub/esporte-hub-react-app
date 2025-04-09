import logo from './logo.svg';
import './App.css';
import { Provider } from "./components/ui/provider"
import Home from "./pages/Home"
import Register from './pages/Register';
import Login from "./pages/Login"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;
