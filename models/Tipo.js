const { Schema, model } = require ('mongoose')


const tipoSchema = new Schema({
    nombre: { type: String, required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true },
    descripcion: { type: String }
});

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = model('Tipo', tipoSchema);