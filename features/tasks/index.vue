<script setup lang="ts">
import { columns } from "./components/columns";
import tasks from "./data/tasks.json";

import DataTableRowActions from "./components/DataTableRowActions.vue";
</script>

<template>
  <DashboardContent>
    <template #header>
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p class="text-muted-foreground">
          Here's a list of your tasks for this month!
        </p>
      </div>
    </template>

    <DataTable :data="tasks" :columns="columns">
      <template #toolbar="{ table }">
        <DataTableToolbar :table="table" />
      </template>

      <template #id-data="{ row }">
        <span>{{ row.id }}</span>
      </template>

      <template #title-data="{ row }">
        <div class="flex items-center space-x-2">
          <Badge variant="outline"> {{ row.label }} </Badge>
          <span>{{ row.title }}</span>
        </div>
      </template>

      <template #actions-data="{ row }">
        <DataTableRowActions :row="row" />
      </template>
    </DataTable>
  </DashboardContent>
</template>
