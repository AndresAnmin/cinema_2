const { Schema, model } = require ('mongoose')


const productoraSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, enum: ['Activo', 'Inactivo'], required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true },
    slogan: { type: String },
    descripcion: { type: String }
});

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = model('Productora', productoraSchema);