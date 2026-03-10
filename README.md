<div align="center">

<img src="code128.png" alt="Utilyx Logo" width="100" height="100" style="border-radius: 16px;" />

# Utilyx

**A privacy-first, local-only developer toolkit — 51 tools, zero data leaves your browser.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://utilyx.netlify.app) · [Report a Bug](https://github.com/phantomvail/utilyx/issues/new) · [Request a Tool](https://github.com/phantomvail/utilyx/issues/new) · [Documentation](#documentation)

</div>

---

## Overview

**Utilyx** is a single-page developer toolkit built entirely in the browser. It bundles 51 everyday utilities — formatters, encoders, generators, ciphers, and creators — into a clean, dark-themed interface with a fixed categorised sidebar. No server, no analytics, no data leaves your machine.

> Built for developers who want a fast, offline-capable Swiss Army knife without shipping sensitive data to a third-party service.

---

## Features

- **51 tools** across 5 categories — Data, Transform, Inspect, Encrypt, Create
- **100% client-side** — all processing happens in your browser
- **Privacy-first** — no telemetry, no network requests, no backend
- **Dark-themed UI** with glass-morphism header and semantic HSL color tokens
- **Keyboard-friendly** navigation and accessible component design
- **Mobile-responsive** with collapsible sidebar toggle
- **Zero configuration** — clone, install, and run

---

## Tool Categories

<details>
<summary><strong>📦 Data</strong> — 7 tools</summary>
<br>

| Tool | Description |
|---|---|
| **Fake Data Generator** | Generate realistic fake data using Faker.js (names, emails, addresses, and more) |
| **Data Masker** | Mask or redact sensitive fields in JSON or plain text |
| **CSV ↔ JSON** | Bidirectional conversion between CSV and JSON formats |
| **.env Editor** | Parse, edit, and export `.env` files safely in-browser |
| **Lorem Ipsum** | Configurable placeholder text generator |
| **Password Generator** | Cryptographically random passwords with strength meter |
| **Emoji Picker** | Browse, search, and copy emojis with Unicode info |

</details>

<details>
<summary><strong>🔄 Transform</strong> — 14 tools</summary>
<br>

| Tool | Description |
|---|---|
| **JSON Formatter** | Pretty-print, minify, and validate JSON |
| **Base64 Encode/Decode** | Encode or decode Base64 strings and files |
| **Hash Generator** | Generate SHA-1, SHA-256, and SHA-512 hashes |
| **Key Generator** | Create API keys, secrets, and tokens in multiple formats |
| **URL Parser** | Break down URLs into components (protocol, host, query, fragment) |
| **JWT Decoder** | Decode and inspect JSON Web Token headers and payloads |
| **Case Converter** | camelCase, PascalCase, snake_case, kebab-case, and more |
| **Slugify** | Convert strings to URL-safe slugs |
| **HTML Entities** | Encode and decode HTML entities |
| **String Escape** | Escape/unescape strings for JS, SQL, HTML, and regex |
| **Number Formatter** | Format numbers with locale, currency, and precision options |
| **Unit Converter** | Length, weight, temperature, area, volume, and more |
| **Base Converter** | Convert between binary, octal, decimal, and hex |
| **SQL Formatter** | Pretty-print and lint SQL queries |
| **CSS Unit Converter** | px ↔ rem ↔ em ↔ vh/vw conversions |

</details>

<details>
<summary><strong>🔍 Inspect</strong> — 13 tools</summary>
<br>

| Tool | Description |
|---|---|
| **Regex Tester** | Live regex matching with group capture highlighting |
| **UUID Generator** | Generate v1, v4, and v5 UUIDs in bulk |
| **Text Diff** | Side-by-side or inline diff between two text blocks |
| **Color Converter** | Convert between HEX, RGB, HSL, HSV, and CMYK |
| **Timestamp Converter** | Unix timestamps ↔ human-readable dates in any timezone |
| **Cron Parser** | Parse and describe cron expressions in plain English |
| **Text Stats** | Word count, character count, reading time, and frequency |
| **Markdown Preview** | Live GitHub-flavoured Markdown renderer |
| **IP Subnet Calculator** | CIDR notation, subnet masks, and host ranges |
| **Contrast Checker** | WCAG AA/AAA contrast ratio checker for color pairs |
| **HTTP Status Codes** | Reference for all HTTP status codes with descriptions |
| **Aspect Ratio Calculator** | Calculate and lock aspect ratios for any dimensions |
| **Regex Library** | Curated library of common regular expressions |

</details>

<details>
<summary><strong>🔐 Encrypt</strong> — 10 tools</summary>
<br>

