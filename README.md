# ZombiePlus — Testes automatizados

Projeto de estudos de automação da aplicação ZombiePlus, com Playwright e JavaScript. Combina testes pela interface, requisições HTTP para preparar dados e consultas ao PostgreSQL para limpar o ambiente.

## Tecnologias

- Playwright Test: execução, assertions, fixtures e relatórios.
- JavaScript com JSDoc: organização e autocomplete das actions.
- Faker: geração de nomes e e-mails para os cenários.
- PostgreSQL e `pg`: acesso ao banco de testes.
- dotenv: carregamento das variáveis de ambiente.
- GitHub Actions: workflow inicial de execução dos testes.

As versões das dependências estão em `package.json` e `package-lock.json`.

## Cenários

| Área | Cobertura implementada |
| --- | --- |
| Login | Autenticação de administrador, senha incorreta, e-mail inválido e campos obrigatórios |
| Leads | Cadastro na fila de espera, duplicidade de e-mail e validações do formulário |
| Filmes | Cadastro, remoção, campos obrigatórios, duplicidade e busca por termo |

`leadsPO.spec.js` utiliza as actions compartilhadas. `leads.spec.js` mantém a implementação inicial dos exercícios, com um cenário de cadastro marcado como `test.skip`.

## Estrutura

```text
.
├── .github/workflows/playwright.yml
├── tests/
│   ├── e2e/
│   │   ├── leads.spec.js
│   │   ├── leadsPO.spec.js
│   │   ├── login.spec.js
│   │   └── movies.spec.js
│   └── support/
│       ├── actions/
│       │   ├── Components.js
│       │   ├── Leads.js
│       │   ├── Login.js
│       │   └── Movies.js
│       ├── API/index.js
│       ├── fixtures/
│       │   ├── movies.json
│       │   └── movies-cover/
│       ├── database.js
│       └── index.js
├── package.json
├── package-lock.json
└── playwright.config.js
```

## Pré-requisitos

- Node.js 24 e npm compatível com as dependências do projeto.
- Aplicação WEB disponível em `http://localhost:3000`.
- API disponível em `http://localhost:3333`.
- PostgreSQL configurado com as migrations e os seeds da aplicação.
- Docker Desktop ou Docker Engine em execução, caso utilize o banco em container.

API e WEB não fazem parte deste repositório de testes. No workspace do curso, estão em `../../apps/zombieplus-package/`, a partir da raiz deste projeto.

**Use um banco exclusivo para testes.** As suítes executam comandos como `DELETE FROM movies` e `DELETE FROM leads` para preparar os cenários.

## Instalação

Execute na raiz do repositório:

```bash
npm ci
npx playwright install --with-deps chromium
```

Os comandos deste README usam npm. O workflow existente ainda utiliza Yarn.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do repositório:

```dotenv
BASE_URL=http://localhost:3000
BASE_API=http://localhost:3333
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=zombieplus
DB_USER=zombieplus
DB_PASSWORD=zombieplus
```

Esses valores correspondem ao ambiente Docker local configurado para os estudos. O arquivo `.env` está ignorado pelo Git.

O helper de banco e o helper de API carregam dotenv. Na configuração do Playwright, a chamada explícita a `dotenv.config()` está comentada; as variáveis também podem ser fornecidas pelo terminal ou pelo ambiente de CI. Para garantir que estejam disponíveis desde o início, os comandos abaixo carregam o `.env` pelo próprio Node.

O arquivo `.env` da API é separado: nele, a senha do banco é chamada `DB_PASS`; neste repositório de testes, o helper utiliza `DB_PASSWORD`.

Alguns exercícios ainda usam URLs locais diretamente no código. Alterar apenas `BASE_URL` e `BASE_API` não redireciona todos os testes para outro ambiente.

## Preparar a aplicação local

Na organização atual do workspace, abra um terminal a partir da raiz deste repositório:

```bash
cd ../../apps/zombieplus-package/api
npm ci
docker compose up -d --wait
```

Para configurar as tabelas e os dados iniciais do curso, execute nessa pasta:

```bash
bash db.sh
```

**O `db.sh` desfaz todas as migrations, apaga as tabelas e recria os dados iniciais.** Execute apenas no banco de estudos, quando precisar prepará-lo ou reinicializá-lo.

Depois, inicie a API:

```bash
npm run dev
```

Em outro terminal, também a partir da raiz do repositório dos testes:

```bash
cd ../../apps/zombieplus-package/web
npm ci
npm run dev
```

Mantenha API e WEB em execução. O `webServer` do Playwright está comentado, portanto os testes não iniciam esses serviços automaticamente.

O login utilizado nos testes é `admin@zombieplus.com`, com senha `pwd123` e nome exibido `Admin`, conforme os dados esperados do ambiente do curso.

## Executar os testes

Execute os comandos na raiz do repositório, para que os caminhos das capas sejam resolvidos corretamente.

