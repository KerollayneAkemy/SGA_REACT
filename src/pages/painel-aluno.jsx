import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/aluno.css";

export default function PainelAluno() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("Carregando...");
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  // CONTROLA MODAL
  const [modalOpen, setModalOpen] = useState(false);

  // CONTROLA DROPDOWN
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // FECHA DROPDOWN AO CLICAR FORA
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".aluno-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    async function carregarAluno() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const uid = session.user.id;
      setUser(session.user);
      setMatricula(uid);

      // Buscar nome
      const { data: alunoData } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("id", uid)
        .single();

      const nomeCompleto = alunoData?.nome ?? session.user.email.split("@")[0];
      setNome(nomeCompleto);

      // Buscar curso
      const { data: mat } = await supabase
        .from("matriculas")
        .select(`curso_id, cursos ( nome )`)
        .eq("aluno_id", uid)
        .single();

      const nomeCurso = mat?.cursos?.nome ?? "Nenhum curso encontrado";
      setCurso(nomeCurso);

      const cursoId = mat?.curso_id;

      // Buscar notas
      if (cursoId) {
        const { data: notasData } = await supabase
          .from("notas")
          .select("*")
          .eq("aluno_id", uid)
          .eq("curso_id", cursoId)
          .order("data", { ascending: false });

        setNotas(notasData || []);
      }

      setLoading(false);
    }

    carregarAluno();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="aluno-header">
        <div className="aluno-logo">SGA — Aluno</div>

        <div className="aluno-header-right">
          <nav className="aluno-nav">
            <a href="/home">Home</a>
            <a href="/curso">Cursos</a>
            <a href="/sobre">Sobre</a>
            <a href="/contato">Contato</a>
          </nav>

          {/* DROPDOWN */}
          <div className="aluno-dropdown">
            <button
              className="aluno-btn-perfil"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{nome.split(" ")[0]}</span>
            </button>

            <div
              className={`aluno-menu-perfil ${dropdownOpen ? "ativo" : ""}`}
            >
              <p>
                Matrícula: <strong>{matricula.slice(0, 8)}...</strong>
              </p>

              <button
                className="menu-btn"
                onClick={() => setModalOpen(true)}
              >
                👤 Meu Perfil
              </button>

              <a href="/meuscursos">🎓 Meus Cursos</a>

              <a href="/login" className="aluno-btn-sair">Sair</a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="aluno-main">
        <section className="aluno-container">
          <div className="aluno-card aluno-card-perfil">
            <h2>👋 Bem-vindo(a), {nome}</h2>
            <p>Matrícula: {matricula}</p>
            <p>Curso: {curso}</p>
          </div>

          <div className="aluno-card">
            <h2>📊 Minhas Notas</h2>

            {loading ? (
              <p>Carregando...</p>
            ) : notas.length === 0 ? (
              <p>Nenhuma nota lançada.</p>
            ) : (
              <table className="aluno-tabela">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Atividade</th>
                    <th>Nota</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((n) => (
                    <tr key={n.id}>
                      <td>{curso}</td>
                      <td>{n.atividade}</td>
                      <td>{n.nota}</td>
                      <td>{new Date(n.data).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="aluno-footer">
        <p>© 2025 Sistema Acadêmico — SGA</p>
      </footer>

      {/* MODAL PERFIL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>👤 Meu Perfil</h2>

            <p><strong>Nome:</strong> {nome}</p>
            <p><strong>Matrícula:</strong> {matricula}</p>
            <p><strong>Curso:</strong> {curso}</p>

            <button className="modal-close" onClick={() => setModalOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
