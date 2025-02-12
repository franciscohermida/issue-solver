import { getRepo } from "~~/server/utils/getRepo";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const repo = body.repo;
  console.log(repo);
  return await getRepo(repo);
});
