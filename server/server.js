import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initWebSocketServer } from './realtime/broadcast.js';

// Import separate feature backends
import scannerRoutes from './routes/scanner.js';
import labsRoutes from './routes/labs.js';
import treasureHuntRoutes from './routes/treasureHunt.js';
import storiesRoutes from './routes/stories.js';
import tutorRoutes from './routes/tutor.js';
import careersRoutes from './routes/careers.js';
import analyticsRoutes from './routes/analytics.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Mount separate feature backends
app.use('/api/scanner', scannerRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/treasure-hunt', treasureHuntRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/analytics', analyticsRoutes);

// Mount separate user backend / personal dashboard architecture
app.use('/api/user', userRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'VidyaVerse Real-Time Backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    featureBackends: [
      '/api/scanner (Object Scanner & Real-Life STEM)',
      '/api/labs (Virtual Physics, Chem, Bio Labs)',
      '/api/treasure-hunt (Gamified Real-World Missions)',
      '/api/stories (STEM Stories & Conceptual Tales)',
      '/api/tutor (Dr. APJ Mentor Vernacular AI)',
      '/api/careers (STEM Career Roadmaps)',
      '/api/analytics (School Leaderboards & Gaps)',
      '/api/user (Personal Dashboards: Student/Teacher/Parent)',
    ],
    realtime: 'WebSocket active on ws://localhost:' + PORT,
  });
});

// Create HTTP + WebSocket Server
const server = http.createServer(app);
initWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 VidyaVerse Real-Time Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
