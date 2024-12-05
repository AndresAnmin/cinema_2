const { Schema, model } = require('mongoose')

//Nombre, Estado (Activo o Inactivo), Fecha creacion, Fecha actualizacion

const directorSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, enum: ['Activo', 'Inactivo'], required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true },
});

// Exportar el modelo
module.exports = model('Director', directorSchema);