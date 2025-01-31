const MongoConnection = require("../middlewares/connection.js");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb").ObjectId;
const AWS = require("aws-sdk");
require("dotenv").config();
const telegramApi = require("../middlewares/alerts.js"); // el helper creado

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

module.exports = (() => {
  class BabyStreamController {
    async broadcastBaby(req, res) {
      try {
        // 1. Obtener el id del bebé
        const { _id } = req.params;

        // 2. Conexión a la base de datos y recuperación del canal
        const conexion = await req.db
          .collection("alumno")
          .aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },
            {
              $project: {
                correo_electronico: 1,
                "bebes.nombre": 1
              },
            },
          ])
          .toArray();
        
        console.log(conexion);
        const email = conexion[0].correo_electronico;
        console.log(email);

        const broadcast = await req.db
          .collection("broadcast")
          .aggregate([{ $match: { correo_electronico: email } }])
          .toArray();

        // 3. Validar la consulta y que canal no esté vacío
        if (
          !broadcast ||
          broadcast.length < 1 ||
          !broadcast[0].canal ||
          broadcast[0].canal.trim() === ""
        ) {
          return res.status(400).send({
            success: false,
            error: true,
            message: "No se encontró el canal asociado al bebé o está vacío.",
          });
        }

        const streamName = broadcast[0].canal; // Nombre del canal en KVS
        console.log(`Canal de video encontrado: ${streamName}`);

        // 4. Obtener la URL HLS desde Kinesis Video Streams
        const hlsUrl = await this.getHLSUrl(streamName);

        const response = {
            nombre_bebe: conexion[0].bebes[0].nombre,
            HLSurl: hlsUrl
        };

        // 5. Responder con la URL HLS
        return res.status(200).send({
          successful: true,
          message: response
        });
      } catch (error) {
        console.error("Error en broadcastBaby:", error.message);
        return res.status(500).send({
          successful: false,
          error: true,
          message: "Ocurrió un error al procesar la solicitud.",
        });
      } finally {
        // Cerrar conexión con la BD
        await MongoConnection.releasePool(req.db);
      }
    }

    async broadcastBabyForCaregiver(req, res) {
      try {
        // 1. Obtener el id del bebé
        const { id_bebe } = req.params;

        // 2. Conexión a la base de datos y recuperación del canal
        const conexion = await req.db
          .collection("alumno")
          .aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id_bebe) } },
            {
              $project: {
                correo_electronico: 1,
                "bebes.nombre": 1
              },
            },
          ])
          .toArray();
        
        console.log(conexion);
        const email = conexion[0].correo_electronico;
        console.log(email);

        const broadcast = await req.db
          .collection("broadcast")
          .aggregate([{ $match: { correo_electronico: email } }])
          .toArray();

        // 3. Validar la consulta y que canal no esté vacío
        if (
          !broadcast ||
          broadcast.length < 1 ||
          !broadcast[0].canal ||
          broadcast[0].canal.trim() === ""
        ) {
          return res.status(400).send({
            success: false,
            error: true,
            message: "No se encontró el canal asociado al bebé o está vacío.",
          });
        }

        const streamName = broadcast[0].canal; // Nombre del canal en KVS
        console.log(`Canal de video encontrado: ${streamName}`);

        // 4. Obtener la URL HLS desde Kinesis Video Streams
        const hlsUrl = await this.getHLSUrl(streamName);

        const response = {
            nombre_bebe: conexion[0].bebes[0].nombre,
            HLSurl: hlsUrl
        };

        // 5. Responder con la URL HLS
        return res.status(200).send({
          successful: true,
          message: response
        });
      } catch (error) {
        console.error("Error en broadcastBaby:", error.message);
        return res.status(500).send({
          successful: false,
          error: true,
          message: "Ocurrió un error al procesar la solicitud.",
        });
      } finally {
        // Cerrar conexión con la BD
        await MongoConnection.releasePool(req.db);
      }
    }

    // Función auxiliar para obtener la URL HLS desde AWS Kinesis Video Streams
    async getHLSUrl(streamName) {
      try {
        const kinesisVideo = new AWS.KinesisVideo();

        // Obtener el Data Endpoint
        const dataEndpointRes = await kinesisVideo
          .getDataEndpoint({
            APIName: "GET_HLS_STREAMING_SESSION_URL",
            StreamName: streamName,
          })
          .promise();

        const kinesisMedia = new AWS.KinesisVideoArchivedMedia({
          endpoint: dataEndpointRes.DataEndpoint,
        });

        // Obtener la URL HLS
        const hlsResponse = await kinesisMedia
          .getHLSStreamingSessionURL({
            StreamName: streamName,
            PlaybackMode: "LIVE",
            HLSFragmentSelector: {
              FragmentSelectorType: "PRODUCER_TIMESTAMP",
            },
            Expires: 300, // Expira en 5 minutos
          })
          .promise();

        console.log(`URL HLS obtenida: ${hlsResponse.HLSStreamingSessionURL}`);
        return hlsResponse.HLSStreamingSessionURL;
      } catch (error) {
        console.error("Error al obtener la URL HLS:", error.message);
        throw error;
      }
    }

    async newUserAlert(req, res) {
      console.log("Body recibido:", JSON.stringify(req.body, null, 2));
    
      const { message } = req.body;
      if (!message || !message.chat || !message.text) {
        console.error("Datos del webhook malformados:", JSON.stringify(req.body, null, 2));
        return res.status(400).send("Bad Request: Missing necessary fields.");
      }
    
      const chatId = String(message.chat.id);
      const text = message.text.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!emailRegex.test(text)) {
        try {
          await telegramApi.post("/sendMessage", {
            chat_id: chatId,
            text: "Por favor envía tu correo electrónico para registrarte.",
          });
          return res.status(200).send("Solicitud procesada: esperando email.");
        } catch (error) {
          console.error("Error al enviar mensaje a Telegram:", error.message);
          return res.status(500).send("Error al enviar mensaje.");
        }
      }
    
      const email = text;
      try {
        // Buscar usuario en la base de datos
        const user = await req.db.collection("broadcast").findOne({
          correo_electronico: email,
        });
    
        if (!user) {
          await telegramApi.post("/sendMessage", {
            chat_id: chatId,
            text: "Correo no encontrado. Por favor, asegúrate de que tu correo es correcto y vuelve a presionar /start. Si el problema persiste, contacta a soporte técnico.",
          });
          return res.status(404).send("Correo no encontrado.");
        }
    
        const alertasCount = (user.alertas_telegram || []).length;
        if (alertasCount >= 3) {
          await telegramApi.post("/sendMessage", {
            chat_id: chatId,
            text: "Ya hay 3 usuarios registrados con este correo. No es posible agregar más.",
          });
          return res.status(400).send("Límite alcanzado para alertas_telegram.");
        }
    
        const updateResult = await req.db.collection("broadcast").updateOne(
          { correo_electronico: email },
          { $addToSet: { alertas_telegram: chatId } }
        );
    
        const successMessage =
          updateResult.modifiedCount > 0
            ? "¡Registro exitoso! Ahora recibirás alertas."
            : "Ya estás registrado para recibir alertas.";
    
        await telegramApi.post("/sendMessage", {
          chat_id: chatId,
          text: successMessage,
        });
    
        return res.status(200).send(successMessage);
      } catch (error) {
        console.error("Error procesando solicitud:", error.message);
        return res.status(500).send("Error interno del servidor.");
      } finally {
        // Asegurarse de liberar la conexión al final del proceso
        try {
          await MongoConnection.releasePool(req.db);
        } catch (releaseError) {
          console.error("Error al liberar la conexión de la base de datos:", releaseError.message);
        }
      }
    }
    
        
    
  }
  return new BabyStreamController();
})();
