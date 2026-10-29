# Tutorial React + Vite ⚛️

Tutorial passo a passo de **React com Vite**, feito para estudar os projetos da pasta [`PROJETOS/React`](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React) da disciplina **Desenvolvimento e Integração de Aplicações Web** (PUC Minas, Prof. João Paulo Aramuni).

Ao longo do tutorial você constrói uma **lista de tarefas** (o exemplo clássico de React) com adicionar, marcar como feita, remover, busca, filtro, página de detalhes, busca de CEP numa API e login com página protegida. O código pronto está em [`projeto-final/`](./projeto-final).

## 📑 Sumário

1. [Criando o projeto com Vite](#1-criando-o-projeto-com-vite)
2. [Estrutura de pastas](#2-estrutura-de-pastas)
3. [Componentes e JSX](#3-componentes-e-jsx)
4. [Props e children](#4-props-e-children)
5. [useState e eventos](#5-usestate-e-eventos)
6. [Listas com map e key](#6-listas-com-map-e-key)
7. [Filtros e useMemo](#7-filtros-e-usememo)
8. [Hook customizado: useLocalStorage](#8-hook-customizado-uselocalstorage)
9. [React Router](#9-react-router)
10. [useEffect e fetch](#10-useeffect-e-fetch)
11. [Debounce e AbortController](#11-debounce-e-abortcontroller)
12. [useRef](#12-useref)
13. [Formulários controlados](#13-formulários-controlados)
14. [Context API e rota protegida](#14-context-api-e-rota-protegida)
15. [Variáveis de ambiente e segredos](#15-variáveis-de-ambiente-e-segredos)
16. [Supabase](#16-supabase)
17. [Internacionalização (i18n)](#17-internacionalização-i18n)
18. [Deploy na Vercel](#18-deploy-na-vercel)
19. [Mapa dos projetos do professor](#19-mapa-dos-projetos-do-professor)
20. [Perguntas de revisão](#20-perguntas-de-revisão)

---

## ▶️ Rodando o projeto final

```bash
cd projeto-final
npm install
npm run dev
```

Abra `http://localhost:5173`. Para entrar no **Painel** (página protegida), use qualquer nome e a senha `1234`.

| Rota | Tela | O que ensina |
| --- | --- | --- |
| `/` | Lista de tarefas | props, useState, listas, filtros, useMemo, localStorage |
| `/tarefa/:id` | Detalhe da tarefa | parâmetro de rota (useParams) |
| `/cep` | Busca de endereço | useEffect, fetch, debounce, AbortController, useRef |
| `/login` | Login | formulário controlado, Context |
| `/painel` | Painel (protegido) | rota protegida |

---

## 1. Criando o projeto com Vite

O **Vite** cria a estrutura do projeto e roda um servidor de desenvolvimento rápido.

```bash
npm create vite@latest minhas-tarefas   # escolha: React → JavaScript
cd minhas-tarefas
npm install                           # instala o que está no package.json
npm run dev                           # roda em http://localhost:5173
```

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run build` | Gera a pasta `dist/` otimizada para publicar |
| `npm run preview` | Testa o build localmente |
| `npm install react-router-dom` | Adiciona uma dependência |

### Como o React começa

O `index.html` tem uma `<div id="root">`. O `main.jsx` desenha o `<App />` dentro dela:

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

> ⚠️ **StrictMode** roda cada `useEffect` **duas vezes** no `npm run dev`, de propósito, para revelar bugs. Em produção roda uma vez só.

---

## 2. Estrutura de pastas

É a organização usada em quase todos os projetos do professor:

```text
projeto-final/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json            ← rewrite para o React Router funcionar na Vercel
├── .env.example           ← modelo das variáveis (o .env.local não vai pro GitHub)
└── src/
    ├── main.jsx           ← ponto de entrada
    ├── App.jsx            ← rotas
    ├── index.css
    ├── components/        ← peças reutilizáveis (TarefaItem, TarefaForm, Navbar...)
    ├── pages/             ← uma tela por rota (Tarefas, Login, Cep...)
    ├── hooks/             ← hooks customizados (useLocalStorage, useDebouncedValue)
    ├── services/          ← chamadas a APIs e regras de negócio
    ├── auth/              ← Context de autenticação
    └── data/              ← dados locais (JSON / JS)
```

Nos projetos maiores ainda aparecem `repository/` (acesso ao banco), `model/` (classes), `config/` (constantes), `utils/` e `api/` (código que roda no servidor).

| React | Spring Boot (equivalente) |
| --- | --- |
| `pages/` + React Router | `Controller` + Thymeleaf |
| `services/` | `Service` |
| `repository/` | `Repository` (JPA) |
| `model/` | `Entity` / `Model` |

---

## 3. Componentes e JSX

Um **componente** é uma função que devolve **JSX** (um HTML dentro do JavaScript). O nome começa com letra maiúscula.

```jsx
export default function NotFound() {
  return (
    <>
      <h1>404</h1>
      <p>Página não encontrada.</p>
    </>
  );
}
```

Regras do JSX:

- `className` no lugar de `class`;
- tudo que é JavaScript vai entre `{ }`: `<h1>{tarefa.texto}</h1>`;
- o componente devolve **um** elemento raiz. Para não criar uma `div` extra, use o fragmento `<>...</>`;
- condicional: `{logado && <p>Oi!</p>}` ou `{logado ? <A /> : <B />}`.

---

## 4. Props e children

**Props** são os dados que o componente pai passa para o filho. São **só leitura**.

```jsx
// Pai (src/pages/Tarefas.jsx)
<TarefaItem tarefa={tarefa} onAlternar={alternar} onRemover={remover} />
```

```jsx
// Filho (src/components/TarefaItem.jsx)
export default function TarefaItem({ tarefa, onAlternar, onRemover }) {
  return (
    <li className={tarefa.feita ? "tarefa feita" : "tarefa"}>
      <input type="checkbox" checked={tarefa.feita} onChange={() => onAlternar(tarefa.id)} />
      <span>{tarefa.texto}</span>
      <button onClick={() => onRemover(tarefa.id)}>Remover</button>
    </li>
  );
}
```

> 💡 **Os dados descem, os eventos sobem.** O filho não muda o estado do pai: ele chama uma função que o pai passou por props (`onAlternar`, `onRemover`). Quem guarda a lista é o pai.

**children** é o que fica entre as tags do componente:

```jsx
<ProtectedRoute>
  <Painel />        {/* isto é o children */}
</ProtectedRoute>
```

---

## 5. useState e eventos

`useState` guarda um valor que, quando muda, **re-renderiza** o componente.

```jsx
import { useState } from "react";

const [busca, setBusca] = useState("");   // [valor, função que muda o valor]

setBusca("estudar");                      // muda e re-renderiza
```

Quando o novo valor depende do anterior, passe uma função. As três operações de uma lista:

```jsx
// Adicionar: copia o array e coloca o item novo no fim
setTarefas((atual) => [...atual, { id: Date.now(), texto, feita: false }]);

// Alterar um item: map devolve um array novo, trocando só o item certo
setTarefas((atual) => atual.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));

// Remover: filter devolve um array novo sem o item
setTarefas((atual) => atual.filter((t) => t.id !== id));
```

> ⚠️ **Nunca altere o estado direto** (`tarefas.push(x)`, `tarefa.feita = true` ou `busca = "x"`). Crie sempre um valor novo, com `...spread`, `filter` ou `map`. Se o array for o mesmo, o React não percebe a mudança.

Eventos usam camelCase e recebem uma **função**:

```jsx
<button onClick={sair}>Sair</button>          // ✅ passa a função
<button onClick={sair()}>Sair</button>        // ❌ chama na hora de renderizar
<button onClick={() => remover(tarefa.id)}>X</button> // ✅ com argumento
```

---

## 6. Listas com map e key

Para desenhar uma lista, use `.map()`. Cada item precisa de uma `key` **única e estável** (de preferência o `id`).

```jsx
<ul className="lista">
  {visiveis.map((tarefa) => (
    <TarefaItem key={tarefa.id} tarefa={tarefa} onAlternar={alternar} onRemover={remover} />
  ))}
</ul>
```

Lista vazia? Mostre uma mensagem:

```jsx
{visiveis.length === 0 ? <p>Nenhuma tarefa por aqui.</p> : <ul>...</ul>}
```

A `key` diz ao React qual item é qual quando a lista muda. Evite usar o índice do array como key, porque ele muda quando a lista é filtrada ou ordenada.

---

## 7. Filtros e useMemo

A lista filtrada é um **estado derivado**: ela não vai para um `useState`, é calculada a partir da lista original e dos filtros. O `useMemo` só refaz a conta quando as dependências mudam.

```jsx
// src/pages/Tarefas.jsx
const [busca, setBusca] = useState("");
const [filtro, setFiltro] = useState("todas"); // todas | pendentes | feitas

const visiveis = useMemo(
  () =>
    tarefas.filter(
      (t) =>
        t.texto.toLowerCase().includes(busca.trim().toLowerCase()) &&
        (filtro === "todas" || (filtro === "feitas" ? t.feita : !t.feita))
    ),
  [tarefas, busca, filtro]
);
```

| Hook | Memoriza | Exemplo |
| --- | --- | --- |
| `useMemo` | um **valor** calculado | a lista filtrada |
| `useCallback` | uma **função** | `const limpar = useCallback(() => setBusca(""), [])` |

É o mesmo padrão dos filtros do projeto **Pokedex** do professor (`usePokedexFilters`).

---

## 8. Hook customizado: useLocalStorage

Um **hook customizado** é uma função que começa com `use` e usa outros hooks. Serve para reaproveitar lógica.

```js
// src/hooks/useLocalStorage.js
import { useEffect, useState } from "react";

export default function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo !== null ? JSON.parse(salvo) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* aba anônima: segue só na memória */
    }
  }, [chave, valor]);

  return [valor, setValor];
}
```

Uso, igual a um `useState`:

```jsx
const [tarefas, setTarefas] = useLocalStorage("tarefas", tarefasIniciais);
```

Pronto: as tarefas continuam lá quando você recarrega a página.

- `localStorage` guarda **só texto**, por isso o `JSON.stringify` e o `JSON.parse`.
- `localStorage` dura para sempre; `sessionStorage` some ao fechar a aba.
- `useState(() => ...)` com função: a leitura só acontece na primeira renderização.

> 📏 **Regras dos hooks:** chame hooks só no topo do componente (nunca dentro de `if`, loop ou função comum) e só dentro de componentes ou de outros hooks.

---

## 9. React Router

```bash
npm install react-router-dom
```

Envolva o app com o `BrowserRouter`:

```jsx
// src/main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

Declare as rotas:

```jsx
// src/App.jsx
<Routes>
  <Route path="/" element={<Tarefas />} />
  <Route path="/tarefa/:id" element={<TarefaDetalhe />} />     {/* :id é um parâmetro */}
  <Route path="/cep" element={<Cep />} />
  <Route path="/login" element={<Login />} />
  <Route path="*" element={<NotFound />} />                    {/* qualquer outra = 404 */}
</Routes>
```

| Recurso | Para que serve | Exemplo |
| --- | --- | --- |
| `<Link to>` | Link sem recarregar a página | `<Link to="/cep">CEP</Link>` |
| `useParams()` | Lê o parâmetro da URL (sempre texto) | `const { id } = useParams()` |
| `useNavigate()` | Navega por código | `navigate("/painel")`, `navigate(-1)` (voltar) |
| `<Navigate />` | Redireciona ao renderizar | `<Navigate to="/login" replace />` |
| `useSearchParams()` | Lê `?token=...` | usado no `ResetPassword` do SecureLoginPUC |

```jsx
// src/pages/TarefaDetalhe.jsx
const { id } = useParams();
const tarefa = tarefas.find((t) => t.id === Number(id));  // id chega como texto: "2"
```

No item da lista, o link leva para essa rota:

```jsx
<Link to={`/tarefa/${tarefa.id}`}>{tarefa.texto}</Link>
```

---

## 10. useEffect e fetch

`useEffect` executa **efeitos colaterais**: buscar dados, timers, eventos da janela.

```jsx
useEffect(() => {
  // código do efeito
  return () => {
    // cleanup (opcional): roda antes do próximo efeito e quando o componente sai da tela
  };
}, [dependencias]);
```

| Dependências | Quando roda |
| --- | --- |
| `[]` | Uma vez, quando o componente aparece |
| `[a, b]` | Sempre que `a` ou `b` mudar |
| sem array | Depois de toda renderização |

### Separando a API num service

```js
// src/services/viaCepService.js
export async function buscarCep(cep, signal) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });

  if (!response.ok) throw new Error(`ViaCEP respondeu com erro ${response.status}`);

  const data = await response.json();
  if (data.erro) throw new Error("CEP não encontrado.");
  return data;
}
```

> ⚠️ **Pegadinha:** o `fetch` só cai no `catch` quando **não há rede**. Um 404 ou 500 chega normalmente, então confira sempre o `response.ok`.

### Os três estados de uma busca

Toda tela que busca dados trata: **carregando**, **sucesso** e **erro**.

```jsx
const [status, setStatus] = useState("idle"); // idle | loading | success | error

{status === "loading" && <p>Buscando...</p>}
{status === "error" && <p className="erro">{erro}</p>}
{status === "success" && <p>{endereco.logradouro}</p>}
```

> 🌐 **CORS:** o navegador só chama a API de outro domínio se ela permitir. ViaCEP, IBGE, BrasilAPI e ESPN permitem, por isso os projetos chamam essas APIs direto do navegador.

---

## 11. Debounce e AbortController

Duas técnicas do projeto **ConsultaBrasil**.

**Debounce:** espera o usuário parar de digitar antes de buscar. Sem ele, digitar um CEP faria uma requisição por tecla.

```js
// src/hooks/useDebouncedValue.js
export default function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // mudou antes do tempo: cancela o timer antigo
  }, [value, delay]);

  return debounced;
}
```

**AbortController:** cancela a requisição antiga. Sem ele pode acontecer uma **condição de corrida** (race condition): a resposta do CEP antigo chega depois da do novo e a tela mostra o endereço errado.

```jsx
// src/pages/Cep.jsx
const cepParado = useDebouncedValue(soDigitos, 400);

useEffect(() => {
  if (cepParado.length !== 8) return;

  const controller = new AbortController();
  setStatus("loading");

  buscarCep(cepParado, controller.signal)
    .then((data) => { setEndereco(data); setStatus("success"); })
    .catch((e) => {
      if (e.name === "AbortError") return; // cancelada de propósito
      setErro(e.message);
      setStatus("error");
    });

  return () => controller.abort();       // cleanup: cancela a busca anterior
}, [cepParado]);
```

O ConsultaBrasil ainda tem **timeout** (um `setTimeout` que chama `abort()`), **cache** (um `Map` com a URL como chave) e **fallback** (se o ViaCEP falhar, tenta a BrasilAPI).

---

## 12. useRef

`useRef` guarda um valor que **não re-renderiza** a tela quando muda. Tem dois usos:

1. **Acessar um elemento do DOM:**

```jsx
const numeroRef = useRef(null);

<input ref={numeroRef} />

numeroRef.current.focus();   // leva o cursor para o campo
```

2. **Guardar algo entre renderizações**, como o mapa do Mapbox ou o `AbortController` da busca anterior:

```js
const abortRef = useRef(null);
abortRef.current?.abort();
abortRef.current = new AbortController();
```

| | `useState` | `useRef` |
| --- | --- | --- |
| Mudar re-renderiza? | Sim | Não |
| Como ler | `valor` | `ref.current` |

---

## 13. Formulários controlados

Num input **controlado**, o valor vem do estado (`value`) e cada tecla atualiza o estado (`onChange`).

```jsx
// src/components/TarefaForm.jsx
export default function TarefaForm({ onAdicionar }) {
  const [texto, setTexto] = useState("");

  function handleSubmit(e) {
    e.preventDefault();             // sem isso a página recarrega
    if (texto.trim() === "") return;
    onAdicionar(texto.trim());      // avisa o pai
    setTexto("");                   // limpa o campo
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button type="submit">Adicionar</button>
    </form>
  );
}
```

O login (`src/pages/Login.jsx`) segue o mesmo modelo, com dois campos (nome e senha).

---

## 14. Context API e rota protegida

O **Context** compartilha um dado com **todos** os componentes, sem passar props por cada nível (o chamado *prop drilling*). Ele serve para o usuário logado, o tema ou o idioma.

São três passos: **criar**, **prover** e **usar**.

```jsx
// src/auth/AuthContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

// 1. Criar
const AuthContext = createContext({ usuario: null, login: () => false, logout: () => {} });

// 2. Prover
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerSessao);

  const value = useMemo(() => ({
    usuario,
    login(nome, senha) { /* ... */ },
    logout() { /* ... */ },
  }), [usuario]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Usar
export const useAuth = () => useContext(AuthContext);
```

```jsx
// src/main.jsx
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>
```

### Rota protegida

```jsx
// src/components/ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}
```

```jsx
<Route
  path="/painel"
  element={
    <ProtectedRoute>
      <Painel />
    </ProtectedRoute>
  }
/>
```

Dentro do `Painel`, qualquer componente pega o usuário com `const { usuario } = useAuth();`.

> No projeto **SecureLoginPUC_React** do professor, os usuários ficam no `localStorage` (senha com hash), a sessão no `sessionStorage`, o e-mail de recuperação sai pelo **EmailJS** e o login tem **Google reCAPTCHA**. Login só no front-end serve para estudar; em produção a validação precisa de um back-end.

---

## 15. Variáveis de ambiente e segredos

```bash
cp .env.example .env.local
```

```env
# .env.local (está no .gitignore e NUNCA vai para o GitHub)
VITE_APP_TITLE=Minhas Tarefas      # com VITE_: vai para o navegador
GITHUB_TOKEN=github_pat_xxx        # sem VITE_: só o servidor lê
```

```js
import.meta.env.VITE_APP_TITLE   // no React
process.env.GITHUB_TOKEN         // na pasta api/ (servidor)
```

> 🔐 **Regra de ouro:** tudo que começa com `VITE_` é embutido no JavaScript do site e **qualquer visitante consegue ler**. Chaves secretas (GitHub, Spotify, Gemini, Stripe secret, WakaTime) ficam **sem** `VITE_` e só são usadas no servidor.

### A pasta `api/` (Vercel Functions)

Quando a API precisa de uma chave secreta, o navegador chama uma rota do próprio site (`/api/github`), e quem fala com a API externa é o servidor:

```text
Navegador ──▶ /api/github ──▶ (servidor, com o token) ──▶ api.github.com
```

- **Em produção:** a Vercel transforma `api/github.js` numa **Vercel Function** (serverless).
- **No `npm run dev`:** o `vite.config.js` registra um *middleware* que atende a mesma rota.
- Arquivos que começam com `_` (ex.: `api/_github.js`) não viram rota e guardam a lógica compartilhada.

```js
// api/github.js
export default function handler(req, res) {
  // process.env.GITHUB_TOKEN está disponível aqui, e só aqui
}
```

Projetos do professor com `api/`: GitHubAPI, ContributorStats, SpotifyAPI, GeminiAPI, StripeAPI, StripeAPI_2, WakaTimeAPI, CanvasAPI, Captcha_React e SubtitlesGenerator.

> 🤖 **Captcha:** validar só no front não protege nada, porque um robô chama a API direto, sem passar pela tela. A validação de verdade acontece no servidor, com a *secret key*.

> 💳 **Stripe:** (1) o front manda os itens para `/api/stripe`; (2) o servidor calcula o total e cria o **PaymentIntent** com a secret key; (3) devolve o `clientSecret`; (4) o front chama `stripe.confirmPayment`. O total é calculado no servidor para o usuário não conseguir mudar o preço.

---

## 16. Supabase

O **Supabase** é um PostgreSQL na nuvem que o navegador acessa por HTTPS. É assim que Pokedex, AraUrlShortener e RadioBrowserAPI_2 salvam dados sem ter back-end próprio.

```bash
npm install @supabase/supabase-js
```

```js
// src/config/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

```js
// src/repository/tarefaRepository.js
await supabase.from("tarefas").select("*");
await supabase.from("tarefas").insert({ texto: "Estudar", feita: false });
await supabase.from("tarefas").delete().eq("id", 2);
await supabase.rpc("resolve_url", { p_short_url: "Ab3xYz" });   // chama uma função SQL
```

- **Por que a chave pode ficar no navegador?** A chave **publicável** (anon) sozinha não dá acesso a nada. Quem protege as tabelas é o **RLS** (*Row Level Security*): regras no próprio banco que dizem quem pode ler e escrever.
- A chave `service_role` / *secret* **nunca** vai para o front.
- No Spring, a conexão era JDBC + Spring Data JPA no servidor. Aqui o SDK chama a Data API do Supabase.

---

## 17. Internacionalização (i18n)

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

```js
// src/i18n/index.js (importado uma vez no main.jsx)
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ptBR from "./locales/pt-BR/translation.json";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: { "pt-BR": { translation: ptBR }, en: { translation: en } },
  fallbackLng: "pt-BR",                    // idioma usado quando falta tradução
  interpolation: { escapeValue: false },   // o React já protege contra XSS
});
```

```jsx
const { t, i18n } = useTranslation();

<h1>{t("home.titulo")}</h1>
<button onClick={() => i18n.changeLanguage("en")}>English</button>
```

Um `translation.json` por idioma. O detector usa primeiro a escolha salva no `localStorage` e depois o idioma do navegador. A troca de idioma acontece sem recarregar a página.

---

## 18. Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Se o projeto estiver numa subpasta, aponte o **Root Directory** para ela (aqui, `projeto-final`).
4. Cadastre as variáveis do `.env.local` em **Settings → Environment Variables**.
5. **Deploy**.

O `vercel.json` é obrigatório quando o projeto usa React Router:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Numa SPA só existe o `index.html`. Sem o rewrite, abrir `/painel` direto ou dar F5 numa rota dá **404**. Com ele, a Vercel entrega o `index.html` e o React Router mostra a tela certa.

---

## 19. Mapa dos projetos do professor

| Projeto | O que faz | Conceito-chave |
| --- | --- | --- |
| Pokedex | 151 Pokémon com busca, filtro e favoritos (Atividade 03) | Componentes, props, map/key, useMemo, Supabase |
| ConsultaBrasil | CEP, estados/cidades, CNPJ, feriados, DDD | Debounce, AbortController, timeout, cache, fallback |
| AraUrlShortener | Encurtador de URL | React Router, useParams, Supabase + RLS, vercel.json |
| SecureLoginPUC_React | Login, cadastro e recuperação de senha | Context API, rota protegida, localStorage, EmailJS, reCAPTCHA |
| RadioBrowserAPI_2_React | Rádios por país/estado + favoritos | API pública, `<audio>`, Supabase |
| CandidatosTSE (1 e 2) | Candidatos de um CSV com filtros | PapaParse, URLSearchParams |
| GitHubAPI | Perfil, repositórios e contribuições | Hook genérico de fetch, `api/` com token |
| ContributorStats | Ranking de colaboradores de um repositório | GitHub API, regra de negócio portada do Python |
| SpotifyAPI | Tocando agora e mais ouvidas | OAuth (refresh token) no servidor |
| WakaTimeAPI | Tempo programando por linguagem | OAuth, `api/`, atualização periódica |
| CanvasAPI | Painel das disciplinas do Canvas | API REST com token no servidor |
| GeminiAPI | Chat "pergunte sobre mim" | IA no servidor, streaming |
| SubtitlesGenerator | Gera legenda `.srt` de um vídeo | ffmpeg.wasm + Gemini |
| StripeAPI (1 e 2) | Carrinho e pagamento de teste | PaymentIntent, clientSecret |
| Captcha_React | 8 tipos de captcha | Validação no servidor |
| Internacionalizacao_i18n | Site em pt, en e es | i18next, useTranslation |
| MapBoxAPI | Mapa das unidades da PUC | useRef com biblioteca externa |
| ESPN_API | Jogos, placar ao vivo e tabela | API pública com CORS |
| PixGenerator | QR Code Pix | Lógica no navegador (BR Code, CRC16) |
| CurriculumPDF | Currículo em PDF na página | react-pdf |
| SkillsGlobe | Globo 3D de habilidades | `<canvas>`, useRef |
| ReactBits | Efeitos que seguem o mouse | Componentes prontos e props |

---

## 20. Perguntas de revisão

<details>
<summary>Qual a diferença entre props e state?</summary>

Props vêm do componente pai e são só leitura. State pertence ao próprio componente, muda com a função `set` e re-renderiza a tela.
</details>

<details>
<summary>Para que serve o array de dependências do useEffect?</summary>

Diz quando o efeito roda de novo: `[]` roda uma vez; `[x]` roda quando `x` muda; sem array roda a cada renderização.
</details>

<details>
<summary>O que é o cleanup do useEffect?</summary>

É a função retornada pelo efeito. Roda antes do efeito rodar de novo e quando o componente sai da tela. Serve para cancelar timers, requisições (`abort()`) e event listeners.
</details>

<details>
<summary>Qual a diferença entre useRef e useState?</summary>

Mudar `ref.current` não re-renderiza; mudar o state re-renderiza. useRef acessa elementos do DOM e guarda valores entre renderizações.
</details>

<details>
<summary>useMemo ou useCallback?</summary>

`useMemo` memoriza um valor calculado; `useCallback` memoriza uma função. Os dois só recalculam quando as dependências mudam.
</details>

<details>
<summary>Por que a key é obrigatória em listas?</summary>

Para o React saber qual item é qual entre renderizações e atualizar só o que mudou. Deve ser única e estável, como o `id`.
</details>

<details>
<summary>Para que serve e.preventDefault() no onSubmit?</summary>

Impede o comportamento padrão do formulário, que é recarregar a página.
</details>

<details>
<summary>Por que o fetch não cai no catch com um erro 404?</summary>

O fetch só rejeita a Promise em falha de rede. Respostas HTTP de erro chegam normalmente; é preciso checar `response.ok`.
</details>

<details>
<summary>O que é debounce?</summary>

Esperar o usuário parar de digitar por alguns milissegundos antes de buscar, para não fazer uma requisição por tecla.
</details>

<details>
<summary>O que é condição de corrida num fetch e como evitar?</summary>

Uma resposta antiga chega depois da nova e a tela mostra o dado errado. Evita cancelando a requisição anterior com `AbortController` no cleanup.
</details>

<details>
<summary>Qual o risco de uma variável com prefixo VITE_?</summary>

Ela vai para o código do navegador e qualquer pessoa pode ler. Segredos ficam sem `VITE_`, no servidor (pasta `api/`).
</details>

<details>
<summary>Por que a chave publicável do Supabase pode ficar no front?</summary>

Porque quem protege os dados é o RLS e as funções SQL do banco, não a chave. A `service_role` nunca vai para o front.
</details>

<details>
<summary>Como ler o parâmetro de /tarefa/:id?</summary>

`const { id } = useParams();`. Ele chega como texto, por isso o `Number(id)`.
</details>

<details>
<summary>Como funciona uma rota protegida?</summary>

Um componente lê o usuário do Context e devolve `children` se houver login, ou `<Navigate to="/login" replace />` se não houver.
</details>

<details>
<summary>Por que o vercel.json tem um rewrite para /index.html?</summary>

Numa SPA só existe o `index.html`. Sem o rewrite, abrir uma rota direto ou dar F5 dá 404 na Vercel.
</details>

<details>
<summary>Por que o efeito roda duas vezes no npm run dev?</summary>

Por causa do `<StrictMode>`, que faz isso de propósito em desenvolvimento. Em produção roda uma vez.
</details>

<details>
<summary>O que muda de um projeto Spring Boot para a versão React?</summary>

O trabalho sai do servidor e vai para o navegador: o Thymeleaf montava o HTML e agora o React desenha; JDBC/JPA vira Supabase pelo SDK; o Controller vira uma rota do React Router; Service e Repository continuam como arquivos JS.
</details>

---

## 📚 Links

- [Repositório da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web)
- [Documentação do React](https://react.dev/learn)
- [Documentação do Vite](https://vite.dev/guide/)
- [React Router](https://reactrouter.com/)
- [ViaCEP](https://viacep.com.br/)
