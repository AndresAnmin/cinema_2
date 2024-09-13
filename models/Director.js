const { Schema, model } = require('mongoose')

//Nombre, Estado (Activo o Inactivo), Fecha creación, Fecha actualización

const directorSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, enum: ['Activo', 'Inactivo'], required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true },
});

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = model('Director', directorSchema);