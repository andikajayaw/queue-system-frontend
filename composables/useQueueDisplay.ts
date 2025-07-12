import { Socket } from "socket.io-client";

interface QueueItem {
  id: string;
  queueNumber: string;
  type: "RESERVATION" | "WALK_IN";
  status: "WAITING" | "CALLED" | "SERVING" | "COMPLETED";
  customerName: string;
  calledAt?: Date;
  completedAt?: Date;
  serviceDuration?: number;
  staff?: {
    id: string;
    name: string;
    username: string;
  };
}

interface QueueStatistics {
  totalToday: number;
  waitingCount: number;
  calledCount: number;
  servingCount: number;
  completedCount: number;
  reservationCount: number;
  walkInCount: number;
}

interface WebSocketEvents {
  currentCalled: QueueItem[];
  statistics: QueueStatistics;
  recentCompleted: QueueItem[];
  nextWaiting: QueueItem[];
  queueCalled: {
    queue: QueueItem;
    currentCalled: QueueItem[];
    statistics: QueueStatistics;
    nextWaiting: QueueItem[];
  };
  queueCompleted: {
    queue: QueueItem;
    currentCalled: QueueItem[];
    statistics: QueueStatistics;
    recentCompleted: QueueItem[];
    nextWaiting: QueueItem[];
  };
  queueServing: {
    queue: QueueItem;
    currentCalled: QueueItem[];
    statistics: QueueStatistics;
  };
  newQueue: {
    queue: QueueItem;
    statistics: QueueStatistics;
    nextWaiting: QueueItem[];
  };
  queueCancelled: {
    queue: QueueItem;
    currentCalled: QueueItem[];
    statistics: QueueStatistics;
    nextWaiting: QueueItem[];
  };
  dataRefresh: {
    currentCalled: QueueItem[];
    statistics: QueueStatistics;
    recentCompleted: QueueItem[];
    nextWaiting: QueueItem[];
  };
}

export const useQueueDisplay = () => {
  const { $socket } = useNuxtApp();
  const socket = $socket as Socket;

  // Reactive state
  const currentCalled = ref<QueueItem[]>([]);
  const statistics = ref<QueueStatistics>({
    totalToday: 0,
    waitingCount: 0,
    calledCount: 0,
    servingCount: 0,
    completedCount: 0,
    reservationCount: 0,
    walkInCount: 0,
  });
  const recentCompleted = ref<QueueItem[]>([]);
  const nextWaiting = ref<QueueItem[]>([]);
  const isConnected = ref(false);

  // Setup WebSocket listeners
  const setupListeners = () => {
    // Connection status
    socket.on("connect", () => {
      isConnected.value = true;
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
    });

    // Initial data events
    socket.on("currentCalled", (data: QueueItem[]) => {
      currentCalled.value = data;
    });

    socket.on("statistics", (data: QueueStatistics) => {
      statistics.value = data;
    });

    socket.on("recentCompleted", (data: QueueItem[]) => {
      recentCompleted.value = data;
    });

    socket.on("nextWaiting", (data: QueueItem[]) => {
      nextWaiting.value = data;
    });

    // Real-time update events
    socket.on("queueCalled", (data: WebSocketEvents["queueCalled"]) => {
      currentCalled.value = data.currentCalled;
      statistics.value = data.statistics;
      nextWaiting.value = data.nextWaiting;

      // Optional: Show notification
      showNotification(
        "Queue Called",
        `${data.queue.queueNumber} - ${data.queue.customerName}`
      );
    });

    socket.on("queueCompleted", (data: WebSocketEvents["queueCompleted"]) => {
      currentCalled.value = data.currentCalled;
      statistics.value = data.statistics;
      recentCompleted.value = data.recentCompleted;
      nextWaiting.value = data.nextWaiting;
    });

    socket.on("queueServing", (data: WebSocketEvents["queueServing"]) => {
      currentCalled.value = data.currentCalled;
      statistics.value = data.statistics;
    });

    socket.on("newQueue", (data: WebSocketEvents["newQueue"]) => {
      statistics.value = data.statistics;
      nextWaiting.value = data.nextWaiting;
    });

    socket.on("queueCancelled", (data: WebSocketEvents["queueCancelled"]) => {
      currentCalled.value = data.currentCalled;
      statistics.value = data.statistics;
      nextWaiting.value = data.nextWaiting;
    });

    socket.on("dataRefresh", (data: WebSocketEvents["dataRefresh"]) => {
      currentCalled.value = data.currentCalled;
      statistics.value = data.statistics;
      recentCompleted.value = data.recentCompleted;
      nextWaiting.value = data.nextWaiting;
    });
  };

  // Cleanup function
  const cleanup = () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("currentCalled");
    socket.off("statistics");
    socket.off("recentCompleted");
    socket.off("nextWaiting");
    socket.off("queueCalled");
    socket.off("queueCompleted");
    socket.off("queueServing");
    socket.off("newQueue");
    socket.off("queueCancelled");
    socket.off("dataRefresh");
  };

  // Notification helper
  const showNotification = (title: string, message: string) => {
    // Implement your notification system here
    console.log(`${title}: ${message}`);
  };

  // Manual refresh function
  const refreshData = async () => {
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiUrl;

      const [
        currentCalledRes,
        statisticsRes,
        recentCompletedRes,
        nextWaitingRes,
      ] = await Promise.all([
        $fetch(`${baseUrl}/display/current-called`),
        $fetch(`${baseUrl}/display/statistics`),
        $fetch(`${baseUrl}/display/recent-completed?limit=10`),
        $fetch(`${baseUrl}/display/next-waiting?limit=5`),
      ]);

      currentCalled.value = currentCalledRes as QueueItem[];
      statistics.value = statisticsRes as QueueStatistics;
      recentCompleted.value = recentCompletedRes as QueueItem[];
      nextWaiting.value = nextWaitingRes as QueueItem[];
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  return {
    // State
    currentCalled: readonly(currentCalled),
    statistics: readonly(statistics),
    recentCompleted: readonly(recentCompleted),
    nextWaiting: readonly(nextWaiting),
    isConnected: readonly(isConnected),

    // Methods
    setupListeners,
    cleanup,
    refreshData,
  };
};
