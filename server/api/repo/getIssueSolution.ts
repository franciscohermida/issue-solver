import { getIssueSolutionKey } from "~~/server/utils/getIssueSolutionKey";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { repo, issueNumber } = body;

  // check if this has been stored in cache
  const kv = hubKV();
  const cachedResult = kv.getItem(getIssueSolutionKey(repo, issueNumber));

  return cachedResult;
});
