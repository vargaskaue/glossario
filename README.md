# Glossário — Concepções de Língua e Texto

Glossário interativo desenvolvido como produto final da disciplina **PPGLET899** do Programa de Pós-Graduação em Letras da UFSM. Permite navegação entre verbetes interligados por wikilinks, com visualização em grafo de conceitos.

---

## Como o projeto funciona

O glossário é uma aplicação web estática construída com **Vue 3 + Vite**. Todo o conteúdo fica em arquivos `.md` (Markdown) dentro da pasta `src/content/`. Não há banco de dados nem servidor — tudo roda no navegador a partir de arquivos pré-compilados.

```
src/
├── content/            ← Aqui ficam os verbetes (.md)
├── views/
│   ├── HomeView.vue    ← Página inicial (lista + busca)
│   └── VerbeteView.vue ← Página de leitura de um verbete
└── lib/
    └── parseMarkdown.js ← Lê o cabeçalho dos arquivos .md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (já vem junto com o Node)
- Git

Para verificar se estão instalados, abra o terminal e rode:

```bash
node --version   # deve mostrar v20.x.x ou superior
npm --version
```

---

## Instalação local (para desenvolver ou editar conteúdo)

```bash
# 1. Clone o repositório
git clone https://github.com/vargaskaue/glossario.git
cd glossario

# 2. Instale as dependências
npm install

# 3. Inicie o servidor local
npm run dev
```

O projeto ficará disponível em `http://localhost:5173`. Qualquer alteração em arquivos `.md` ou `.vue` atualiza o navegador automaticamente.

---

## Como adicionar ou editar verbetes

Cada verbete é um arquivo `.md` dentro de `src/content/`. O arquivo deve seguir esta estrutura:

```markdown
---
titulo: Nome do Conceito
autor: SOBRENOME, Nome; SOBRENOME2, Nome2
resumo: Uma frase curta que aparece no card da página inicial.
---

Texto completo do verbete em Markdown. Pode usar **negrito**, *itálico*,
títulos com ## e listas com -.

## Referências Bibliográficas

AUTOR, Nome. Título da obra. Editora, ano.

## Conteúdos Relacionados

[[nome do outro verbete]] [[outro conceito]]
```

### Regras para o nome do arquivo

O nome do arquivo vira o identificador do verbete na URL. Use apenas letras minúsculas, números e hífens — sem acentos, espaços ou caracteres especiais:

| Título do verbete           | Nome do arquivo                  |
| --------------------------- | -------------------------------- |
| Complexidade                | `complexidade.md`                |
| Sistema Adaptativo Complexo | `sistema-adaptativo-complexo.md` |
| Língua(gem) como SAC        | `lingua-gem-como-sac.md`         |

### Wikilinks (conexões entre verbetes)

Para criar um link de um verbete para outro, use a sintaxe do Obsidian:

```
[[nome do outro verbete]]
```

O sistema converte automaticamente o texto do wikilink em um slug (minúsculas, sem acentos, hífens no lugar de espaços) e busca o arquivo correspondente. O mesmo link aparece como nó no grafo lateral.

Para exibir um texto diferente do nome do arquivo:

```
[[nome-do-arquivo|Texto exibido ao leitor]]
```

---

## Publicação no GitHub Pages

O projeto já está configurado para publicar no GitHub Pages com um comando:

```bash
npm run deploy
```

Isso executa o build e envia o resultado para a branch `gh-pages` do repositório. Antes de rodar pela primeira vez em um repositório diferente, atualize o campo `base` no arquivo `vite.config.js`:

```js
export default defineConfig({
  base: '/nome-do-repositorio/', // ← troque pelo nome exato do repositório no GitHub
  ...
})
```

---

## Hospedagem em servidor da universidade (Apache/Nginx)

Para hospedar em um servidor próprio em vez do GitHub Pages:

### 1. Gerar os arquivos estáticos

```bash
npm install
npm run build
```

Isso cria a pasta `dist/` com todos os arquivos prontos para servir.

### 2. Ajustar o caminho base

Se o glossário não ficar na raiz do servidor (ex: `servidor.ufsm.br/ppglet/glossario/`), edite o `vite.config.js` antes de rodar o build:

```js
base: '/ppglet/glossario/',  // ou '/' se for a raiz do domínio
```

### 3. Configurar o servidor para Single Page Application

Como o Vue Router usa URLs como `/verbete/complexidade`, o servidor precisa redirecionar todas as rotas para o `index.html`. Caso contrário, atualizar a página ou acessar um link direto retorna erro 404.

**Apache** — crie um arquivo `.htaccess` dentro da pasta `dist/` antes de enviar para o servidor:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ppglet/glossario/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /ppglet/glossario/index.html [L]
</IfModule>
```

> Ajuste o caminho `/ppglet/glossario/` para onde os arquivos estão no servidor.

**Nginx** — bloco de configuração:

```nginx
location /ppglet/glossario/ {
  try_files $uri $uri/ /ppglet/glossario/index.html;
}
```

### 4. Copiar os arquivos

Copie o conteúdo da pasta `dist/` para o diretório público do servidor (geralmente `/var/www/html/` ou o equivalente na infraestrutura da UFSM).

---

## Dependências principais

| Pacote      | Versão | Função                                    |
| ----------- | ------ | ----------------------------------------- |
| vue         | ^3.5   | Framework da interface                    |
| vue-router  | ^5.0   | Navegação entre páginas                   |
| marked      | ^18.0  | Converte Markdown em HTML                 |
| vis-network | ^10.1  | Grafo de conceitos relacionados           |
| vite        | ^8.0   | Empacotador / servidor de desenvolvimento |

---

## Licença

Conteúdo licenciado sob [Creative Commons CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
