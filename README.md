# Issue Solver

Issue Solver is a proof-of-concept that uses AI to generate starting points for addressing GitHub issues. Instead of each developer duplicating efforts to develop their own AI workflows, this project provides a central place to define configurations that results in AI-generated initial issue references for your repository.

> **Important:**  
> The generated AI start points are **not** intended to be copied and pasted as final contributions. They serve only as initial references to reduce friction and stimulate ideas. Using them as-is can burden maintainers with low-quality pull requests.

---

## How It Works

- **Repository Context Extraction:**  
  The tool scrapes the entire repository (code, docs, etc.) and inlines this data into an AI prompt alongside the issue description.
- **AI Engine:**  
  Uses Gemini Flash 2.0 for its cost-effectiveness, free tier, and a context window of 1 million tokens (2 million tokens in the pro version).
- **Caching:**  
  Ideally AI solutions for each issue are cached until a new workflow version or project release prompts an update. Projects can configure caching strategies based on their needs and budget.
- **Deploy for free:**  
  This project uses nuxthub which deploys to cloudflare for free. Make it available to your team and collaborate on solving issues at scale.

---

## Use Case Example: Tresjs

Tresjs is a Vue project wrapping Three.js. Currently, Issue Solver only loads the project's own repository context. Referencing R3F for additional inspiration is planned for a future update.

---

## TODO

- Write a real prompt.
- Integrate external references (e.g., R3F) as additional context for inspiration.
- Add support for loading private repositories for local use with personal Gemini Flash 2.0 credits.

---

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/franciscohermida/issue-solver.git
   cd issue-solver
   ```
2. **Install Dependencies:**  
   pnpm i.
3. **Configure:**  
   Customize the prompt workflows for your repository.
4. **Run the Tool:**
   ```bash
   pnpm dev
   ```

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with improvements or bug fixes.

---

## License

This project is licensed under the MIT License.