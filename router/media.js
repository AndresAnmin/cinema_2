
const { Router } = require('express');
const Media = require('../models/Media');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')

const router = Router();

// Crear nuevo medio
router.post('/', [validarJWT], [
    check('serial', 'El serial es obligatorio').not().isEmpty(),
    check('titulo', 'El título es obligatorio').not().isEmpty(),
    check('url', 'La URL es obligatoria').not().isEmpty(),
    check('añoEstreno', 'El año de estreno es obligatorio y debe ser un número').isInt(),
    check('Usuario', 'El Usuario es obligatorio').not().isEmpty(),
    check('generoPrincipal', 'El género principal es obligatorio').not().isEmpty(),
    check('directorPrincipal', 'El director principal es obligatorio').not().isEmpty(),
    check('productora', 'La productora es obligatoria').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty()
], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let media = new Media();
        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.url = req.body.url;
        media.añoEstreno = req.body.añoEstreno;
        media.Usuario = req.body.Usuario;
        media.generoPrincipal = req.body.generoPrincipal;
        media.directorPrincipal = req.body.directorPrincipal;
        media.productora = req.body.productora;
        media.tipo = req.body.tipo;
        media.fechaCreacion = new Date();
        media.fechaActualizacion = new Date();

        media = await media.save();
        res.send(media);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el medio');
    }
});

// Listar medios
router.get('/', [validarJWT], async function (req, res) {

    try {
        const medios = await Media.find().populate([
            { path: 'Usuario', select: 'nombre email estado'},
            { path: 'generoPrincipal', select: 'nombre estado' },
            { path: 'directorPrincipal', select: 'nombre estado' },
            { path: 'productora', select: 'nombre estado' },
            { path: 'tipo', select: 'nombre estado' }
        ]);

        res.send(medios);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }

});

// Actualizar medio
router.put('/:mediaId', [validarJWT], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('titulo', 'invalid.titulo').not().isEmpty(),
    check('url', 'invalid.url').not().isEmpty(),
    check('añoEstreno', 'invalid.añoEstreno').isInt(),
    check('Usuario', 'invalid.Usuario').not().isEmpty(),
    check('generoPrincipal', 'invalid.generoPrincipal').not().isEmpty(),
    check('directorPrincipal', 'invalid.directorPrincipal').not().isEmpty(),
    check('productora', 'invalid.productora').not().isEmpty(),
    check('tipo', 'invalid.tipo').not().isEmpty()
    
], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(400).send('Media no existe');
        }

        const existeMediaPorSerial = await Media.findOne({ serial: req.body.serial, _id: { $ne: media._id } });
        if (existeMediaPorSerial) {
            return res.status(400).send('Ya existe el serial para otro medio');
        }

        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.url = req.body.url;
        media.añoEstreno = req.body.añoEstreno;
        media.Usuario = req.body.Usuario;
        media.generoPrincipal = req.body.generoPrincipal;
        media.directorPrincipal = req.body.directorPrincipal;
        media.productora = req.body.productora;
        media.tipo = req.body.tipo;
        media.fechaActualizacion = new Date();

        media = await media.save();
        res.send(media);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el medio');
    }
});

// Obtener medio por ID
router.get('/:mediaId', [validarJWT], async function (req, res) {
    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(404).send('Media no existe');
        }

        res.send(media);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar el medio');
    }
});

module.exports = router;
