<template>
  <div class="max-w-3xl mx-auto p-8 prose">
    <NuxtLink :to="'/'"> Back </NuxtLink>

    <h1>Issues for {{ $route.params.repo }}</h1>

    <div v-if="pending">Loading issues...</div>

    <div v-else-if="error">Error loading issues: {{ error }}</div>

    <div v-else class="mt-8 space-y-4">
      <div
        v-for="issue in issues"
        :key="issue.number"
        class="p-6 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5"
      >
        <NuxtLink
          :to="`/repos/${encodeURIComponent($route.params.repo)}/${
            issue.number
          }`"
          class="block text-inherit no-underline"
        >
          <h3 class="text-lg font-semibold">{{ issue.title }}</h3>
          <p class="text-sm text-gray-600 my-2">
            #{{ issue.number }} opened by {{ issue.user?.login }}
          </p>
          <p class="text-gray-700 text-[0.95rem]">
            {{ issue.body?.slice(0, 200) }}...
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const {
  data: issues,
  pending,
  error,
} = await useFetch("/api/repo/getIssues", {
  method: "POST",
  body: { repo: route.params.repo },
});
</script>
