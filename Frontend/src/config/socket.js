import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    // Check if the socket instance already exists
    if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem("SOENtoken")
            },
            query: {
                projectId
            }
        });
    }

    return socketInstance; // Return the existing socket instance
}

export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error("Socket not initialized. Call initializeSocket first.");
    }
}

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.error("Socket not initialized. Call initializeSocket first.");
    }
}