import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // À restreindre en production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WS] 🔌 Nouveau client connecté : ${socket.id}`);
    
    socket.on('join_planning', (planningId: string) => {
      socket.join(`planning_${planningId}`);
      console.log(`[WS] 🏠 Client ${socket.id} a rejoint le salon planning_${planningId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[WS] ❌ Client déconnecté : ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io n'a pas été initialisé !");
  }
  return io;
};

export const emitToPlanning = (planningId: string, event: string, data: any) => {
  if (io) {
    io.to(`planning_${planningId}`).emit(event, data);
  }
};
