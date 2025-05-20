<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

const { state } = useColorMode();

const loadingColor = computed(() =>
  state.value === "light" ? "#6B7280" : "#D1D5DB"
);
</script>

<template>
  <ClientOnly>
    <NuxtLoadingIndicator :color="loadingColor" />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
