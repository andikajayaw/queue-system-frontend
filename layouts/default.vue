<script setup lang="ts">
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
</script>
<template>
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <DashboardHeader />

      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
