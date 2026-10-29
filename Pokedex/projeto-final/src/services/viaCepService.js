// Service: só sabe falar com a API. Não sabe nada de React.
export async function buscarCep(cep, signal) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });

  // fetch só dá erro sem rede: 404 e 500 chegam aqui, então confira o ok
  if (!response.ok) throw new Error(`ViaCEP respondeu com erro ${response.status}`);

  const data = await response.json();
  if (data.erro) throw new Error("CEP não encontrado.");
  return data;
}
