<template>
  <div class="max-w-3xl mx-auto p-8 prose">
    <div class="flex justify-between items-center mb-4">
      <NuxtLink
        :to="`/repos/${encodeURIComponent($route.params.repo)}`"
        class="inline-block"
      >
        Back
      </NuxtLink>

      <a
        @click="copyPrompt"
        class="text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        Copy Prompt
      </a>
    </div>

    <template v-if="issue">
      <h2 class="text-xl font-semibold mb-4">Issue</h2>
      <div class="border border-gray-200 p-4 mb-4 rounded-lg">
        <h1 class="text-2xl font-bold">{{ issue?.title }}</h1>

        <div class="text-gray-600 text-sm my-4 pb-4 border-b border-gray-200">
          <p>#{{ issue?.number }} opened by {{ issue?.user?.login }}</p>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">Issue Description</h2>
          <div
            class="prose prose-sm max-w-none prose-pre:my-4 prose-pre:p-4 prose-pre:bg-gray-50 prose-pre:rounded-lg prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-gray-100 prose-code:rounded-md prose-code:text-sm prose-a:text-blue-600 hover:prose-a:underline prose-blockquote:pl-4 prose-blockquote:text-gray-500 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-table:border-collapse prose-td:border prose-td:border-gray-200 prose-td:p-2 prose-tr:even:bg-gray-50 prose-headings:mt-6 prose-headings:mb-4 prose-headings:font-semibold prose-headings:leading-tight prose-p:leading-relaxed prose-p:mb-4 prose-ul:pl-8 prose-ol:pl-8 prose-li:mb-2 prose-hr:my-8 prose-hr:border-gray-200"
            v-html="renderedIssueBody"
          ></div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">AI Solution</h2>
        <div
          class="prose prose-sm max-w-none prose-pre:my-4 prose-pre:p-4 prose-pre:bg-gray-50 prose-pre:rounded-lg prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-gray-100 prose-code:rounded-md prose-code:text-sm prose-a:text-blue-600 hover:prose-a:underline prose-blockquote:pl-4 prose-blockquote:text-gray-500 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-table:border-collapse prose-td:border prose-td:border-gray-200 prose-td:p-2 prose-tr:even:bg-gray-50 prose-headings:mt-6 prose-headings:mb-4 prose-headings:font-semibold prose-headings:leading-tight prose-p:leading-relaxed prose-p:mb-4 prose-ul:pl-8 prose-ol:pl-8 prose-li:mb-2 prose-hr:my-8 prose-hr:border-gray-200"
          v-html="renderedSolution"
        ></div>
        <div v-if="isLoadingSolution" class="text-xl animate-pulse">▊</div>
        <div v-if="solutionError" class="text-red-500 mt-4">
          Error generating solution: {{ solutionError }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-8 text-gray-600">
        <h2 class="text-xl">Loading issue details...</h2>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import markdownit from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { createPrompt } from "~~/server/utils/createPrompt";

const route = useRoute();
const md = markdownit({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

const { data: issues, status: issuesStatus } = useAsyncData("issues", () => {
  console.log("{ repo: route.params.repo }", { repo: route.params.repo });
  return $fetch("/api/repo/getIssues", {
    method: "POST",
    body: { repo: route.params.repo },
  });
});

const issue = computed(() => {
  if (!issues.value) return null;
  return issues.value.find((i) => i.number.toString() === route.params.id);
});

const renderedIssueBody = computed(() => {
  if (!issue.value?.body) return "";
  return md.render(issue.value.body);
});

const isLoadingSolution = ref(false);
const solutionError = ref<string | null>(null);
const solution = ref("");

const renderedSolution = computed(() => {
  if (!solution.value) return "";
  return md.render(solution.value);
});

async function loadSolution() {
  if (!issue.value) return;

  const response = await $fetch("/api/repo/getIssueSolution", {
    method: "POST",
    body: {
      repo: route.params.repo,
      issueNumber: route.params.id,
    },
  });

  if (response != null) {
    solution.value = response;
  } else {
    await loadStreamedSolution();
  }
}

async function copyPrompt() {
  const repo = await $fetch("/api/repo/getRepo", {
    method: "POST",
    body: { repo: route.params.repo },
  });

  const prompt = createPrompt(issue.value.title, issue.value.body, repo);
  console.log("prompt", prompt);
  navigator.clipboard.writeText(prompt);
}

async function loadStreamedSolution() {
  if (!issue.value) return;

  isLoadingSolution.value = true;
  try {
    const stream = await $fetch("/api/repo/getIssueSolutionStreamed", {
      method: "POST",
      body: {
        repo: route.params.repo,
        issueNumber: route.params.id,
      },
      responseType: "stream",
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decoded = decoder.decode(value);
      solution.value += decoded;
    }
  } catch (err) {
    solutionError.value =
      err instanceof Error ? err.message : "Unknown error occurred";
  } finally {
    isLoadingSolution.value = false;
  }
}

watch(
  issue,
  (newIssue) => {
    if (newIssue) {
      loadSolution();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.centered {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.issue-meta {
  color: #666;
  font-size: 0.9rem;
  margin: 1rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.issue-content,
.solution-section {
  margin-top: 2rem;
}

.solution-content,
:deep(.issue-content) {
  /* General text styling */
  line-height: 1.6;
  color: #24292e;

  /* Headers */
  :deep(h1, h2, h3, h4, h5, h6) {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  /* Paragraphs and lists */
  :deep(p, ul, ol) {
    margin-bottom: 16px;
  }

  :deep(ul, ol) {
    padding-left: 2em;
  }

  /* Links */
  :deep(a) {
    color: #0366d6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  /* Code blocks */
  :deep(pre) {
    margin: 16px 0;
    padding: 0;
    background-color: #f6f8fa;
    border-radius: 6px;

    code.hljs {
      display: block;
      padding: 16px;
      overflow-x: auto;
      color: #24292e;
      background-color: #f6f8fa;
    }
  }

  :deep(code) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 6px;
    color: #24292e; /* Darker text color for better contrast */
  }

  /* Blockquotes */
  :deep(blockquote) {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 16px 0;
  }

  /* Tables */
  :deep(table) {
    border-spacing: 0;
    border-collapse: collapse;
    margin: 16px 0;
    width: 100%;
  }

  :deep(table th, table td) {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }

  :deep(table tr:nth-child(2n)) {
    background-color: #f6f8fa;
  }
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
