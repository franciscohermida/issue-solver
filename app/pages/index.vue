<template>
  <div class="max-w-3xl mx-auto p-8">
    <h1>Issue Solver</h1>
    <div class="mt-8 space-y-4">
      <div 
        v-for="repo in repos" 
        :key="repo.name" 
        class="p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5"
      >
        <NuxtLink 
          :to="`/repos/${encodeURIComponent(repo.name)}`"
          class="block text-inherit no-underline"
        >
          {{ repo.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { repos } from '~~/shared/repos';
</script>
