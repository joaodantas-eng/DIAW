import { Link, useNavigate, useParams } from "react-router-dom";
import tarefasIniciais from "../data/tarefasIniciais";
import useLocalStorage from "../hooks/useLocalStorage";

export default function TarefaDetalhe() {
  const { id } = useParams(); // vem da rota /tarefa/:id (sempre como texto)
  const navigate = useNavigate();
  const [tarefas] = useLocalStorage("tarefas", tarefasIniciais);
  const tarefa = tarefas.find((t) => t.id === Number(id));

  if (!tarefa) {
    return (
      <p>
        Tarefa não encontrada. <Link to="/">Voltar</Link>
      </p>
    );
  }

  return (
    <article className="detalhe">
      <button onClick={() => navigate(-1)}>← Voltar</button>
      <h1>{tarefa.texto}</h1>
      <p>Situação: {tarefa.feita ? "feita ✅" : "pendente ⏳"}</p>
      <p>Código: {tarefa.id}</p>
    </article>
  );
}
