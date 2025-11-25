import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header.jsx";

// páginas
import Home from "./pages/home.jsx";
import Curso from "./pages/curso.jsx";         // lista de cursos
import Disciplina from "./pages/disciplina.jsx"; // detalhes da disciplina
import Sobre from "./pages/sobre.jsx";
import Contato from "./pages/contato.jsx";
import Login from "./pages/login.jsx";
import Cadastro from "./pages/cadastro.jsx";
import Painel from "./pages/painel.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curso" element={<Curso />} />
            <Route path="/disciplina/:cursoId" element={<Disciplina />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/painel" element={<Painel />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
