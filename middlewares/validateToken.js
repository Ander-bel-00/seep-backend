const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.token; // Lee el token de las cookies

    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY || 'SECRETKEY');

        if (token === cookieToken) {
            req.usuario = decodedToken;
            next();
        } else {
            return res.status(401).json({ message: 'Token inválido' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};
