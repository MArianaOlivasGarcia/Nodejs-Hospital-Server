
var express = require('express')

var mdAuth = require('../middlewares/auth_md')

var app = express()

// Importar mi modelo
var Hospital = require('../models/hospital')

//
// Obtener todos los Hospitales
//
app.get('/',  (req, res) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec( 
            ( err, hospitales ) => {

        if( err ){
            return res.status( 500 ).json({
                ok: false,
                errors: err
            })
        }

        res.status( 200 ).json({
            ok: true,
            hospitales
        })

    })




})






//
// Crear Hospital
//
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
// la propiedad decoded del req es la que yo creo en el middleware del verifica token
        usuario: req.decoded.usuario._id
    })

    hospital.save( (err, hospitaldb ) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospital: hospitaldb,
        })
        


    })
    

    
})



//
// Actualizar Hospital
//
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body

    Hospital.findById( id, (err, hospitaldb ) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })
        }

        if( !hospitaldb ){
            return res.status(404).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors:{
                    message: 'No existe un hospital con ese ID'
                }
            })
        }

        // Actualizar datos
        hospitaldb.nombre = body.nombre;
        hospitaldb.usuario = req.decoded.usuario._id

        hospitaldb.save( ( err, hospitalActualizado ) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            })

        })

    })

})



//
// Eliminar Hospital por id
//
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id

    Hospital.findByIdAndRemove( id, (err, hospitalEliminado) => {

        
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: err
            })
        }

        if( !hospitalEliminado ){
            return res.status(404).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors:{
                    message: 'No existe un hospital con ese ID'
                }
            })
        }


        res.status(200).json({
            ok: true,
            mensaje: 'Hospital eliminado con éxito'
        })

    })

})





module.exports = app