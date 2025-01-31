# API Broadcast Functions

## Descripción
La API **apiBroadcastFunctions** gestiona la transmisión de video en vivo y la integración con el bot de Telegram. Sus funcionalidades incluyen el acceso al video en vivo para padres y cuidadores, la obtención de la URL HLS para la transmisión y el registro de nuevos usuarios en el bot de Telegram. Está desplegada en AWS Lambda y utiliza Amazon API Gateway para su comunicación.

## Tecnologías Utilizadas
- **AWS Lambda** para la ejecución sin servidor.
- **Amazon API Gateway** para la gestión de endpoints.
- **Kinesis Video Streams** para la gestión de video en vivo.
- **MongoDB** como base de datos.
- **Express.js** como framework de backend.
- **JWT (JSON Web Token)** para autenticación.
- **Axios** para llamadas HTTP a otros servicios.

## Instalación y Configuración

### Prerequisitos
1. **Node.js** instalado en el sistema.
2. **Cuenta AWS** con permisos para Lambda y API Gateway.
3. **MongoDB Atlas** o una instancia de MongoDB local.
4. **Variables de entorno** en AWS Lambda:
   - `MONGO_URI`: URL de conexión a MongoDB.
   - `JWT_SECRET`: Clave secreta para la autenticación.
   - `KVS_STREAM_NAME`: Nombre del stream en Kinesis Video Streams.
   - `TELEGRAM_BOT_TOKEN`: Token de autenticación del bot de Telegram.

### Instalación Local
1. Clonar el repositorio:
   ```sh
   git clone <url del repositorio>
   cd <nombre del repositorio>
   ```
2. Instalar dependencias
   ```
   npm install
   ```
## Despliegue en AWS Lambda
Para desplegar en AWS Lambda utilizando Serverless Framework:

1. Instalar Serverless Framework:
    ```sh
    npm install -g serverless
    ```
2. Configurar AWS Credentials:
    ```sh
    serverless config credentials --provider aws --key <AWS_ACCESS_KEY> --secret <AWS_SECRET_KEY>
    ```
3. Desplegar la api
    ```sh
    serverless deploy
    ```
