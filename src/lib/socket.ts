'use client';
import { io, Socket } from 'socket.io-client';

// Prevent SSR
const isBrowser = typeof window !== 'undefined';

export const socket: Socket = isBrowser
  ? io(window.location.origin, { path: '/socket' })
  : (null as any);