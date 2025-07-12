import { defineStore } from "pinia";

export const useDisplayStore = defineStore("display", {
  state: () => ({
    currentCalled: [],
    statistics: null,
    recentCompleted: [],
    nextWaiting: [],
    queueUpdates: [],
    recalls: [],
    dashboardStats: [],
  }),

  actions: {
    setInitialData({
      currentCalled,
      statistics,
      recentCompleted,
      nextWaiting,
      dashboardStats,
    }) {
      this.currentCalled = currentCalled;
      this.statistics = statistics;
      this.recentCompleted = recentCompleted;
      this.nextWaiting = nextWaiting;
      this.dashboardStats = dashboardStats;
    },

    updateQueue(data: any) {
      this.queueUpdates.push(data);
    },

    handleRecall(data: any) {
      this.recalls.push(data);
    },
  },
});
