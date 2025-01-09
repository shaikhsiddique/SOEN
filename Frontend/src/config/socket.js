import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = ()=>{
   
    socketInstance = socket(import.meta.env.VITE_API_URL,{
        auth:{
            token:localStorage.getItem("SOENtoken")
        }
    });

    return socketInstance
}

export const receiveMessage = (eventname,cb)=>{
    socketInstance.emit(eventname,data);
}

export const sendMessage = (eventname,cb)=>{
    socketInstance.emit(eventname,data);
}