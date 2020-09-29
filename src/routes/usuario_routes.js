
var express = require('express')
var bcrypt = require('bcryptjs')

var mdAuth = require('../middlewares/auth_md')

var app = express()

// Importar mi modelo
var Usuario = require('../models/usuario')

//
// Obtener todos los Usuarios
//
app.get('/',  (req, res) => {

    
    var desde = req.query.desde || 0
    
    desde = Number( desde )


    Usuario.find({} , 'nombre email img role')
        .skip( desde )
        .limit( 5 )
        .exec(
            ( err, usuarios ) => {

                if( err ){
                    return res.status( 500 ).json({
                        ok: false,
                        errors: err
                    })
                }
            
                Usuario.countDocuments({}, (err, conteo) => {
                
                    res.status( 200 ).json({
                        ok: true,
                        usuarios,
                        total: conteo
                    })    
                
                })
            
            })      



})



//
// Crear Usuario
//
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Encriptación de la contraseña
        password: bcrypt.hashSync(  body.password, 10 ),
        img: body.img,
        role: body.role
    })

    usuario.save( (err, usuariodb ) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuariodb,
            // contiene informacion del token
            // como el usuario que hace la peticion
            decoded: req.decoded
        })
        


    })
    

    
})



//
// Actualizar Usuario
//
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body

    Usuario.findById( id, (err, usuariodb ) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if( !usuariodb ){
            return res.status(404).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors:{
                    message: 'No existe un usuario con ese ID'
                }
            })
        }

        // Actualizar datos
        usuariodb.nombre = body.nombre;
        usuariodb.email = body.email;
        usuariodb.role = body.role;

        usuariodb.save( ( err, usuarioActualizado ) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                })
            }

            // Ocultar la contraseña antes de mostrarla
            usuarioActualizado.password = undefined;

            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            })

        })

    })

})



//
// Eliminar Usuario por id
//
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id

    Usuario.findByIdAndRemove( id, (err, usuarioEliminado) => {

        
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            })
        }

        if( !usuarioEliminado ){
            return res.status(404).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors:{
                    message: 'No existe un usuario con ese ID'
                }
            })
        }


        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado con éxito'
        })

    })

})



module.exports = app