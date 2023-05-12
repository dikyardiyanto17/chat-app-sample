import { io } from 'socket.io-client';

const URL = 'http://localhost:2222';

export const socket = io(URL);