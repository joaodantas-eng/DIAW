// Input controlado: o valor vem do estado do pai (value) e cada tecla avisa o pai (onChange)
export default function SearchBar({ valor, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar tarefa..."
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
