/*
Este es el middleware que implementaremos en las rutas (routes -> mainRoutes por ejemplo)
La finalidad de modularizar la conexión a la BD y otros segmentos es  
facilitar la lectura del código

*/
const MongoConnection = require('./connection.js')
async function getPool(req,res,next){
    try {
        //Llama a la función getPool -> connection, genera una conexión a la BD
        req.db = await MongoConnection.getPool();
        next();
    } catch (error) {
        console.error("Error on middleware GetPool")
        res.status(401).send({
            success: false,
            error: true,
            message: "Error Middleware GetPool"
        })
    }
}

/*
Cada que creemos una función o un método es importante exportarlo 
para poder usarlo en otras partes del proyecto
*/
module.exports = {
    getPool
}