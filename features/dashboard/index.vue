<script setup lang="ts">
// Reactive data
const currentServing: any = ref(null);
const dashboardStats: any = ref([]);

onMounted(() => {
  // Fetch initial data
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  try {
    // const config = useRuntimeConfig();

    // Fetch current serving, next queue, and stats
    const [serving, stats] = await Promise.all([
      useCommon('/call/current'),
      useCommon('/queue/dashboard-stats'),
      // useCommon('/display/next-waiting?limit=3'),
    ]);
    console.log(serving, stats)
    currentServing.value = serving.data.value.data;
    dashboardStats.value = stats.data.value.data;
    // nextQueue.value = next;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
</script>

<template>
  <DashboardContent>
    <template #header>
      <h2 class="text-2xl font-bold tracking-tight">Dashboard (Hari ini)</h2>
    </template>
    <Tabs default-value="overview" class="space-y-4">
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> Jumlah Aktif Antrian (Menunggu) </CardTitle>
              <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" class="h-4 w-4 text-muted-foreground">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg> -->
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ dashboardStats.activeQueues }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> Jumlah staff yang tersedia/aktif </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ dashboardStats.activeStaff }}</div>
            </CardContent>
          </Card>
        </div>
        <div class="text-2xl font-bold">Top 3 Staff (Hari ini)</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="topStaff in dashboardStats.topStaff">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">{{ topStaff.name }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ topStaff.totalServed }}</div>
              <p>Total served</p>
            </CardContent>
          </Card>
        </div>
        <div class="text-2xl font-bold">Statistik Pelayanan (Hari ini)</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="statsStaff in dashboardStats.staffServiceStats">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">{{ statsStaff.staff.name }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid gap-2">
                <div class="text-2xl font-bold">{{ statsStaff.averageServiceTime }}</div>
                <p>Waktu pelayanan (average)</p>
                <div class="text-2xl font-bold">{{ statsStaff.totalServed }}</div>
                <p>Total served</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </DashboardContent>
</template>
