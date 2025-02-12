export const getRepo = defineCachedFunction(
  async (repo: string) => {
    const data = await $fetch(`https://uithub.com/${repo}?ext=js,jsx,ts,tsx`);

    return data;
  },
  {
    maxAge: 60 * 60,
    getKey: (repo: string) => repo,
  }
);
