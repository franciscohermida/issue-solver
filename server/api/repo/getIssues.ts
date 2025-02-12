import { repos } from "~~/shared/repos";
import { getGithubIssues } from "../../utils/getGithubIssues";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const repo = body.repo;

  const repoData = repos.find(i => i.name === repo);

  console.log('getIssues > repoData', repoData);

  const issues = await getGithubIssues(repoData?.path);

  return issues;
});
