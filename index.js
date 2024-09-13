const express = require('express')
const { getConection } = require('./db/db-connect-mongo')
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT

//implementamos cors
app.use(cors());

getConection();

//parseo json
app.use(express.json());

//rutas
app.use('/director', require('./router/director'));
app.use('/genero', require('./router/genero'));
app.use('/productora', require('./router/productora'));
app.use('/tipo', require('./router/tipo'));
app.use('/media', require('./router/media'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//se tiene el de Listar, Crear y Actualizar 