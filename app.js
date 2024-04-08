const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Token de tu bot de Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ID del grupo de Telegram al que deseas enviar mensajes
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID

// Enrutador específico para /sendMessage
const sendMessageRouter = express.Router();

// Middleware para manejar la ruta /sendMessage
sendMessageRouter.post('/', async (req, res) => {
    try {
      const { cantidades, direccion, nombre, telefono, vapeIds } = req.body;
  
      // Verificar si las cantidades y los vapeIds tienen la misma longitud
      if (cantidades.length !== vapeIds.length) {
        throw new Error('La longitud de "cantidades" y "vapeIds" no coincide.');
      }
  
      // Crear el texto del mensaje con los detalles del pedido
      const messageText = `Ha llegado un nuevo pedido:\n \n` +
                          `${vapeIds.map((vapeId, index) => `* ${vapeId}: ${cantidades[index]}`).join('\n')}\n\n` +
                          `Para: ${nombre}\n` +
                          `en la direccion: ${direccion}\n` +
                          `contacto: ${telefono}`;
  
      // Enviar el mensaje al grupo de Telegram
      await sendTelegramMessage(messageText);
  
      res.send('Mensaje enviado correctamente a Telegram.');
    } catch (error) {
      console.error('Hubo un problema al enviar el mensaje a Telegram:', error.message);
      res.status(500).send('Error al enviar el mensaje a Telegram.');
    }
  });
  
  // Función para enviar un mensaje al grupo de Telegram
  async function sendTelegramMessage(message) {
    try {
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_GROUP_ID,
        text: message
      });
  
      console.log('Mensaje enviado a Telegram:', response.data);
    } catch (error) {
      throw new Error('Hubo un problema al enviar el mensaje a Telegram');
    }
  }
app.use(express.json())
// Usar el enrutador para la ruta /sendMessage
app.use('/sendMessage', sendMessageRouter);

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

let message = 'Se ha recibido un nuevo pedido\n'
