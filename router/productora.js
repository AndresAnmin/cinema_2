const { Router } = require('express');
const Productora = require('../models/Productora'); // Importa el modelo Productora
const { validationResult, check } = require('express-validator');

const router = Router();

// Get Listar productoras
router.get('/', async function (req, res) {
    try {
        const productoras = await Productora.find();
        res.send(productoras);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// POST method para agregar una Productora
router.post('/', [
    // Validación del campo 'nombre' (debe estar presente y no puede estar vacío)
    check('nombre', 'El nombre de la productora es obligatorio').not().isEmpty(),

    // Validación del campo 'estado' (debe ser 'Activo' o 'Inactivo')
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Crear una nueva productora
        let productora = new Productora();
        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.fechaCreacion = new Date();
        productora.fechaActualizacion = new Date();

        // Guardar la productora en la base de datos
        productora = await productora.save();
        res.send(productora);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la productora');
    }
});

// PUT method para actualizar una Productora
router.put('/:productoraId', [

    check('nombre', 'El nombre de la productora es obligatorio').not().isEmpty(),
    check('estado', 'El estado debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {
        // Verifica si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Buscar la productora por ID
        let productora = await Productora.findById(req.params.productoraId);
        if (!productora) {
            return res.status(400).send('Productora no existe');
        }

        // Verifica si ya existe una productora con el mismo nombre (exceptuando la actual)
        const existeProductora = await Productora.findOne({ nombre: req.body.nombre, _id: { $ne: productora._id } });
        if (existeProductora) {
            return res.status(400).send('El nombre ya existe');
        }

        // Actualizar los campos de la productora
        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.fechaActualizacion = new Date(); // Actualiza la fecha

        // Guardar los cambios en la base de datos
        productora = await productora.save();
        res.send(productora);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar la productora');
    }
});

module.exports = router;