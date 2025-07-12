<script setup lang="ts">
import sidebar_groups from "~/constants/sidebar_links";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const open = ref(false);
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex w-full items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-2 data-[orientation=vertical]:h-4"
      />
      <div class="w-full flex items-center gap-4 justify-between">
        <!-- <SearchCommand :open :page-links="sidebar_groups" /> -->
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <!-- <UserNav /> -->
        </div>
      </div>
    </div>
  </header>
</template>
