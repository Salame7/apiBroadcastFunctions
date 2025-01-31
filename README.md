# API Growth Functions

## Descripción
La API **apiGrowthFunctions** permite la gestión del crecimiento de los bebés dentro de la plataforma. Incluye funcionalidades para registrar, actualizar y mostrar datos de crecimiento, tanto para los padres como para los cuidadores. Está desplegada en AWS Lambda y se comunica a través de Amazon API Gateway.

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
