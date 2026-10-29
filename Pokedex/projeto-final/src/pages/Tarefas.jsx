import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import TarefaForm from "../components/TarefaForm";
import TarefaItem from "../components/TarefaItem";
import tarefasIniciais from "../data/tarefasIniciais";
import useLocalStorage from "../hooks/useLocalStorage";

const FILTROS = ["todas", "pendentes", "feitas"];

export default function Tarefas() {
  const [tarefas, setTarefas] = useLocalStorage("tarefas", tarefasIniciais);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todas");

  // Estado DERIVADO: a lista filtrada não fica num useState, é calculada
  const visiveis = useMemo(
    () =>
      tarefas.filter(
        (t) =>
          t.texto.toLowerCase().includes(busca.trim().toLowerCase()) &&
          (filtro === "todas" || (filtro === "feitas" ? t.feita : !t.feita))
      ),
    [tarefas, busca, filtro]
  );

  // Nunca altere o array do estado (push/splice): crie sempre um novo
  function adicionar(texto) {
    setTarefas((atual) => [...atual, { id: Date.now(), texto, feita: false }]);
  }

  function alternar(id) {
    setTarefas((atual) => atual.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }

  function remover(id) {
    setTarefas((atual) => atual.filter((t) => t.id !== id));
  }

  return (
    <>
      <h1>Tarefas</h1>
      <TarefaForm onAdicionar={adicionar} />

      <div className="filtros">
        <SearchBar valor={busca} onChange={setBusca} />
        {FILTROS.map((f) => (
          <button key={f} className={f === filtro ? "ativo" : ""} onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p>Nenhuma tarefa por aqui.</p>
      ) : (
        <ul className="lista">
          {visiveis.map((tarefa) => (
            <TarefaItem
              key={tarefa.id}
              tarefa={tarefa}
              onAlternar={alternar}
              onRemover={remover}
            />
          ))}
        </ul>
      )}
    </>
  );
}
