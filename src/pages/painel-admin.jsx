import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/painel-admin.css";

export default function AdminPanel() {
  const [user, setUser] = useState(null);

  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [mensagens, setMensagens] = useState([]);

  const [cursoForm, setCursoForm] = useState({
    nome: "",
    duracao: "",
    descricao: "",
    professorId: ""
  });

  const [editarCursoForm, setEditarCursoForm] = useState({
    id: "",
    nome: "",
    duracao: "",
    descricao: "",
    professorId: ""
  });

  const [modalAberto, setModalAberto] = useState(false);

  // =======================
  // AUTENTICAÇÃO
  // =======================
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return window.location.href = "/login";

      const { data: userData } = await supabase
        .from("usuarios")
        .select("id, nome, email, user_role")
        .eq("id", session.user.id)
        .single();

      if (!userData || userData.user_role !== "admin") {
        alert("Acesso negado.");
        return window.location.href = "/login";
      }

      setUser(userData);
      carregarDados();
    }

    init();
  }, []);

  // =======================
  // DADOS DO PAINEL
  // =======================
  const carregarDados = async () => {
    await Promise.all([
      listarCursos(),
      listarProfessores(),
      listarAlunos(),
      listarMensagens()
    ]);
  };

  // =======================
  // CURSOS
  // =======================
  const listarCursos = async () => {
    const { data: cursosData } = await supabase
      .from("cursos")
      .select("id, nome, duracao, descricao, professor_id")
      .order("nome");

    const { data: profs } = await supabase
      .from("usuarios")
      .select("id, nome");

    const formatados = cursosData?.map(c => ({
      ...c,
      professorNome: profs?.find(p => p.id === c.professor_id)?.nome ?? "—"
    })) || [];

    setCursos(formatados);
  };

  const cadastrarCurso = async (e) => {
    e.preventDefault();
    const { nome, duracao, descricao, professorId } = cursoForm;

    if (!nome || !duracao || !descricao || !professorId)
      return alert("Preencha todos os campos.");

    await supabase.from("cursos").insert({
      id: crypto.randomUUID(),
      nome,
      duracao,
      descricao,
      professor_id: professorId
    });

    alert(`Curso "${nome}" cadastrado!`);
    carregarDados();

    setCursoForm({
      nome: "",
      duracao: "",
      descricao: "",
      professorId: ""
    });
  };

  const abrirModalEditar = (curso) => {
    setEditarCursoForm({
      id: curso.id,
      nome: curso.nome,
      duracao: curso.duracao,
      descricao: curso.descricao,
      professorId: curso.professor_id
    });
    setModalAberto(true);
  };

  const salvarEdicaoCurso = async (e) => {
    e.preventDefault();
    const { id, nome, duracao, descricao, professorId } = editarCursoForm;

    await supabase.from("cursos")
      .update({ nome, duracao, descricao, professor_id: professorId })
      .eq("id", id);

    alert("Curso atualizado!");
    setModalAberto(false);
    carregarDados();
  };

  const deletarCurso = async (id) => {
    if (!confirm("Excluir este curso?")) return;
    await supabase.from("cursos").delete().eq("id", id);
    carregarDados();
  };

  // =======================
  // PROFESSORES
  // =======================
  const listarProfessores = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_role", "professor");
    setProfessores(data || []);
  };

  const deletarUsuario = async (id) => {
    if (!confirm("Excluir usuário?")) return;
    await supabase.from("usuarios").delete().eq("id", id);
    carregarDados();
  };

  // =======================
  // ALUNOS
  // =======================
  const listarAlunos = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_role", "aluno");
    setAlunos(data || []);
  };

  const promoverAluno = async (id) => {
    if (!confirm("Promover para professor?")) return;
    await supabase.from("usuarios").update({ user_role: "professor" }).eq("id", id);
    carregarDados();
  };

  // =======================
  // MENSAGENS
  // =======================
  const listarMensagens = async () => {
    const { data } = await supabase.from("contatos").select("*");
    setMensagens(data || []);
  };

  const deletarMensagem = async (id) => {
    if (!confirm("Excluir mensagem?")) return;
    await supabase.from("contatos").delete().eq("id", id);
    carregarDados();
  };

  // =======================
  // LOGOUT
  // =======================
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="admin-container">

      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-logo">SGA — Admin</div>

        <div className="admin-header-right">
          <nav className="admin-nav">
            <a href="/curso">Cursos</a>
            <a href="/sobre">Sobre</a>
            <a href="/contato">Contato</a>
          </nav>

          {user && (
            <div className="admin-dropdown">
              <button className="admin-perfil-btn">{user.nome}</button>
              <div className="admin-menu">
                <p>{user.email}</p>
                <button onClick={logout} className="admin-logout-btn">Sair</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="admin-main">
        <section className="admin-grid">

          {/* CADASTRAR CURSO */}
          <div className="admin-card">
            <h2>Cadastro de Cursos 🎓</h2>

            <form className="admin-form" onSubmit={cadastrarCurso}>
              <input type="text" placeholder="Nome do Curso" required
                value={cursoForm.nome} onChange={e => setCursoForm({...cursoForm, nome: e.target.value})} />

              <input type="text" placeholder="Duração" required
                value={cursoForm.duracao} onChange={e => setCursoForm({...cursoForm, duracao: e.target.value})} />

              <textarea placeholder="Descrição…" rows={3} required
                value={cursoForm.descricao} onChange={e => setCursoForm({...cursoForm, descricao: e.target.value})} />

              <select required value={cursoForm.professorId}
                onChange={e => setCursoForm({...cursoForm, professorId: e.target.value})}>
                <option value="">Selecione o professor</option>
                {professores.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>

              <button type="submit">Cadastrar Curso</button>
            </form>
          </div>

          {/* TABELA CURSOS */}
          <div className="admin-card admin-table-card">
            <h3>Cursos Cadastrados</h3>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Professor</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map(c => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.professorNome}</td>
                    <td>
                      <button className="admin-btn-edit" onClick={() => abrirModalEditar(c)}>Editar</button>
                      <button className="admin-btn-delete" onClick={() => deletarCurso(c.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PROFESSORES */}
          <div className="admin-card admin-table-card">
            <h3>Professores</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {professores.map(p => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.email}</td>
                    <td>
                      <button className="admin-btn-delete" onClick={() => deletarUsuario(p.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ALUNOS */}
          <div className="admin-card admin-table-card">
            <h3>Alunos</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {alunos.map(a => (
                  <tr key={a.id}>
                    <td>{a.nome}</td>
                    <td>{a.email}</td>
                    <td>
                      <button className="admin-btn-edit" onClick={() => promoverAluno(a.id)}>Promover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MENSAGENS */}
          <div className="admin-card admin-table-card">
            <h3>Mensagens de Contato 📧</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Mensagem</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {mensagens.map(m => (
                  <tr key={m.id}>
                    <td>{m.nome}</td>
                    <td>{m.email}</td>
                    <td>{m.mensagem.length > 60 ? m.mensagem.slice(0, 60) + "…" : m.mensagem}</td>
                    <td>
                      <button className="admin-btn-delete" onClick={() => deletarMensagem(m.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>
      </main>

      {/* MODAL */}
      {modalAberto && (
        <div className="admin-modal" onClick={() => setModalAberto(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <span className="admin-modal-close" onClick={() => setModalAberto(false)}>&times;</span>

            <h3>Editar Curso</h3>

            <form className="admin-form" onSubmit={salvarEdicaoCurso}>
              <input type="text" placeholder="Nome" required
                value={editarCursoForm.nome} onChange={e => setEditarCursoForm({...editarCursoForm, nome: e.target.value})}/>

              <input type="text" placeholder="Duração" required
                value={editarCursoForm.duracao} onChange={e => setEditarCursoForm({...editarCursoForm, duracao: e.target.value})}/>

              <textarea placeholder="Descrição" rows={3} required
                value={editarCursoForm.descricao} onChange={e => setEditarCursoForm({...editarCursoForm, descricao: e.target.value})}/>

              <select required value={editarCursoForm.professorId}
                onChange={e => setEditarCursoForm({...editarCursoForm, professorId: e.target.value})}>
                <option value="">Selecione o professor</option>
                {professores.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>

              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}