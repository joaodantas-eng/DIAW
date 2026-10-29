import { Link } from "react-router-dom";

// Recebe tudo por props: o item não sabe de onde vêm os dados
export default function TarefaItem({ tarefa, onAlternar, onRemover }) {
  return (
    <li className={tarefa.feita ? "tarefa feita" : "tarefa"}>
      <input type="checkbox" checked={tarefa.feita} onChange={() => onAlternar(tarefa.id)} />
      <Link to={`/tarefa/${tarefa.id}`}>{tarefa.texto}</Link>
      <button onClick={() => onRemover(tarefa.id)}>Remover</button>
    </li>
  );
}
