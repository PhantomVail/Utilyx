<div align="center">

<img src="code128.png" alt="Utilyx Logo" width="100" height="100" style="border-radius: 16px;" />

# Utilyx

**A privacy-first, local-only developer toolkit — dozens of utilities, zero data leaves your browser.**

[![License: MIT](https://img.shields.io/badge/License-Apache_2.0-black.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square\&logo=react\&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://utilyx.netlify.app) · [Report a Bug](https://github.com/phantomvail/utilyx/issues/new) · [Request a Tool](https://github.com/phantomvail/utilyx/issues/new)

</div>

---

# Overview

**Utilyx** is a browser-based developer toolbox that bundles a large collection of everyday utilities into a single fast web application.

Everything runs **entirely in your browser** — no servers, no tracking, and no data leaving your machine.

The goal is to provide a **single modern developer toolkit** that replaces dozens of individual web tools.

> A fast, privacy-focused Swiss Army knife for developers, engineers, and designers.

---

# Features

* **Dozens of built-in tools** across multiple categories
* **100% client-side** — no backend required
* **Privacy-first** — no telemetry or analytics
* **Fast SPA** powered by Vite + React
* **Dark-mode interface**
* **Modern component system using shadcn/ui**
* **Mobile responsive**
* **Local state persistence for many tools**
* **Keyboard-friendly navigation**

---

# Tool Categories

<details>
<summary><strong>📦 Data</strong></summary>

| Tool                      | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Fake Data Generator**   | Generate realistic mock data using Faker.js       |
| **Data Masker**           | Mask sensitive data inside JSON or text           |
| **CSV ↔ JSON Converter**  | Convert between CSV and JSON formats              |
| **.env Editor**           | Parse and edit environment variable files         |
| **Lorem Ipsum Generator** | Generate placeholder text                         |
| **Password Generator**    | Create secure passwords with configurable options |
| **Emoji Picker**          | Browse and copy emojis                            |

</details>

<details>
<summary><strong>🔄 Transform</strong></summary>

| Tool                         | Description                               |
| ---------------------------- | ----------------------------------------- |
| **JSON Formatter**           | Validate, format, and minify JSON         |
| **Base64 Encoder / Decoder** | Encode or decode Base64 data              |
| **Hash Generator**           | Generate cryptographic hashes             |
| **Key Generator**            | Generate random API keys and tokens       |
| **URL Parser**               | Break down URLs into components           |
| **JWT Decoder**              | Decode JWT header and payload             |
| **Case Converter**           | Convert between multiple text cases       |
| **Slugify**                  | Convert strings to URL-safe slugs         |
| **HTML Entities Tool**       | Encode and decode HTML entities           |
| **String Escape Tool**       | Escape/unescape for JS, SQL, HTML         |
| **Number Formatter**         | Format numbers with locale options        |
| **Unit Converter**           | Convert between common measurement units  |
| **Base Converter**           | Convert between binary, decimal, hex, etc |
| **SQL Formatter**            | Format SQL queries                        |
| **CSS Unit Converter**       | Convert px, rem, em, vw, vh               |

</details>

<details>
<summary><strong>🔍 Inspect</strong></summary>

| Tool                        | Description                         |
| --------------------------- | ----------------------------------- |
| **Regex Tester**            | Test regular expressions live       |
| **UUID Generator**          | Generate UUID values                |
| **Text Diff**               | Compare two blocks of text          |
| **Color Converter**         | Convert between color formats       |
| **Timestamp Converter**     | Convert Unix timestamps             |
| **Cron Parser**             | Describe cron expressions           |
| **Text Statistics**         | Word count and frequency analysis   |
| **Markdown Preview**        | Render Markdown live                |
| **IP Subnet Calculator**    | Calculate network ranges            |
| **Contrast Checker**        | WCAG color contrast checker         |
| **HTTP Status Explorer**    | Browse HTTP status codes            |
| **Aspect Ratio Calculator** | Calculate locked ratios             |
| **Regex Library**           | Collection of useful regex patterns |

</details>

<details>
<summary><strong>🔐 Cryptography</strong></summary>

| Tool                       | Description                               |
| -------------------------- | ----------------------------------------- |
| **AES Encryption**         | Encrypt and decrypt data using Web Crypto |
| **Classical Cipher Tools** | Caesar, Atbash, Vigenère, Rail Fence      |
| **XOR Cipher**             | Simple XOR encryption                     |
| **Morse Encoder**          | Encode and decode Morse code              |
| **Frequency Analysis**     | Character frequency analysis              |
| **Alphabet Mapper**        | Custom substitution cipher builder        |
| **Playfair Cipher**        | Classical digraph cipher                  |
| **Advanced Cipher Tools**  | Additional experimental cipher utilities  |
| **Text Encoder**           | Encode text into binary, hex, octal       |

</details>

<details>
<summary><strong>🎨 Create</strong></summary>

| Tool                        | Description                       |
| --------------------------- | --------------------------------- |
| **PNG Generator**           | Create simple images using canvas |
| **Font Preview**            | Preview fonts with custom text    |
| **QR Code Generator**       | Generate QR codes                 |
| **Gradient Builder**        | Build CSS gradients visually      |
| **SVG Icon Editor**         | Compose simple SVG icons          |
| **JSON → TypeScript**       | Generate TypeScript interfaces    |
| **Chmod Calculator**        | Unix permission calculator        |
| **Box Shadow Generator**    | Visual CSS box shadow builder     |
| **Color Palette Generator** | Generate color palettes           |

</details>

---

# Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Framework  |[React 18](https://reactjs.org/) |
| Language   |[TypeScript](https://www.typescriptlang.org/)|
| Build Tool |  [Vite](https://vitejs.dev/)                           |
| Styling    | [Tailwind CSS 3](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/)|
| Icons      | [Lucide](https://lucide.dev/)                       |
| Forms      | React Hook Form                 |
| Validation | Zod                             |
| Utilities  | [Faker.js](https://fakerjs.dev), [Marked](https://github.com/markedjs/marked), [SQL Formatter](https://www.npmjs.com/package/sql-formatter) |
| Crypto     | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)                |

---

# Getting Started

## Prerequisites

* Node.js **18+**
* npm, pnpm, bun, or yarn

---

## Installation

```bash
git clone https://github.com/phantomvail/utilyx.git
cd utilyx
npm install
```

or

```bash
pnpm install
```

---

## Development

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Build

```bash
npm run build
npm run preview
```

The build output is generated in:

```
dist/
```

---

# Project Structure

```
utilyx
│
├── public
│   ├── regex-worker.js
│   ├── placeholder.svg
│   └── code128.png
│
├── src
│   ├── components
│   │   ├── ui/            # shadcn UI components
│   │   ├── tools/         # individual tool components
│   │   └── layout/
│   │
│   ├── hooks
│   │   ├── useDebounce.ts
│   │   ├── usePersistedState.ts
│   │   └── use-mobile.tsx
│   │
│   ├── lib
│   │   ├── utils.ts
│   │   ├── colorUtils.ts
│   │   └── fakeData.ts
│   │
│   ├── pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

### Adding a Tool

1. Create a new component for the tool
2. Place it in the appropriate tools directory
3. Register it in the tool registry
4. Ensure all processing is **client-side only**

Pull requests for:

* new tools
* performance improvements
* accessibility improvements
* UI improvements

are welcome.

---

# Roadmap

* Command palette tool search
* Favorite tools
* Recently used tools
* PWA offline support
* Plugin system for custom tools
* Additional developer utilities

---

# License

Distributed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ☕ and TypeScript
**No data leaves your browser.**

</div>

---

## Important Notice

The project currently runs using the modern React + Vite stack.

There are **experimental plans** to explore a simpler architecture in the future using plain **HTML, CSS, and JavaScript** for easier maintenance and long-term control.

This change is **not currently implemented**.
