import { useState } from "react";

// Formulário controlado: o texto fica no estado e o pai recebe a tarefa pronta
export default function TarefaForm({ onAdicionar }) {
  const [texto, setTexto] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // sem isso a página recarrega
    if (texto.trim() === "") return;
    onAdicionar(texto.trim());
    setTexto(""); // limpa o campo
  }

  return (
    <form className="nova-tarefa" onSubmit={handleSubmit}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que você precisa fazer?"
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}
