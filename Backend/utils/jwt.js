import jwt from 'jsonwebtoken';

async function createToken(payload) {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
    return token;
  } catch (error) {
    throw new Error('Error creating token: ' + error.message);
  }
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token: ' + error.message);
  }
}

export { createToken, verifyToken };
