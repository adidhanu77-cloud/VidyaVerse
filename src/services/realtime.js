class RealtimeClient {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.connected = false;
    this.reconnectInterval = 4000;
  }

  connect() {
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connected = true;
        console.log('[Realtime Client] Connected to VidyaVerse WebSocket server.');
        this.emit('STATUS_CHANGE', { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data.payload || data);
        } catch (err) {
          console.error('[Realtime Client] JSON error:', err);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.emit('STATUS_CHANGE', { connected: false });
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (err) => {
        this.connected = false;
      };
    } catch (err) {
      console.warn('[Realtime Client] Could not connect to ws server:', err);
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(callback);
    }
  }

  emit(eventType, payload) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error('[Realtime Listener error]:', e);
        }
      });
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
}

export const realtime = new RealtimeClient();
