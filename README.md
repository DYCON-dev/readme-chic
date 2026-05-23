<div align="center">

<img src="front-readme-chic/public/readmechic.png" width="120" alt="ReadmeChic logo">

# ReadmeChic

**An elegant, customizable README generator. Compose banners, badges, and content blocks visually — paste the result into any `README.md`.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-readmechic.dycon.dev-brightgreen)](https://readmechic.dycon.dev)
[![Stack](https://img.shields.io/badge/stack-Vue%203%20%2B%20Cloudflare%20Workers-blue)](#how-it-works)

[Open the app](https://readmechic.dycon.dev) · [How it works](#how-it-works) · [Self-host](#self-host) · [🇫🇷 Français](#-français)

</div>

---

## 🇬🇧 English

GitHub READMEs are flat markdown. ReadmeChic gives you a visual editor to design banners, badges, and content blocks, then renders them as **SVG images served from a Cloudflare Worker**. You copy a single markdown line into your README and the result looks designed instead of dumped.

### How it works

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  Vue 3 / Vite / DaisyUI UI   │         │  Cloudflare Worker           │
│  (you compose your block)    │ ──URL──▶│  ?template=fancy&w=…&h=…&…   │
│  readmechic.dycon.dev        │         │  readme-chic.<sub>.workers.dev│
└──────────────────────────────┘         └──────────────────────────────┘
                                                       │ SVG
                                                       ▼
                            ┌──────────────────────────────────────┐
                            │ Your GitHub README.md                │
                            │ ![banner](https://…/?template=fancy…)│
                            └──────────────────────────────────────┘
```

Four templates are currently shipped, all in `worker/templates/`:

| Template | Use case |
|---|---|
| `fancy`  | Hero banner with title + subtitle + background image |
| `block`  | Content card with title + body |
| `double` | Two side-by-side blocks |
| `badge`  | Small status badge (label + value + icon) |

The UI in `front-readme-chic/` is a 4-route Vue app (`/`, `/badge`, `/block`, `/intro`) that builds the right URL for each template and shows a live preview.

### Repository layout

```
readme-chic/
├── worker/                Cloudflare Worker (SVG renderer)
│   ├── index.js           Router: ?template=<key> → renderer
│   └── templates/         fancy.js, badge.js, block.js, double.js
│
├── front-readme-chic/     Vue 3 + Vite + Tailwind v4 + DaisyUI
│   ├── src/
│   │   ├── App.vue        Drawer + navbar
│   │   ├── router/        4 routes
│   │   └── view/          banner / block / badge / info-generale
│   └── public/icon/logo/  Simple Icons collection (badge icons)
│
├── color/theme.js         Shared color palette
├── package.json           Root scripts (deploy-worker)
└── wrangler.toml.example  Copy → wrangler.toml, edit, deploy
```

### Self-host

You need: Node.js 18+, a Cloudflare account (free tier is fine), and `npx wrangler login` once.

```bash
# 1. Clone and install
git clone https://github.com/DYCON-dev/readme-chic.git
cd readme-chic

# 2. Deploy the Worker
cp wrangler.toml.example wrangler.toml
# edit wrangler.toml — at least set the `name` to a worker name available on your account
npm install
npx wrangler deploy
# Worker now lives at https://<name>.<your-subdomain>.workers.dev/

# 3. Run the Vue UI locally
cd front-readme-chic
npm install
npm run dev
# open http://localhost:5173

# 4. (Optional) Build static UI for hosting
npm run build
# dist/ can go on Cloudflare Pages / Netlify / Vercel / any static host
```

Before deploying, update the worker base URL inside the Vue source files
(`front-readme-chic/src/view/*.vue`) to your own worker subdomain.

### Roadmap

- 🔜 More templates (logo grid, code preview, GitHub stats card)
- 🔜 Theme switcher in the UI (palette is already centralized in [`color/theme.js`](color/theme.js))
- 🔜 Per-template option panel auto-generated from schema instead of hard-coded forms

### License

[MIT](LICENSE) — use freely, commercial or not.

### Acknowledgements

- [Simple Icons](https://simpleicons.org) — the SVG logo collection used in the badge picker (CC0)
- [Cloudflare Workers](https://workers.cloudflare.com) — the serverless platform that runs the SVG renderer
- [Vue 3](https://vuejs.org), [Vite](https://vitejs.dev), [Tailwind CSS v4](https://tailwindcss.com), [DaisyUI](https://daisyui.com)

---

## 🇫🇷 Français

Les README GitHub sont du markdown plat. ReadmeChic ajoute un éditeur visuel pour dessiner des bannières, badges et blocs de contenu, puis les rend en **images SVG servies par un Cloudflare Worker**. Tu copies une ligne markdown dans ton README et le résultat est *designé* au lieu d'être brut.

### Comment ça marche

L'app Vue à `readmechic.dycon.dev` te laisse composer ton bloc visuellement. Elle construit une URL vers le Worker Cloudflare (`?template=fancy&w=…&h=…&title=…`) que tu colles dans ton `README.md`. GitHub charge le SVG dynamique, ton README a l'air designé.

Quatre templates pour l'instant :

| Template | Usage |
|---|---|
| `fancy`  | Bannière hero (titre + sous-titre + fond) |
| `block`  | Carte contenu (titre + corps) |
| `double` | Deux blocs côte-à-côte |
| `badge`  | Petit badge (label + valeur + icône) |

### Auto-hébergement

Voir la section anglaise plus haut — installation Worker + frontend Vue en 4 étapes (`wrangler deploy` + `npm run dev`).

### Licence

[MIT](LICENSE) — usage libre, commercial ou non.
