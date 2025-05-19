<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

useColorMode();
</script>
<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
