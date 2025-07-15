import { createServer } from 'node:http';
import next from 'next';
import { Server as IOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new IOServer(httpServer, {
    path: '/socket',
    cors: { origin: '*' },
  });
  // Expose io on globalThis for access in API routes
  globalThis.io = io;

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Server ready at http://${hostname}:${port}`);
  });
});