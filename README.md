# SportyMaxx - Backend 🚀

Este repositorio contiene el código del backend para SportyMaxx, una aplicación de e-commerce diseñada para una tienda de ropa. El backend está desarrollado con Node JS y Express, y maneja la lógica del servidor, la gestión de la base de datos, y la comunicación con servicios externos.

### ⚙️ Funcionalidades

- **Base de datos:** Conexión con Firebase para almacenar y gestionar productos, usuarios y órdenes de compra.

- **Almacenamiento de Imágenes 🖼️:** Las imágenes de los productos se almacenan en **Cloudinary**.

- **Pagos 💳:** Integración con **Mercado Pago** para procesar pagos de manera segura.

- **Autenticación 🔐:** Implementación de **Firebase Authentication** para gestionar la autenticación de usuarios.

- **Correo Electrónico 📧:** Envío de correos electrónicos al comprador y al dueño de la tienda para confirmar compras y notificar sobre pedidos.

### 🛠️ Tecnologías Utilizadas

- **Node JS ⚛️:** Plataforma para ejecutar el código JavaScript en el servidor.
- **Express:** Framework para construir la API y manejar las rutas y la lógica del backend.
- **Firebase:** Utilizado como base de datos y para la autenticación de usuarios.
- **Mercado Pago:** Plataforma de pagos integrada para procesar transacciones.
- **Nodemailer:** Utilizado para enviar correos electrónicos desde el servidor.

### 🚀 Instalación

1. Clona este repositorio (solo usuarios autorizados):

```bash
git clone https://github.com/usuario/sporty-maxx-backend.git
```

2. Navega al directorio del proyecto:

```bash
cd sporty-maxx-backend
```

3. Instala las dependencias necesarias:

```bash
npm install
```

4. Configura las variables de entorno:

Crea un archivo ".env" en la raíz del proyecto y agrega las siguientes variables:

```plaintext
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token
```

5. Inicia el servidor:

```bash
npm start
```
5. La aplicación estará disponible en http://localhost:5000.

### 🛒 Uso

- **Administración de Productos 🔧:** El backend permite realizar operaciones CRUD sobre los productos, almacenar imágenes, y gestionar pagos.

- **Autenticación y Seguridad:** Implementación de autenticación para proteger el acceso a los recursos y servicios.

- **Notificaciones por Correo:** Envío de correos electrónicos automáticos para mantener informados a los usuarios y al administrador sobre las compras.

### 🤝 Contribuciones

Dado que este repositorio es privado, las contribuciones están restringidas. Si tienes acceso y deseas contribuir, por favor, realiza un fork y envía un pull request con tus mejoras.

### 🧑‍💻 Autores

- Valentino Araya
   - [LinkedIn](https://www.linkedin.com/in/valentino-araya-18915825b/)


### 📜 Licencia

Este proyecto está licenciado bajo la MIT License.
