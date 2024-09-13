const { Router } = require('express');
const Tipo = require('../models/Tipo'); // Importa el modelo Tipo
const { validationResult, check } = require('express-validator');

const router = Router();

// Get Listar tipos
router.get('/', async function (req, res) {
    try {
        const tipos = await Tipo.find();
        res.send(tipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// POST method para agregar un Tipo
router.post('/', [
    // Validación del campo 'nombre' (debe estar presente y no puede estar vacío)
    check('nombre', 'El nombre del tipo es obligatorio').not().isEmpty(),
], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Crear un nuevo tipo
        let tipo = new Tipo();
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.fechaCreacion = new Date();
        tipo.fechaActualizacion = new Date();

        // Guardar el tipo en la base de datos
        tipo = await tipo.save();
        res.send(tipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el tipo');
    }
});

// PUT method para actualizar un Tipo
router.put('/:tipoId', [

    check('nombre', 'El nombre del tipo es obligatorio').not().isEmpty(),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Buscar el tipo por ID
        let tipo = await Tipo.findById(req.params.tipoId);
        if (!tipo) {
            return res.status(400).send('Tipo no existe');
        }

        // Verifica si ya existe un tipo con el mismo nombre (exceptuando el actual)
        const existeTipo = await Tipo.findOne({ nombre: req.body.nombre, _id: { $ne: tipo._id } });
        if (existeTipo) {
            return res.status(400).send('El nombre ya existe');
        }

        // Actualizar los campos del tipo
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.fechaActualizacion = new Date(); // Actualiza la fecha

        // Guardar los cambios en la base de datos
        tipo = await tipo.save();
        res.send(tipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el tipo');
    }
});

module.exports = router;