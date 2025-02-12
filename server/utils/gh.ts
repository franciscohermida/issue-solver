import { Octokit } from "octokit";

let gh: Octokit | null = null;
export function useGh() {
  if (gh == null) {
    const config = useRuntimeConfig();
    gh = new Octokit({
      auth: config.githubToken,
    });
  }

  return gh;
}
