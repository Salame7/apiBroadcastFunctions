const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(400).send({
            success: false,
            error: true,
            message: "Proporciona un Token"
        }); // No se proporcionó un token
    }

    jwt.verify(token, 'Flp,4,6,7', (err, user) => {
        if (err) {
            return res.status(400).send({
                success: false,
                error: true,
                message: "Token Invalido"
            }); // El token es inválido
        }

        const userIdFromToken = user.userId;
        const userIdFromRequest = req.params._id; // Ajusta esto según dónde venga el ID en tu solicitud

        //console.log(userIdFromToken);
        //console.log(userIdFromRequest + "  Este es el ID de la URL")

        if (userIdFromToken !== userIdFromRequest) {
            return res.status(403).send({
                success: false,
                error: true,
                message: "Usuario no autorizado"
            }); // El ID del usuario no coincide
        }

        req.user = user; // Adjuntar el usuario decodificado al objeto de solicitud
        next(); // Pasar al siguiente middleware
    });
}

module.exports = {
    authenticateToken
}
