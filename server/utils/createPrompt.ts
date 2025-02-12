export function createPrompt(
  issueTitle: string,
  issueBody: string,
  repoText: string
) {
  return [
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
  ].join("");
}
