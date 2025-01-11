import http from 'http';
import app from './app.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import redisClient from './services/redis.service.js';
import { verifyToken } from './utils/jwt.js';
import mongoose from 'mongoose';
import { generateResult } from './services/ai.service.js';

dotenv.config();


const server = http.createServer(app);


const io = new Server(server,{
    cors:{
        origin:"*"
    }
});





io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;
        

        if (!token) {
            return next(new Error("Access Denied. No token provided."));
        }

        // Check if projectId is valid
        const projectExists = await mongoose.model('Project').findById(projectId);
        if (!projectExists) {
            return next(new Error("Invalid projectId."));
        }
        socket.project = projectExists;

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return next(new Error("Invalid or expired token."));
        }

        const decoded = await verifyToken(token);
        delete decoded.password;
        socket.user = decoded;

        next();
    } catch (error) {
        console.error(error);
        next(new Error("Invalid or expired token."));
    }
})

io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    console.log("Socket connected")

    socket.join(socket.roomId);

    socket.on("project-message",async data =>{

        const message =  data.message;

        const aiPresentInMessage = message.includes('@ai');
        
        if(aiPresentInMessage){
            const prompt = message.replace('@ai','');
            const result = await  generateResult(message);
            io.to(socket.roomId).emit('project-message',{
                message:result,
                sender:{
                    id:'ai',
                    email:`@AI-${data.sender.email}`
                }
            })
            return;
        }

        socket.broadcast.to(socket.roomId).emit("project-message",data);
    })

    socket.on('disconnect', () => { 
        socket.leave(socket.roomId)
     });
});


server.listen(process.env.PORT || 3000 ,()=>{
    console.log("Server is tuning on the port 3000")
})