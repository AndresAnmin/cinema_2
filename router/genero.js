const { Router } = require('express');
const Genero = require('../models/Genero'); // Importa el modelo Genero
const { validationResult, check } = require('express-validator');

const router = Router();

// Get Listar géneros
router.get('/', async function (req, res) {
    try {
        const generos = await Genero.find();
        res.send(generos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// POST method para agregar un género
router.post('/', [
    // Validación del campo 'nombre' (debe estar presente y no puede estar vacío)
    check('nombre', 'El nombre del género es obligatorio').not().isEmpty(),

    // Validación del campo 'estado' (debe ser 'Activo' o 'Inactivo')
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Crear un nuevo género
        let genero = new Genero();
        genero.nombre = req.body.nombre;
        genero.estado = req.body.estado;
        genero.descripcion = req.body.descripcion || '';
        genero.fechaCreacion = new Date();
        genero.fechaActualizacion = new Date();

        // Guardar el género en la base de datos
        genero = await genero.save();
        res.send(genero);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el género');
    }
});

// PUT method para actualizar un Género
router.put('/:generoId', [
    // Validación del campo 'nombre' (debe estar presente y no puede estar vacío)
    check('nombre', 'El nombre del género es obligatorio').not().isEmpty(),

    // Validación del campo 'estado' (debe ser 'Activo' o 'Inactivo')
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Buscar el género por ID
        let genero = await Genero.findById(req.params.generoId);
        if (!genero) {
            return res.status(400).send('El género no fue encontrado');
        }

        // Verifica si ya existe un género con el mismo nombre (exceptuando el actual)
        const existeGenero = await Genero.findOne({ nombre: req.body.nombre, _id: { $ne: genero._id } });
        if (existeGenero) {
            return res.status(400).send('El nombre ya existe');
        }

        // Actualizar los campos del género
        genero.nombre = req.body.nombre;
        genero.estado = req.body.estado;
        genero.descripcion = req.body.descripcion || genero.descripcion;
        genero.fechaActualizacion = new Date(); // Actualiza la fecha

        // Guardar los cambios en la base de datos
        genero = await genero.save();
        res.send(genero);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el género');
    }
});

module.exports = router;