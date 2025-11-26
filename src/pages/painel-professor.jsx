import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/professor.css";

export default function PainelProfessor() {
  const [professor, setProfessor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [tipoAtividade, setTipoAtividade] = useState("");
  const [nota, setNota] = useState("");
  const [historico, setHistorico] = useState([]);
  const [menuAtivo, setMenuAtivo] = useState(false);

  useEffect(() => {
    const carregarPainel = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return (window.location.href = "/login");

      const professorId = session.user.id;

      const { data: professorData } = await supabase
        .from("usuarios")
        .select("nome, email, user_role")
        .eq("id", professorId)
        .single();

      if (!professorData || professorData.user_role !== "professor") {
        alert("Acesso negado!");
        return (window.location.href = "/login");
      }

      setProfessor(professorData);

      const { data: cursosData } = await supabase
        .from("cursos")
        .select("*")
        .eq("professor_id", professorId);

      setCursos(cursosData || []);

      carregarHistorico(professorId);
    };

    carregarPainel();
  }, []);

  const carregarAlunos = async (cursoId) => {
    setCursoSelecionado(cursoId);

    const { data: matriculas } = await supabase
      .from("matriculas")
      .select("aluno_id, aluno:usuarios(id, nome)")
      .eq("curso_id", cursoId);

    setAlunos(matriculas.map((m) => m.aluno));
  };

  const lancarNota = async (e) => {
    e.preventDefault();

    if (!cursoSelecionado || !alunoSelecionado) {
      alert("Selecione o curso e o aluno!");
      return;
    }

    const { error } = await supabase.from("notas").insert({
      aluno_id: alunoSelecionado,
      curso_id: cursoSelecionado,
      atividade: tipoAtividade,
      nota: Number(nota),
    });

    if (error) return alert("Erro ao lançar nota.");

    alert("Nota lançada!");
    setTipoAtividade("");
    setNota("");
    carregarHistorico(professor.id);
  };

  const carregarHistorico = async (professorId) => {
    const { data } = await supabase
      .from("notas")
      .select(`
        id, atividade, nota, data,
        aluno:usuarios!notas_aluno_id_fkey(id, nome),
        curso:cursos!notas_curso_id_fkey(id, nome, professor_id)
      `)
      .eq("curso.professor_id", professorId);

    setHistorico(data || []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!professor) return <p>Carregando...</p>;

  return (
    <div className="professor-container">
      <header className="professor-header">
        <div className="professor-logo">SGA — Professor</div>

        <nav className="professor-nav">
          <a href="/">Home</a>
          <a href="/curso">Cursos</a>
          <a href="/sobre">Sobre</a>
          <a href="/contato">Contato</a>
        </nav>

        <div className="professor-dropdown">
          <button
            className="professor-btn-perfil"
            onClick={() => setMenuAtivo(!menuAtivo)}
          >
            {professor.nome}
          </button>

          {menuAtivo && (
            <div className="professor-dropdown-menu">
              <p>{professor.email}</p>
              <hr />
              <button className="professor-btn-logout" onClick={logout}>
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="professor-main">
        <section className="professor-card">
          <h2>👋 Bem-vindo(a), {professor.nome}!</h2>
          <p>Gerencie suas disciplinas e notas.</p>
        </section>

        <section className="professor-card">
          <h2>📚 Meus Cursos</h2>

          <div className="professor-cursos-list">
            {cursos.map((curso) => (
              <div key={curso.id} className="professor-curso-item">
                <h3>{curso.nome}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="professor-card">
          <h2>📝 Lançamento de Notas</h2>

          <form className="professor-form" onSubmit={lancarNota}>
            <select
              className="professor-select"
              value={cursoSelecionado}
              onChange={(e) => carregarAlunos(e.target.value)}
              required
            >
              <option value="">Selecione o Curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select
              className="professor-select"
              value={alunoSelecionado}
              onChange={(e) => setAlunoSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione o Aluno</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="professor-input"
              placeholder="Tipo da Atividade"
              value={tipoAtividade}
              onChange={(e) => setTipoAtividade(e.target.value)}
              required
            />

            <input
              type="number"
              className="professor-input"
              placeholder="Nota"
              min="0"
              max="10"
              step="0.1"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              required
            />

            <button className="professor-btn" type="submit">
              Lançar Nota
            </button>
          </form>
        </section>

        <section className="professor-card">
          <h2>📉 Histórico</h2>

          <table className="professor-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Curso</th>
                <th>Avaliação</th>
                <th>Nota</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((h) => (
                <tr key={h.id}>
                  <td>{h.aluno?.nome}</td>
                  <td>{h.curso?.nome}</td>
                  <td>{h.atividade}</td>
                  <td>{h.nota}</td>
                  <td>
                    {new Date(h.data).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}