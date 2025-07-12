// composables/useCallSocket.ts
export const useCallSocket = () => {
  const { $callSocket } = useNuxtApp();

  // Room management
  const joinRoom = (room: string) => {
    $callSocket.emit("join-room", { room });
  };

  const leaveRoom = (room: string) => {
    $callSocket.emit("leave-room", { room });
  };

  // Event listeners sesuai dengan backend
  const onQueueCalled = (callback: (data: any) => void) => {
    // $callSocket.on("queue-called", callback);
    $callSocket.on("queue-called", (payload) => {
      console.log("🎧 [useCallSocket] queue-recalled:", payload);
      const text = payload?.data?.ttsText || payload?.data?.text;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
      }
      callback?.(payload);
    });
  };

  const onQueueUpdated = (callback: (data: any) => void) => {
    $callSocket.on("queue-updated", callback);
  };

  const onQueueRecalled = (callback: (data: any) => void) => {
    // $callSocket.on("queue-recalled", callback);
    $callSocket.on("queue-recalled", (payload) => {
      console.log("🎧 [useCallSocket] queue-recalled:", payload);
      const text = payload?.data?.ttsText || payload?.data?.text;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
      }
      callback?.(payload);
    });
  };

  const onJoinedRoom = (callback: (data: any) => void) => {
    $callSocket.on("joined-room", callback);
  };

  const onLeftRoom = (callback: (data: any) => void) => {
    $callSocket.on("left-room", callback);
  };

  // Ping test
  const ping = () => {
    $callSocket.emit("ping");
  };

  const onPong = (callback: (data: any) => void) => {
    $callSocket.on("pong", callback);
  };

  // Cleanup functions
  const offQueueCalled = () => {
    $callSocket.off("queue-called");
  };

  const offQueueUpdated = () => {
    $callSocket.off("queue-updated");
  };

  const offQueueRecalled = () => {
    $callSocket.off("queue-recalled");
  };

  const offJoinedRoom = () => {
    $callSocket.off("joined-room");
  };

  const offLeftRoom = () => {
    $callSocket.off("left-room");
  };

  const offPong = () => {
    $callSocket.off("pong");
  };

  return {
    socket: $callSocket,
    joinRoom,
    leaveRoom,
    onQueueCalled,
    onQueueUpdated,
    onQueueRecalled,
    onJoinedRoom,
    onLeftRoom,
    ping,
    onPong,
    offQueueCalled,
    offQueueUpdated,
    offQueueRecalled,
    offJoinedRoom,
    offLeftRoom,
    offPong,
  };
};

// composables/useDisplaySocket.ts
// export const useDisplaySocket = () => {
//   const { $displaySocket } = useNuxtApp();

//   // Event listeners sesuai dengan backend display gateway
//   const onCurrentCalled = (callback: (data: any) => void) => {
//     $displaySocket.on("currentCalled", callback);
//   };

//   const onStatistics = (callback: (data: any) => void) => {
//     $displaySocket.on("statistics", callback);
//   };

//   const onRecentCompleted = (callback: (data: any) => void) => {
//     $displaySocket.on("recentCompleted", callback);
//   };

//   const onNextWaiting = (callback: (data: any) => void) => {
//     $displaySocket.on("nextWaiting", callback);
//   };

//   const onQueueCalled = (callback: (data: any) => void) => {
//     $displaySocket.on("queueCalled", callback);
//   };

//   const onQueueCompleted = (callback: (data: any) => void) => {
//     $displaySocket.on("queueCompleted", callback);
//   };

//   const onQueueServing = (callback: (data: any) => void) => {
//     $displaySocket.on("queueServing", callback);
//   };

//   const onNewQueue = (callback: (data: any) => void) => {
//     $displaySocket.on("newQueue", callback);
//   };

//   const onQueueCancelled = (callback: (data: any) => void) => {
//     $displaySocket.on("queueCancelled", callback);
//   };

//   const onDataRefresh = (callback: (data: any) => void) => {
//     $displaySocket.on("dataRefresh", callback);
//   };

//   // Cleanup functions
//   const offCurrentCalled = () => {
//     $displaySocket.off("currentCalled");
//   };

//   const offStatistics = () => {
//     $displaySocket.off("statistics");
//   };

//   const offRecentCompleted = () => {
//     $displaySocket.off("recentCompleted");
//   };

//   const offNextWaiting = () => {
//     $displaySocket.off("nextWaiting");
//   };

//   const offQueueCalled = () => {
//     $displaySocket.off("queueCalled");
//   };

//   const offQueueCompleted = () => {
//     $displaySocket.off("queueCompleted");
//   };

//   const offQueueServing = () => {
//     $displaySocket.off("queueServing");
//   };

//   const offNewQueue = () => {
//     $displaySocket.off("newQueue");
//   };

//   const offQueueCancelled = () => {
//     $displaySocket.off("queueCancelled");
//   };

//   const offDataRefresh = () => {
//     $displaySocket.off("dataRefresh");
//   };

//   return {
//     socket: $displaySocket,
//     onCurrentCalled,
//     onStatistics,
//     onRecentCompleted,
//     onNextWaiting,
//     onQueueCalled,
//     onQueueCompleted,
//     onQueueServing,
//     onNewQueue,
//     onQueueCancelled,
//     onDataRefresh,
//     offCurrentCalled,
//     offStatistics,
//     offRecentCompleted,
//     offNextWaiting,
//     offQueueCalled,
//     offQueueCompleted,
//     offQueueServing,
//     offNewQueue,
//     offQueueCancelled,
//     offDataRefresh,
//   };
// };
