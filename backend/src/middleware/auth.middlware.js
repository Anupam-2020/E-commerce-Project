const { verifyToken } = require('../utils/jwt');

function protect(req, resp, next) {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return resp.status(401).json({
                message: 'Unauthorized'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch(error) {
        return resp.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = { protect };