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

## Publicação de código (GitHub + GitLab)

O código é publicado em **dois destinos**:

- **GitHub:** `SemdecTechTI/treinarparaempregar-frontend`
- **GitLab SEMIT (interno):** `repositoriosemit.salvador.ba.gov.br/cleiton.teixeira/treinarparaempregar-frontend`

O remote `origin` está configurado como **multi-push** (duas `pushurl`), então **um único push envia para os dois de uma vez**:

```bash
git push origin main        # → GitHub + GitLab, simultaneamente
```

O `fetch` vem só do GitHub. Existe também um remote `gitlab` separado, caso precise mirar apenas o GitLab (`git push gitlab main`).

> ⚠️ **VPN obrigatória.** O GitLab da SEMIT só é acessível pela **VPN da SEMIT**. Sem VPN, o push para o GitLab trava/falha — e, como está no `origin`, derruba o push inteiro. **Valide a VPN antes de dar push:**
>
> ```bash
> curl -s -o /dev/null -w "%{http_code}\n" --max-time 12 https://repositoriosemit.salvador.ba.gov.br
> # 302 = VPN ativa · timeout/falha = VPN desconectada
> ```

## Licença

Projeto interno SEMDEC / Prefeitura de Salvador.
