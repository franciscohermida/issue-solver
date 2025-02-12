import { generateText, streamText } from "ai";
import { getGithubIssues } from "../../utils/getGithubIssues";
import { useAi } from "~~/server/utils/ai";
import { getRepo } from "~~/server/utils/getRepo";
import { repos } from "~~/shared/repos";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { repo, issueNumber } = body;

  // check if this has been stored in cache
  const cachedResult = await useStorage().getItem(
    `issue-solution:${repo}:${issueNumber}`
  );

  return cachedResult;
});
