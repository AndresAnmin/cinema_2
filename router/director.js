const { Router } = require('express');
const Director = require('../models/Director'); // Importa el modelo Director
const { validationResult, check } = require('express-validator');

const router = Router();



// Get Listar directores
router.get('/', async function (req, res) {
    try {
        const directores = await Director.find();
        res.send(directores);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});



// POST method para agregar un Director
router.post('/', [
    // Validación del campo 'nombre' (debe estar presente y no puede estar vacío)
    check('nombre', 'El nombre del director es obligatorio').not().isEmpty(),

    // Validación del campo 'estado' (debe ser 'Activo' o 'Inactivo')
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Crear un nuevo director
        let director = new Director();
        director.nombre = req.body.nombre;
        director.estado = req.body.estado;
        director.fechaCreacion = new Date();
        director.fechaActualizacion = new Date();

        // Guardar el director en la base de datos
        director = await director.save();
        res.send(director);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el director');
    }
});



// PUT method para actualizar un Director
router.put('/:directorId', [
    
    check('nombre', 'El nombre del director es obligatorio').not().isEmpty(),
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Buscar el director por ID
        let director = await Director.findById(req.params.directorId);
        if (!director) {
            return res.status(400).send('Director no existe');
        }

        // Verifica si ya existe un director con el mismo nombre (exceptuando el actual)
        const existeDirector = await Director.findOne({ nombre: req.body.nombre, _id: { $ne: director._id } });
        if (existeDirector) {
            return res.status(400).send('El nombre ya existe');
        }

        // Actualizar los campos del director
        director.nombre = req.body.nombre;
        director.estado = req.body.estado;
        director.fechaActualizacion = new Date(); // Actualiza la fecha

        // Guardar los cambios en la base de datos
        director = await director.save();
        res.send(director);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el director');
    }
});

module.exports = router;