| Tool | Description |
|---|---|
| **Caesar Cipher** | Classic shift cipher with configurable rotation |
| **Vigenère Cipher** | Polyalphabetic substitution encryption |
| **Atbash Cipher** | Reverse-alphabet substitution |
| **Rail Fence Cipher** | Zigzag transposition cipher |
| **XOR Cipher** | Bitwise XOR encryption with custom key |
| **Morse Code** | Text ↔ Morse code encoder/decoder |
| **AES-256-GCM** | Modern symmetric encryption using the Web Crypto API |
| **Frequency Analysis** | Analyse character/word frequency for cipher breaking |
| **Alphabet Map** | Custom substitution cipher builder |
| **Playfair Cipher** | Digraph substitution cipher |
| **Text Encoder** | Encode text to binary, hexadecimal, octal, or Base32 |
| **Advanced Ciphers** | Beaufort, Bifid, and Columnar Transposition ciphers |

</details>

<details>
<summary><strong>🎨 Create</strong> — 9 tools</summary>
<br>

| Tool | Description |
|---|---|
| **PNG Maker** | Canvas-based image creator with text, shapes, and export |
| **Font Preview** | Preview system and Google Fonts with custom text |
| **QR Code Generator** | Generate and download QR codes from any input |
| **CSS Gradient Builder** | Visual linear/radial/conic gradient builder with CSS output |
| **SVG Icon Composer** | Compose and export simple SVG icons |
| **JSON → TypeScript** | Auto-generate TypeScript interfaces from JSON |
| **Chmod Calculator** | Unix permission calculator with symbolic and octal modes |
| **Box Shadow Generator** | Visual CSS box-shadow builder with live preview |
| **Color Palette Generator** | Generate harmonious color palettes (complementary, triadic, etc.) |

</details>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://reactjs.org/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fake Data | [Faker.js](https://fakerjs.dev/) |
| Encryption | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (native) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (recommended) or npm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/phantomvail/utilyx.git
cd utilyx

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

The production build outputs to `dist/` and can be served from any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

---

## Project Structure (needs updating)

```
utilyx/
├── public/
│   └── code.png              # App icon
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx   # Fixed left navigation (240px)
│   │   │   └── Header.tsx    # Sticky tool header with glass-morphism
│   │   └── tools/            # One file per tool
│   │       ├── data/
│   │       ├── transform/
│   │       ├── inspect/
│   │       ├── encrypt/
│   │       └── create/
│   ├── lib/
│   │   ├── tools.ts          # Tool registry and metadata
│   │   └── utils.ts          # Shared helpers
│   ├── styles/
│   │   └── globals.css       # HSL CSS variables and Tailwind base
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Design System

Utilyx uses a semantic token system via CSS custom properties in HSL, enabling consistent theming across all components.

```css
/* Example tokens from globals.css */
--background:     224 15% 8%;
--foreground:     210 20% 96%;
--card:           224 15% 11%;
--border:         215 15% 18%;
--primary:        210 100% 60%;
--muted:          215 15% 25%;
--accent:         262 80% 65%;
```

The header uses a `backdrop-filter: blur` glass-morphism treatment layered over the dark background. Sidebar tool groups are collapsible and persist state in `localStorage`.

---

## Contributing

Contributions are welcome — whether it's a new tool, a bug fix, or a UX improvement.

### Adding a New Tool

1. Create a component in `src/components/tools/<category>/YourTool.tsx`
2. Register it in `src/lib/tools.ts` with an icon, label, description, and category
3. Ensure all processing is **client-side only** — no external API calls
4. Follow the existing prop pattern (`ToolWrapper`, sticky header, etc.)
5. Submit a pull request with a short description

### Development Guidelines

- All logic must run in the browser — no server-side calls
- Follow the existing file and naming conventions
- Use Tailwind utility classes; avoid inline styles
- Components should be accessible (keyboard navigable, ARIA labels where needed)
- Write clean TypeScript — avoid `any`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## Roadmap

- [ ] Tool search / fuzzy finder (`Cmd+K`)
- [ ] Favourites and recently used tools
- [ ] Import/export tool state as JSON
- [ ] PWA support for true offline use
- [ ] Light mode theme
- [ ] Plugin API for community-contributed tools
- [ ] i18n / localisation support

---

## License

Distributed under the **Apache**. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the excellent accessible component primitives
- [Faker.js](https://fakerjs.dev/) for realistic test data generation
- [Lucide](https://lucide.dev/) for the clean, consistent icon set
- The open-source community for making tools like this possible

---

<div align="center">

Made with ☕ and TypeScript &nbsp;·&nbsp; No data leaves your browser, ever.

</div>

-- 

## Important Notice 

#### Currently the project is written in bun.js due to its complexity. Future plans involve rewriting the whole codebase in plain HTML, CSS and JS for simplicity and control. 
