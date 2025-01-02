import redisClient from '../services/redis.service.js';
import { verifyToken } from '../utils/jwt.js';


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ error: "Access Denied. No token provided." });
        }
        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted){
            return res.status(401).send({ error: "Invalid or expired token." });
        }
        const decoded = await verifyToken(token);
        delete decoded.password;
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ error: "Invalid or expired token." });
    }
};

export default auth;
