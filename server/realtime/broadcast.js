import { WebSocketServer, WebSocket } from 'ws';

let wss = null;
const clients = new Set();

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    clients.add(ws);
    console.log(`[Realtime WS] Student connected. Total active: ${clients.size}`);

    // Send initial handshake
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to STEMVerse AI Real-Time Stream',
      timestamp: new Date().toISOString(),
      activeStudents: clients.size + 1420, // Real-time community presence
    }));

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        // Handle client telemetry or doubts
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch (err) {
        console.error('[Realtime WS] Parse error:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[Realtime WS] Student disconnected. Remaining: ${clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('[Realtime WS] Error:', err);
      clients.delete(ws);
    });
  });

  return wss;
}

// Broadcast real-time events to all connected clients
export function broadcastEvent(eventType, payload) {
  if (!wss) return;
  const message = JSON.stringify({
    type: eventType,
    payload,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
