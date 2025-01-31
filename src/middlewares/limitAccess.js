// Middleware para limitar el acceso según el tipo de usuario permitido
function limitAccess(tipoPermitido) {
    return (req, res, next) => {
        if (req.tipo_usuario !== tipoPermitido) {
            return res.status(403).json({ mensaje: "Acceso denegado" });
        }
        next();  // Si el tipo de usuario es permitido, continuar con la ruta
    };
}

module.exports = limitAccess;
