const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt')
const {validarRolAdmin } = require('../middleware/validar-rol-Admin')

const router = Router();

// Listar usuarios
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    
    try {

        const usuarios = await Usuario.find(); // select * from usuarios
        res.send(usuarios);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error')
    }
    
  });

  // POST method route
router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email })
        if (existeUsuario) {
            return res.status(400).send('Email ya existe')
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt)
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date;
        usuario.fechaActualizacion = new Date;

        usuario = await usuario.save(); 
        res.send(usuario);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear usuario')
        
    }
    
  });

  // PUT method route
  router.put('/:usuarioId', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email, _id:{ $ne: usuario._id} });
        if (existeUsuario) {
            return res.status(400).send('Email ya existe')
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.password = req.body.password;
        usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date;

        usuario = await usuario.save(); 
        res.send(usuario);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear usuario')
        
    }
    
  });
  
  module.exports = router;