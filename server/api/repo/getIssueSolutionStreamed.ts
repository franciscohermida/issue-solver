import { streamText } from "ai";
import { getGithubIssues } from "../../utils/getGithubIssues";
import { useAi } from "~~/server/utils/ai";
import { getRepo } from "~~/server/utils/getRepo";
import { repos } from "~~/shared/repos";
import { getIssueSolutionKey } from "~~/server/utils/getIssueSolutionKey";

export default defineEventHandler(
  // export default defineEventHandler(
  async (event) => {
    const body = await readBody(event);

    const { repo, issueNumber } = body;

    const repoData = repos.find((i) => i.name === repo);
    if (!repoData) {
      throw new Error(`Repository ${repo} not found`);
    }

    console.log("repoData", repoData);

    const repoText = await getRepo(repoData.path);
    const issues = await getGithubIssues(repoData.path);

    if (!issues || issues.length === 0) {
      throw new Error("No open issues found for this repository");
    }

    const targetIssue = issues.find(
      (issue) => issue.number.toString() === issueNumber?.toString()
    );
    if (!targetIssue) {
      throw new Error(`Issue #${issueNumber} not found`);
    }

    const issueBody = targetIssue.body || "No description provided";
    const issueTitle = targetIssue.title || "Untitled Issue";

    const kv = hubKV();
    const existingSolution = await kv.getItem(
      getIssueSolutionKey(repo, issueNumber)
    );
    if (existingSolution != null) {
      throw createError({
        statusCode: 409,
        message: "Solution already exists",
      });
    }

    await kv.setItem(
      getIssueSolutionKey(repo, issueNumber),
      "in progress refresh after a few moments"
    );

    const ai = useAi();

    const result = await streamText({
      model: ai("gemini-2.0-flash"),
      prompt: createPrompt(issueTitle, issueBody, repoText),
      async onFinish(e) {
        await kv.setItem(getIssueSolutionKey(repo, issueNumber), e.text, {
          // ttl: 60 * 60 * 24 * 7,
        });
      },
    });

    return result.toTextStreamResponse();
  }
);
