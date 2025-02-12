export function getIssueSolutionKey(repo: string, issueNumber: string) {
  return `issue-solution:${repo}:${issueNumber}`;
}
