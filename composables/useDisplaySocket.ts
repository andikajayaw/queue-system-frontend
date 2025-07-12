export const useDisplaySocket = () => {
  const store = useDisplayStore();
  const { $displaySocket } = useNuxtApp();

  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  }

  onMounted(() => {
    $displaySocket.emit("join-room", { room: "display" }); // 🔥 WAJIB kalau server pakai room
    console.log("[useDisplaySocket] Joined display room");

    $displaySocket.on("currentCalled", (data) => {
      store.currentCalled = data;
    });

    $displaySocket.on("statistics", (data) => {
      store.statistics = data;
    });

    $displaySocket.on("recentCompleted", (data) => {
      store.recentCompleted = data;
    });

    $displaySocket.on("nextWaiting", (data) => {
      store.nextWaiting = data;
    });

    $displaySocket.on(
      "queueCalled",
      ({ queue, currentCalled, statistics, nextWaiting }) => {
        store.currentCalled = currentCalled;
        store.statistics = statistics;
        store.nextWaiting = nextWaiting;
      }
    );

    $displaySocket.on("queueCompleted", (payload) => {
      store.setInitialData(payload);
    });

    $displaySocket.on("queueServing", (payload) => {
      store.setInitialData(payload);
    });

    $displaySocket.on("queueCancelled", (payload) => {
      store.setInitialData(payload);
    });

    $displaySocket.on("dataRefresh", (payload) => {
      store.setInitialData(payload);
    });

    $displaySocket.on("newQueue", (data) => {
      store.setInitialData(data);
      console.log("🔥 newQueue received:", data);
    });

    console.log("[useDisplaySocket] Socket listeners registered");
  });

  onBeforeUnmount(() => {
    $displaySocket.off("currentCalled");
    $displaySocket.off("statistics");
    $displaySocket.off("recentCompleted");
    $displaySocket.off("nextWaiting");
    $displaySocket.off("queueCalled");
    $displaySocket.off("queueCompleted");
    $displaySocket.off("queueServing");
    $displaySocket.off("newQueue");
    $displaySocket.off("queueCancelled");
    $displaySocket.off("dataRefresh");
  });
};
