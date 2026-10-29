import { useEffect, useRef, useState } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { buscarCep } from "../services/viaCepService";

export default function Cep() {
  const [cep, setCep] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [endereco, setEndereco] = useState(null);
  const [erro, setErro] = useState("");
  const numeroRef = useRef(null); // acesso direto ao <input> do número

  const soDigitos = cep.replace(/\D/g, "");
  const cepParado = useDebouncedValue(soDigitos, 400);

  useEffect(() => {
    if (cepParado.length !== 8) {
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    buscarCep(cepParado, controller.signal)
      .then((data) => {
        setEndereco(data);
        setStatus("success");
        numeroRef.current?.focus(); // leva o cursor para o número
      })
      .catch((e) => {
        if (e.name === "AbortError") return; // cancelada de propósito: ignora
        setErro(e.message);
        setStatus("error");
      });

    // Cleanup: se o CEP mudar antes da resposta, cancela a busca antiga
    return () => controller.abort();
  }, [cepParado]);

  return (
    <>
      <h1>Buscar endereço pelo CEP</h1>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label>
          CEP
          <input
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="30535-901"
            maxLength={9}
          />
        </label>

        {status === "loading" && <p>Buscando...</p>}
        {status === "error" && <p className="erro">{erro}</p>}

        {status === "success" && endereco && (
          <>
            <p>
              {endereco.logradouro}, {endereco.bairro} – {endereco.localidade}/{endereco.uf}
            </p>
            <label>
              Número
              <input ref={numeroRef} />
            </label>
          </>
        )}
      </form>
    </>
  );
}
