import { generateText, streamText } from "ai";
import { getGithubIssues } from "../../utils/getGithubIssues";
import { useAi } from "~~/server/utils/ai";
import { getRepo } from "~~/server/utils/getRepo";
import { repos } from "~~/shared/repos";

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

    await useStorage().setItem(
      `issue-solution:${repo}:${issueNumber}`,
      "in progress refresh after a few moments"
    );

    const ai = useAi();

    const result = await streamText({
      model: ai("gemini-2.0-flash"),
      prompt: [
        `I'm trying to solve this GitHub issue:\n\n`,
        `<issue>\n`,
        `Title: ${issueTitle}\n\n`,
        `Description:\n${issueBody}\n\n`,
        `</issue>\n`,
        `\n`,
        `Here is the whole repo as context so you can help me solve this issue:\n`,
        `<repo>\n`,
        `${repoText}\n`,
        `</repo>`,
      ].join(""),
      async onFinish(e) {
        console.log('finished')
        await useStorage().setItem(
          `issue-solution:${repo}:${issueNumber}`,
          e.text
        );
      },
    });

    return result.toTextStreamResponse();
  },
);
