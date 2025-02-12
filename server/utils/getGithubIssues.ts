import { useGh } from "./gh";

export const getGithubIssues = defineCachedFunction(
  async (repoFullName: string) => {
    const gh = useGh();

    const [owner, repo] = repoFullName.split("/");
    if (!owner || !repo) {
      throw new Error('Invalid repository format. Expected "owner/repo"');
    }

    const { data: issues } = await gh.rest.issues.listForRepo({
      owner,
      repo,
      state: "open",
      per_page: 100,
    });

    return issues;
  },
  {
    maxAge: 60 * 60 * 24, // 60s * 60 min * 24 hours = 1 day
    getKey: (repoFullName: string) => `github-issues:${repoFullName}`,
  }
);
