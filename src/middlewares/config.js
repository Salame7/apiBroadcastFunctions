require('dotenv').config();

module.exports = (()=>{//Función destinada a exportar datos a mongodb
    return{
        db: {
            ip: process.env.MONGODBIP,//IP de conexión
            user: process.env.USERATLAS,//Usuario
            password: process.env.PASSWORD,//contraseña
            port: 27017,//Puerto de conexión, este es por defecto 
            option: {
                useNewUrlParser: true, //Parser nos ayuda a poder trabajar con JSON
                useUnifiedTopology: true,
            },
            namedb: process.env.NAMEBD,//Nombre de la base de datos
            info: '?retryWrites=true&w=majority',
            MAXPOOL: process.env.MAXPOOL,
            MINPOOL: process.env.MINPOOL,
            MAXTIME: process.env.MAXTIME,
        }
    }
})();