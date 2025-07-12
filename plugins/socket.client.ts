// plugins/socket.client.ts
import { io, Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Initialize sockets untuk kedua namespace
  const callSocket = io(
    `${config.public.wsUrl}${config.public.callNamespace}`,
    {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  );

  const displaySocket = io(
    `${config.public.wsUrl}${config.public.displayNamespace}`,
    {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  );

  // Call Socket Events
  callSocket.on("connect", () => {
    console.log("✅ Call WebSocket connected");
  });

  callSocket.on("disconnect", () => {
    console.log("❌ Call WebSocket disconnected");
  });

  callSocket.on("connect_error", (error) => {
    console.error("❌ Call WebSocket connection error:", error);
  });

  // Display Socket Events
  displaySocket.on("connect", () => {
    console.log("✅ Display WebSocket connected");
  });

  displaySocket.on("disconnect", () => {
    console.log("❌ Display WebSocket disconnected");
  });

  displaySocket.on("connect_error", (error) => {
    console.error("❌ Display WebSocket connection error:", error);
  });

  // Cleanup saat aplikasi di-unmount
  const cleanup = () => {
    callSocket.disconnect();
    displaySocket.disconnect();
  };

  // Handle page refresh/close
  if (import.meta.client) {
    window.addEventListener("beforeunload", cleanup);
  }

  return {
    provide: {
      callSocket,
      displaySocket,
      cleanup,
    },
  };
});
