const { Schema, model } = require('mongoose');

// Definir el esquema para Media
const mediaSchema = new Schema({
    serial: { type: String, unique: true, required: true },   
    titulo: { type: String, required: true },                  
    sinopsis: { type: String },                               
    url: { type: String, unique: true, required: true },      
    imagenPortada: { type: String },                          
    fechaCreacion: { type: Date, default: Date.now },         
    fechaActualizacion: { type: Date, default: Date.now },    
    añoEstreno: { type: Number, required: true },             
    generoPrincipal: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },  
    directorPrincipal: { type: Schema.Types.ObjectId, ref: 'Director', required: true }, 
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },      
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true } 
});

// Crear el modelo Media
const Media = model('Media', mediaSchema);

module.exports = Media;