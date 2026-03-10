\# CONTRIBUTING.md



First off, thank you for considering contributing to \*\*Utilyx\*\*! It’s people like you who make this toolkit better for the entire developer community.



By contributing, you are helping build a privacy-first, zero-telemetry future for developer utilities.



\## 📜 Our Philosophy

\* \*\*Local Only:\*\* No data should ever leave the browser. No external API calls, no tracking, no "phone home" scripts.

\* \*\*Speed:\*\* Tools should be instant. We use \*\*Bun\*\* and \*\*Vite\*\* to keep the development loop tight.

\* \*\*Cleanliness:\*\* No "feature creep." Each tool should do one thing perfectly.



---



\## 🛠️ Getting Started



\### 1. Setup the Dev Environment

Since Utilyx is currently built using \*\*Bun\*\*, ensure you have it installed (\[bun.sh](https://bun.sh)).



```bash

\# Clone the fork

git clone https://github.com/phantomvail/utilyx.git

cd utilyx



\# Install dependencies

bun install



\# Start the dev server

bun dev

```



\### 2. Project Architecture

Before adding code, familiarize yourself with where things live:

\* `src/components/tools/`: The logic and UI for every utility.

\* `src/lib/tools.ts`: The "Brain." You must register new tools here for them to appear in the sidebar and search.

\* `src/components/ui/`: Base components (Buttons, Inputs) from shadcn/ui.



---



\## 🚀 How to Add a New Tool



We love new tools! If you want to add the 52nd utility, follow these steps:



1\.  \*\*Create the Component:\*\* Create `src/components/tools/<category>/NewTool.tsx`. Use the existing tools as a template.

2\.  \*\*Stay Client-Side:\*\* Use the \*\*Web Crypto API\*\* for encryption or local libraries (like `faker-js`) for data. Never use `fetch()` to an external service.

3\.  \*\*Register the Tool:\*\* Open `src/lib/tools.ts` and add your tool to the `TOOLS` array:

&nbsp;   ```typescript

&nbsp;   {

&nbsp;     id: "your-tool-id",

&nbsp;     name: "Your Tool Name",

&nbsp;     description: "What does it do?",

&nbsp;     category: "transform", // data, transform, inspect, encrypt, create

&nbsp;     component: YourToolComponent,

&nbsp;     icon: LucideIconName,

&nbsp;   }

&nbsp;   ```

4\.  \*\*Test:\*\* Ensure it works on mobile and looks good in the dark-themed UI.



---



\## 🏗️ The "Plain Web" Initiative

\*\*Note:\*\* We are currently planning a transition from React/Bun to \*\*Vanilla HTML/CSS/JS\*\*. 

If you are interested in helping with this architectural shift:

\* Avoid adding heavy third-party NPM packages unless absolutely necessary.

\* Write logic in pure TypeScript/JavaScript functions that can be easily extracted from React hooks later.



---



\## 🤝 Pull Request Process



1\.  \*\*Branching:\*\* Create a feature branch (`feat/add-json-to-xml` or `fix/regex-bug`).

2\.  \*\*Linting:\*\* Ensure your code passes TypeScript strict checks.

3\.  \*\*Documentation:\*\* If the tool is complex, add a small info tooltip or "How to use" section within the component.

4\.  \*\*One Tool Per PR:\*\* Please don't bundle 5 new tools into one PR. It makes reviewing difficult!



---



\## ⚖️ License

By contributing to Utilyx, you agree that your contributions will be licensed under the project's \*\*Apache License\*\*.



---



\## Questions?

If you're unsure about a tool idea, \[open an issue](https://github.com/phantomvail/utilyx/issues) first to discuss it with the maintainers!

