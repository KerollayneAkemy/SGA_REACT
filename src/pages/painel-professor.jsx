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
    async function carregarPainel() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return (window.location.href = "/login");

        const professorId = session.user.id;

        // BUSCA PERFIL
        const { data: prof } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", professorId)
          .single();

        if (!prof || prof.user_role !== "professor") {
          alert("Acesso negado");
          return (window.location.href = "/login");
        }

        setProfessor(prof);

        // BUSCAR CURSOS DO PROFESSOR
        const { data: cursosData } = await supabase
          .from("cursos")
          .select("*")
          .eq("professor_id", professorId);

        setCursos(cursosData || []);

        carregarHistorico(professorId);

      } catch (err) {
        console.error("Erro ao carregar painel:", err);
      }
    }

    carregarPainel();
  }, []);

  // =========================================================
  // BUSCAR ALUNOS MATRICULADOS NO CURSO
  // =========================================================
  async function carregarAlunos(cursoId) {
    setCursoSelecionado(cursoId);
    setAlunos([]);

    // BUSCA MATRÍCULAS DESSE CURSO
    const { data: mats } = await supabase
      .from("matriculas")
      .select("aluno_id")
      .eq("curso_id", cursoId);

    if (!mats || mats.length === 0) return;

    // Carregar nomes dos alunos manualmente
    let listaAlunos = [];
    for (const m of mats) {
      const { data: aluno } = await supabase
        .from("usuarios")
        .select("id, nome")
        .eq("id", m.aluno_id)
        .single();

      if (aluno) listaAlunos.push(aluno);
    }

    setAlunos(listaAlunos);
  }

  // =========================================================
  // LANÇAR NOTA
  // =========================================================
  async function lancarNota(e) {
    e.preventDefault();

    if (!cursoSelecionado || !alunoSelecionado || !tipoAtividade || !nota) {
      alert("Preencha todos os campos!");
      return;
    }

    const { error } = await supabase.from("notas").insert({
      aluno_id: alunoSelecionado,
      curso_id: cursoSelecionado,
      atividade: tipoAtividade,
      nota: Number(nota),
    });

    if (error) {
      console.error(error);
      alert("Erro ao lançar nota.");
      return;
    }

    alert("Nota lançada com sucesso!");
    setTipoAtividade("");
    setNota("");
    carregarHistorico(professor.id);
  }

  // =========================================================
  // HISTÓRICO DO PROFESSOR
  // =========================================================
  async function carregarHistorico(professorId) {
    try {
      // Buscar cursos desse professor
      const { data: cursosProf } = await supabase
        .from("cursos")
        .select("id")
        .eq("professor_id", professorId);

      if (!cursosProf) return;

      const resultado = [];

      for (const c of cursosProf) {
        const { data: notas } = await supabase
          .from("notas")
          .select("id, atividade, nota, data, aluno_id")
          .eq("curso_id", c.id);

        if (notas && notas.length > 0) {
          for (const n of notas) {
            // BUSCAR NOME DO ALUNO
            const { data: aluno } = await supabase
              .from("usuarios")
              .select("nome")
              .eq("id", n.aluno_id)
              .single();

            // BUSCAR NOME DO CURSO
            const { data: cursoData } = await supabase
              .from("cursos")
              .select("nome")
              .eq("id", c.id)
              .single();

            resultado.push({
              ...n,
              aluno_nome: aluno?.nome ?? "—",
              curso_nome: cursoData?.nome ?? "—",
            });
          }
        }
      }

      setHistorico(resultado);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!professor) return <p>Carregando...</p>;

  return (
    <div className="professor-container">
      <header className="professor-header">
        <div className="professor-logo">SGA — Professor</div>

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
          <h2>👋 Bem-vindo(a), {professor.nome}</h2>
          <p>Gerencie seus cursos e notas dos alunos.</p>
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
              placeholder="Tipo da atividade"
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

            <button type="submit" className="professor-btn">
              Lançar Nota
            </button>
          </form>
        </section>

        <section className="professor-card">
          <h2>📊 Histórico</h2>

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
                  <td>{h.aluno_nome}</td>
                  <td>{h.curso_nome}</td>
                  <td>{h.atividade}</td>
                  <td>{h.nota}</td>
                  <td>{new Date(h.data).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}