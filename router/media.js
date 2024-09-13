
const { Router } = require('express');
const Media = require('../models/Media');
const { validationResult, check } = require('express-validator');

const router = Router();

// Crear nuevo medio
router.post('/', [
    check('serial', 'El serial es obligatorio').not().isEmpty(),
    check('titulo', 'El título es obligatorio').not().isEmpty(),
    check('url', 'La URL es obligatoria').not().isEmpty(),
    check('añoEstreno', 'El año de estreno es obligatorio y debe ser un número').isInt(),
    check('generoPrincipal', 'El género principal es obligatorio').not().isEmpty(),
    check('directorPrincipal', 'El director principal es obligatorio').not().isEmpty(),
    check('productora', 'La productora es obligatoria').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const media = new Media(req.body);
        await media.save();
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el medio' });
    }
});

// Obtener todos los medios
router.get('/', async (req, res) => {
    try {
        const medios = await Media.find().populate('generoPrincipal directorPrincipal productora tipo');
        res.json(medios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los medios' });
    }
});

// Obtener medio por ID
router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id).populate('generoPrincipal directorPrincipal productora tipo');
        if (!media) {
            return res.status(404).json({ message: 'Media no encontrado' });
        }
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el medio' });
    }
});

// Actualizar medio
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findByIdAndUpdate(id, req.body, { new: true }).populate('generoPrincipal directorPrincipal productora tipo');
        if (!media) {
            return res.status(404).json({ message: 'Media no encontrado' });
        }
        media.fechaActualizacion = new Date();
        await media.save();
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el medio' });
    }
});

module.exports = router;