```bash
# Suíte completa, carregando o .env antes do Playwright
node --env-file=.env ./node_modules/@playwright/test/cli.js test

# Com navegador visível
node --env-file=.env ./node_modules/@playwright/test/cli.js test --headed

# Modo interativo
node --env-file=.env ./node_modules/@playwright/test/cli.js test --ui

# Apenas os testes de login
node --env-file=.env ./node_modules/@playwright/test/cli.js test tests/e2e/login.spec.js

# Um cenário pelo nome
node --env-file=.env ./node_modules/@playwright/test/cli.js test --grep "Deve logar como administrador"

# Execução com apenas um worker
node --env-file=.env ./node_modules/@playwright/test/cli.js test --workers=1

# Trace mesmo sem retries
node --env-file=.env ./node_modules/@playwright/test/cli.js test tests/e2e/login.spec.js --trace on

# Listar testes e conferir o carregamento sem executá-los
node --env-file=.env ./node_modules/@playwright/test/cli.js test --list
```

Se as variáveis já estiverem disponíveis no processo, também é possível utilizar os comandos curtos, como `npx playwright test`.

### Configuração de execução atual

- Navegador: Chromium, com o perfil `Desktop Chrome`.
- `fullyParallel: false`: testes do mesmo arquivo não são distribuídos em paralelo; arquivos diferentes ainda podem executar simultaneamente.
- Workers: dois no CI; seleção automática localmente.
- Retries: dois no CI e nenhum localmente.
- `test.only` é proibido no CI.
- Screenshot em falhas, trace na primeira repetição e vídeo desativado.

Para investigar conflitos de dados, utilize `--workers=1`. A limpeza das tabelas exige cuidado ao executar suítes simultâneas contra o mesmo banco.

## Relatórios e evidências

| Saída | Local |
| --- | --- |
| Resultado no terminal | Reporter `list` |
| Relatório JSON | `test-results.json` |
| Relatório HTML | `playwright-report/` |
| Screenshots, traces e contexto de falha, quando gerados | `test-results/` |

Para abrir o relatório HTML da última execução:

```bash
npx playwright show-report
```

Como o trace está configurado para a primeira repetição, uma execução local sem retries não o gera automaticamente. Utilize `--trace on` quando precisar dessa evidência.

## Fixtures, actions e dados

Importe o `test` personalizado para acessar as actions e o helper de API:

```js
import { test, expect } from '../support';

test('Deve logar como administrador', async ({ page }) => {
  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
});
```

O suporte adiciona `page.login`, `page.leads`, `page.movies` e `page.popup` à página original. A fixture `request` recebe `request.api` e autentica na API antes de ser entregue ao teste.

`movies.json` organiza os filmes por chaves em snake_case:

```js
const movies = require('../support/fixtures/movies.json');
const movie = movies.invasao_zumbi;

console.log(movie.title);
console.log(movie.cover);
```

Cada filme possui `title`, `overview`, `release_year`, `company`, `featured` e `cover`. O campo `cover` é relativo à pasta `tests/support/fixtures`, por exemplo `movies-cover/invasao-zumbi-2016.jpg`. As empresas foram adaptadas às opções disponíveis no formulário para uso como massa de teste.

## GitHub Actions

O workflow em `.github/workflows/playwright.yml` executa em pushes e pull requests para `main` e `master`. Atualmente, ele instala dependências e navegadores, executa a suíte e publica o relatório HTML com retenção de 30 dias.

**A preparação do ambiente ainda precisa ser implementada no workflow.** Ele não inicia PostgreSQL, API ou WEB, não executa migrations/seeds e não define as variáveis necessárias. No runner, `localhost` aponta para a máquina do GitHub, não para o computador de desenvolvimento.

Para executar a suíte no CI, é necessário disponibilizar API e WEB, preparar um banco de testes e aguardar os serviços antes de iniciar o Playwright.

## Solução de problemas

| Sintoma | O que verificar |
| --- | --- |
| Falha ao abrir a página ou conectar à API | Serviços ativos, portas e variáveis `BASE_URL` e `BASE_API` |
| Falha na autenticação da fixture `request` | API disponível e usuário administrador criado pelos seeds |
| Erro de conexão com PostgreSQL | Container ativo e valores `DB_*` do `.env` |
| Registro já existente | Dados persistidos de execuções anteriores e qual arquivo de teste falhou |
| `Test ended` durante uma ação | Operações assíncronas chamadas sem `await`, inclusive dentro das actions |
| `Cannot find module` | Caminho, capitalização do nome e arquivos salvos; valide com `test --list` |
| Mensagem antiga no VS Code | Salve os arquivos, atualize os testes e reinicie o modo UI; se necessário, use `Developer: Reload Window` |

## Referências

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Fixtures do Playwright](https://playwright.dev/docs/test-fixtures)
- [Faker](https://fakerjs.dev/)
- [node-postgres](https://node-postgres.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Playwright Zombie Course](https://www.udemy.com/share/10aNhQ3@YP1KskJLx4aYlYGskD8XwLyd62jMq4QhF9HgGdxqV5TraOplQeRkDNzAlOyzHnhY/)
