

// Requires
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var serverIndex = require('serve-index')

// Inicializar variables
var app = express()


// BODY PARSER
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// Serve index
/* 
app.use( express.static (__dirname + '/') )
app.use('/uploads', serverIndex(__dirname + '/'))
 */


// Importar rutas
var usuarioRoutes = require('./src/routes/usuario_routes')
var authRoutes = require('./src/routes/auth_routes')
var hospitalRoutes = require('./src/routes/hospital_routes')
var medicoRoutes = require('./src/routes/medico_routes')
var busquedaRoutes = require('./src/routes/busqueda_routes')
var uploadRoutes = require('./src/routes/upload_routes')
var imgRoutes = require('./src/routes/img_routes')


// Warnings de mongoose
mongoose.set( 'useNewUrlParser', true )
mongoose.set( 'useUnifiedTopology', true )
mongoose.set( 'useCreateIndex', true )
mongoose.set( 'useFindAndModify', false )


// Conexion a la base de datos Mongodb
mongoose.connect('mongodb://localhost:27017/hospitaldb',  ( err ) => {
   
    if( err ) throw err;

    console.log( 'Base de datos: \x1b[32m%s\x1b[0m', 'online' )

})





// Usar rutas
app.use('/usuario', usuarioRoutes )
app.use('/auth', authRoutes )
app.use('/hospital', hospitalRoutes )
app.use('/medico', medicoRoutes )
app.use('/busqueda', busquedaRoutes )
app.use('/upload', uploadRoutes )
app.use('/img', imgRoutes )


// Escuchar peticiones
app.listen( 3000, () => {
    console.log( 'Express en el puerto 3000: \x1b[32m%s\x1b[0m', 'online' )
})

