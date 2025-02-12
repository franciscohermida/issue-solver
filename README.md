# Issue Solver

Issue Solver is a proof-of-concept that proactively uses AI to generate starting-point solutions for solving GitHub issues. Instead of each developer individually crafting prompts for every issue, this project provides a central place where maintainers can collaborate to refine the best prompts and context, ensuring AI generates the most useful head start for each issue in a repository.

Live Demo: https://issue-solver.nuxt.dev/

> **Important:**  
> The generated AI start points are **not** intended to be copied and pasted as final contributions. They serve only as initial references to reduce friction and stimulate ideas. Using them as-is can burden maintainers with low-quality pull requests.

---

## How It Works

- **Repository Context Extraction:**  
  The tool scrapes the entire repository (code, docs, etc.) and inlines this data into an AI prompt alongside the issue description.
- **AI Engine:**  
  Uses Gemini Flash 2.0 for its cost-effectiveness, free tier, and a context window of 1 million tokens (2 million tokens in the pro version).
- **Caching:**  
  Ideally AI solutions for each issue are cached until there is a new prompt version or a new project release. Projects can configure caching strategies based on their needs and budget.
- **Deploy for free:**  
  This project uses nuxthub which deploys to cloudflare for free. Close this for your repo and make it available to your team so they can collaborate on solving issues at scale.
- **Copy and paste the prompt:**  
  You can copy the prompt used to generate the AI start points (which includes the entire repository) if you want to tweak it using AI chat interfaces like Claude, ChatGPT, etc. Ideally, any prompt improvements you find could be contributed back to this centralized effort to refine the results.

---

## Use Case Example: Tresjs

Tresjs is a Vue project that wraps Three.js, drawing inspiration from R3F, with many features ported over. We can configure the prompt to load the R3F source code as a reference, potentially providing valuable insights for AI-generated starting points—helping anyone looking to contribute to the project.

This use case addresses complexities that not all potential contributors might consider when prompting AI themselves. It can be developed to be as complex and comprehensive as needed for each repository needs.

*Referencing an external project (R3F) is still a work in progress.*

---

## TODO

- [ ] Improve the prompt.
- [ ] Add this repository and its issues.
- [ ] Integrate external references (e.g., R3F) for additional context in the Tresjs use case.
- [ ] Support loading private repositories locally using a developer's free quota with Gemini Flash 2.0.
- [ ] Add more repositories.

---

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/franciscohermida/issue-solver.git
   cd issue-solver
   ```
2. **Install Dependencies:**  
   ```bash
   pnpm install
   ```
3. **Configure:**  
   Customize the prompt for your repository.
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
