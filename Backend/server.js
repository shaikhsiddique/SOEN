import http from 'http';
import app from './app.js'
import dotenv from 'dotenv'
dotenv.config();


const server = http.createServer(app);


server.listen(process.env.PORT || 3000 ,()=>{
    console.log("Server is tuning on the port 3000")
})