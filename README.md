# Treinar para Empregar — Frontend

Frontend Nuxt 3 + Vue 3 + TypeScript + TailwindCSS para a plataforma municipal Treinar para Empregar.

Repositório backend: [treinarparaempregar-backend](https://github.com/SemdecTechTI/treinarparaempregar-backend)

## Requisitos

- Node.js **20+** (obrigatório para o Nuxt CLI atual)
- npm ou pnpm

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Site em `http://localhost:3000`.

## API

Por padrão o frontend aponta para:

`http://api.treinarparaempregar.test:8080/api`

Configure em `.env`:

```
NUXT_PUBLIC_API_BASE=http://api.treinarparaempregar.test:8080/api
```

Com Laradock, suba o backend antes (`laradock/docker compose up -d nginx mysql`) e adicione os hosts locais:

```
127.0.0.1 api.treinarparaempregar.test
127.0.0.1 treinarparaempregar.test
```

## Áreas do sistema

| Rota | Descrição |
|------|-----------|
| `/` | Home com filtros de cursos |
| `/cursos/*` | Detalhe, inscrição e vídeos (online) |
| `/cadastro`, `/login` | Autenticação |
| `/account` | Área do cidadão |
| `/admin/*` | Painel administrativo |

## Build

```bash
npm run build
npm run preview
```

## Licença

Projeto interno SEMDEC / Prefeitura de Salvador.
