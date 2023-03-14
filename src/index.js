import * as dotenv from 'dotenv'
dotenv.config()
//console.log(process.env.DB_URL)

import Telegraf from 'telegraf'
import User from './userSchema.js'
import guardarUserIdEnDB from './db.js'
import { scheduleJob } from 'node-schedule'

// Crear un bot con su token
const bot = new Telegraf(process.env.TOKEN)

// Programar una tarea que se ejecute todos los lunes a las 11:00 am
const tareaProgramada = scheduleJob('0 11 * *', async () => {
  console.log('Ejecutando tarea programada para enviar mensaje a los usuarios')

  try {
    // Buscar todos los documentos de usuario en la base de datos
    const usuarios = await User.find({})

    // Enviar un mensaje a cada usuario encontrado
    for (const usuario of usuarios) {
      // Enviar un mensaje personalizado al usuario usando su ID
      await bot.telegram.sendMessage(usuario.userId, 'Mensaje personalizado para el usuario')
    }

    console.log(`Mensajes enviados a ${usuarios.length} usuarios`)
  } catch (err) {
    console.error('Error al enviar mensajes a los usuarios', err)
  }
})

// Manejar el comando de inicio
bot.start((ctx) => {
  const userId = ctx.from.id

  // Guardar el ID del usuario en la base de datos
  guardarUserIdEnDB(userId)

  // Responder al usuario con un mensaje de bienvenida
  ctx.reply(`Bienvenido, ${ctx.from.first_name}!`)
})

// Iniciar el bot
//bot.launch()
