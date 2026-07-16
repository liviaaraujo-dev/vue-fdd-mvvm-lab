# Vue FDD + MVVM Lab

Laboratório de estudo combinando **Vue 3 + Pinia + arquitetura FDD (Feature-Driven Development) + padrão MVVM + shadcn-vue + Phosphor Icons**. O objetivo não é o app em si (um gerenciador de tarefas), mas **avaliar se esse conjunto de decisões vale a pena** para projetos maiores.

## Stack

| Camada | Escolha |
|---|---|
| Framework | Vue 3.5 (`<script setup>`, `defineModel`) |
| Estado | Pinia (setup stores) |
| Rotas | Vue Router 4 (lazy por feature) |
| UI | shadcn-vue (Reka UI + CVA + tailwind-merge) |
| Estilo | Tailwind CSS v4 (`@theme`, tokens em oklch) |
| Ícones | @phosphor-icons/vue v2 |
| Build | Vite 7 + vue-tsc (strict) |

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + build de produção
npm run typecheck
```

## Docker

A aplicação é uma SPA estática. O `Dockerfile` usa build multi-stage: compila com Node e serve o resultado com Nginx (imagem final enxuta, sem `node_modules`). O Nginx já está configurado com fallback de SPA (`try_files … /index.html`) para o Vue Router funcionar em rotas diretas.

```bash
docker compose up --build   # http://localhost:8080
docker compose down         # para e remove o container
```

Ou usando apenas o Docker:

```bash
docker build -t vue-fdd-mvvm-lab .
docker run --rm -p 8080:80 vue-fdd-mvvm-lab
```

Arquivos: `Dockerfile` (build + serve), `nginx.conf` (config da SPA), `docker-compose.yml` (serviço `web` na porta `8080:80`) e `.dockerignore`.

## As duas arquiteturas, na prática

### FDD — organização por feature, não por tipo de arquivo

Em vez de pastas globais `components/`, `stores/`, `services/`, cada feature é uma fatia vertical autossuficiente:

```
src/
├─ features/
│  ├─ tasks/                 # tudo que é "tarefa" mora aqui
│  │  ├─ domain/             # MODEL: tipos + regras puras (sem Vue)
│  │  ├─ data/               # persistência (localStorage hoje, API amanhã)
│  │  ├─ stores/             # estado observável (Pinia)
│  │  ├─ viewmodels/         # ViewModel (MVVM)
│  │  ├─ components/         # componentes internos da feature
│  │  ├─ views/              # telas
│  │  └─ index.ts            # ★ API PÚBLICA — o único ponto de entrada
│  └─ dashboard/             # consome SÓ o index.ts de tasks
└─ shared/                   # o que é genuinamente transversal
   ├─ ui/                    # componentes shadcn-vue
   └─ lib/                   # utils (cn)
```

A regra de ouro: **outras features só importam do `index.ts`**. Veja `dashboard/viewmodels/useDashboardViewModel.ts` importando `@/features/tasks` (a API pública) e nunca `../tasks/stores/...`. Trocar a implementação interna de `tasks` não quebra o `dashboard`.

### MVVM — a View é "burra"

Fluxo dos dados numa direção clara:

```
domain (regras puras)
   ↓
data (repositório)
   ↓
store (estado Pinia)
   ↓
viewmodel (composable: estado da tela + dados derivados + comandos)
   ↓
view (.vue: só liga template ↔ viewmodel)
```

- **`domain/task.entity.ts`** — `createTask`, `toggleTask`, `sortTasks`: funções puras, 100% testáveis sem montar componente.
- **`stores/task.store.ts`** — dono do estado; fala com o repositório e aplica as regras.
- **`viewmodels/useTaskListViewModel.ts`** — guarda o que é só da tela (filtro, rascunho do formulário), expõe dados prontos (`visibleTasks`, `stats`) e comandos (`submitDraft`, `setFilter`).
- **`views/TasksView.vue`** — nenhuma lógica de negócio; só instancia o VM e renderiza.

## Vale a pena? (veredito do lab)

**Pontos fortes**
- **Escala bem em equipe/tamanho.** Fronteiras explícitas por feature (`index.ts`) reduzem acoplamento e facilitam dividir trabalho. O code-splitting sai de graça: o build gera chunks separados por feature (`DashboardView`, `task.store`).
- **Domínio testável.** Regras puras isoladas do Vue são triviais de testar e sobrevivem a troca de framework.
- **Data layer plugável.** Sair de localStorage para HTTP mexe só em `data/` — store/viewmodel/view não mudam.
- **shadcn-vue** dá controle total (o código dos componentes é seu, em `shared/ui/`), sem lock-in de biblioteca.

**Custos**
- **Boilerplate real.** Uma feature simples já pede 5–6 arquivos. Para um CRUD pequeno, é over-engineering.
- **MVVM sobre Composition API tem sobreposição.** O composable-viewmodel às vezes só repassa a store; a fronteira "store vs. viewmodel" precisa de disciplina para não virar cerimônia vazia.
- **Curva de entrada.** Quem chega precisa entender a convenção antes de produzir.

**Conclusão:** vale a pena para **apps médios/grandes, com vários domínios e mais de um dev**. Para protótipos e apps pequenos, o mesmo Vue + Pinia sem as camadas extras entrega mais rápido. O padrão paga o custo quando o projeto cresce — não antes.
