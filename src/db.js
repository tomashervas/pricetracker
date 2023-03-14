import User from './userSchema.js'

async function guardarUserIdEnDB(userId) {
  try {
    // Crear un nuevo documento de usuario con el ID proporcionado
    const user = new User({ userId: userId })

    // Guardar el nuevo documento de usuario en la base de datos
    await user.save()

    console.log(`Usuario ${userId} guardado en la base de datos`)
  } catch (err) {
    console.error(`Error al guardar el usuario ${userId} en la base de datos`, err)
  }
}

export default { guardarUserIdEnDB }
