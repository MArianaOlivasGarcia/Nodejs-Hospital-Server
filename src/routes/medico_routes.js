

var express = require('express')

var mdAuth = require('../middlewares/auth_md')

var app = express()

// Importar mi modelo
var Medico = require('../models/medico')

//
// Obtener todos los Medicoes
//
app.get('/',  (req, res) => {

    Medico.find({})
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
    .exec(
        ( err, medicos ) => {

        if( err ){
            return res.status( 500 ).json({
                ok: false,
                errors: err
            })
        }

        res.status( 200 ).json({
            ok: true,
            medicos
        })

    })




})






//
// Crear Medico
//
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
// la propiedad decoded del req es la que yo creo en el middleware del verifica token
        usuario: req.decoded.usuario._id,
        hospital: body.hospital
    })

    medico.save( (err, medicodb ) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            medico: medicodb,
        })
        


    })
    

    
})



//
// Actualizar Medico
//
app.put('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id
    var body = req.body

    Medico.findById( id, (err, medicodb ) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            })
        }

        if( !medicodb ){
            return res.status(404).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors:{
                    message: 'No existe un medico con ese ID'
                }
            })
        }

        // Actualizar datos
        medicodb.nombre = body.nombre;
        medicodb.usuario = req.decoded.usuario._id
        medicodb.hospital = body.hospital


        medicodb.save( ( err, medicoActualizado ) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                medico: medicoActualizado
            })

        })

    })

})



//
// Eliminar Medico por id
//
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id

    Medico.findByIdAndRemove( id, (err, medicoEliminado) => {

        
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: err
            })
        }

        if( !medicoEliminado ){
            return res.status(404).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors:{
                    message: 'No existe un medico con ese ID'
                }
            })
        }


        res.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado con éxito'
        })

    })

})





module.exports = app