import { connect, Schema, model } from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()
// Conectarse a la base de datos MongoDB
console.log(process.env.DB_URL)
connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('Error de conexión a la base de datos', err))

// Definir el esquema de datos para los IDs de usuario
const userSchema = new Schema({
  userId: { type: Number, required: true }
})

// Definir el modelo de datos para los IDs de usuario
const User = model('User', userSchema)

export default { User }
