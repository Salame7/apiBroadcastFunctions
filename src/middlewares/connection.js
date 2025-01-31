/*
En connection hacemos la conexión y desconexión de la base de datos
Las clases que importamos y de las que hacemos uso es 
getPool y releasePool

getPool -> createClient -> connect

releasePool -> releaseClient -> destroy
*/
const { MongoClient } = require('mongodb');//Usaremos el package mongodb
require('dotenv').config();

module.exports = (()=>{
    'use strict'; //Usar solo variables declaradas

    class MongoDb{
        constructor(){
            const fileConfig = require('./config');
            this.config = fileConfig;
            this.urlMongo = process.env.MONGO_CONNECTION;//url por la que nos conectaremos a mongodb (esta local)
        }
        async connect(){//Clase orientada a la conexión de una sesión
         
            try {
                let client = new MongoClient(this.urlMongo,(err, db) => {
                    if(err)
                    {
                    console.log(err)
                    return err;
                    }
                    console.log('database Connected')
                    return db;
                  });
                let conexion = await client.connect();
                let db = conexion.db(this.config.db.namedb);
                return db;
            } catch (error) {
                console.log(error);
                return error;
            }
        }
        async destroy(db){//Clase orientada a la desconexión de una sesión
            try {
                await db.s.client.close();
                return true;
            } catch (error) {
                if(error.message.includes("undefined") || error.message.includes("reading 'close'")){
                    await db.client.close();
                    return true;
                }
                else {
                    console.log(error)
                }
                return error;
            }

        }

        async createClient(){//llama a la función connect para iniciar una sesión
            return await this.connect();
        }
        async releaseClient(db){//llama a la función destroy para terminar la sesión
            return await this.destroy(db);
        }

        async releasePool(db){ //Desconecta al cliente
            try {
                await this.releaseClient(db)
                return db;
            } catch (error) {
                return error;
            }
        }

        async getPool(){//Conecta al cliente
            try {
                let db = await this.createClient();
                return db;
            } catch (error) {
                return error;
            }
        }

    }
    return new MongoDb();

})();