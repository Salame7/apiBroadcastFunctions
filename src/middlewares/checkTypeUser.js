const mongoose = require('mongoose');

// Middleware para verificar el tipo de usuario
async function checkTypeUser(req, res, next) {
    try {
        const userId = req.params._id;  // Usamos el _id del usuario desde los parámetros de la ruta

        // Realiza la búsqueda en la base de datos para obtener el tipo de usuario
        let data = await req.db.collection("alumno").aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) }
            }
        ]).toArray();

        if (data.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        req.tipo_usuario = data[0].tipo_usuario; // Guardar el tipo de usuario en la request

        // Continuar al siguiente middleware o función
        next();
    } catch (error) {
        console.error("Error al verificar tipo de usuario:", error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
}

module.exports = checkTypeUser;
