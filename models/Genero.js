const { Schema, model } = require ('mongoose')


const generoSchema = new Schema({
    nombre: { type: String, required: true, enum: ['accion', 'aventura', 'ciencia ficcion', 'drama', 'terror'] },
    estado: { type: String, enum: ['Activo', 'Inactivo'], required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true },
    descripcion: { type: String }
});

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = model('Genero', generoSchema);