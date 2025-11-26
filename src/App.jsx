import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/home.jsx";
import Curso from "./pages/curso.jsx";
import Login from "./pages/login.jsx";
import Cadastro from "./pages/cadastro.jsx";
import PainelAluno from "./pages/painel-aluno.jsx";
import PainelProfessor from "./pages/painel-professor.jsx";
import PainelAdmin from "./pages/painel-admin.jsx";
import Sobre from "./pages/sobre.jsx";
import Contato from "./pages/contato.jsx";

// 🔥 Componente Wrapper para esconder Header/Footer em certas rotas
function LayoutWrapper({ children }) {
  const location = useLocation();

  // Rotas sem Header/Footer (painéis)
  const rotasSemLayout = [
    "/painel-aluno",
    "/painel-professor",
    "/painel-admin",
  ];

  const esconderLayout = rotasSemLayout.includes(location.pathname);

  return (
    <>
      {!esconderLayout && <Header />}
      <main style={{ minHeight: "80vh", padding: esconderLayout ? 0 : "20px" }}>
        {children}
      </main>
      {!esconderLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curso" element={<Curso />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />

          {/* Painéis sem Header/Footer */}
          <Route path="/painel-aluno" element={<PainelAluno />} />
          <Route path="/painel-professor" element={<PainelProfessor />} />
          <Route path="/painel-admin" element={<PainelAdmin />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;