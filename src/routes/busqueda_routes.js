
var express = require('express')

var app = express();

var Hospital = require('../models/hospital')
var Medico = require('../models/medico')
var Usuario = require('../models/usuario')






//
//  BUSQUEDA GENERAL
//
app.get('/todo/:termino', (req, res, next) => {

    var termino = req.params.termino;

    // Crear una expresion regular para buscar en cualquier parte que diga "norte" por ejemplo
    // Mandar la i para que sea insensible a mayusculas y minusculas
    var regExp = new RegExp( termino, 'i' )

    // Puedo mandar un arreglo de promesas que se hagan simultaneamente
    Promise.all( [
        buscarHospitales( regExp ),
        buscarMedicos( regExp ),
        buscarUsuarios( regExp )
    ] ) // Regresa un arreglo de respuestas
    // La respuesta de la promesa 1, esta en la posición 0 y asi...
        .then( respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })

        })
  
})




/* Función que retorna una promesa que hace la busqueda de todos
los hospitales por termino de busqueda */

function buscarHospitales( regExp ){

    return new Promise( ( resolve, reject ) => {

        Hospital.find( { nombre: regExp } )
            .populate('usuario', 'nombre email')
            .exec( (err, hospitales) => {

            if( err ){
                reject('Error al cargar hospitales', err )
            } else {
                resolve( hospitales )
            }

        })

    })

}




/* Función que retorna una promesa que hace la busqueda de todos
los medicos por termino de busqueda */

function buscarMedicos( regExp ){

    return new Promise( ( resolve, reject ) => {

        Medico.find( { nombre: regExp } )
            .populate( 'usuario', 'nombre email' )
            .populate( 'hospital' )
            .exec( (err, medicos) => {

            if( err ){
                reject('Error al cargar medicos', err )
            } else {
                resolve( medicos )
            }

        })

    })

}




/* Función que retorna una promesa que hace la busqueda de todos
los usuarios por termino de busqueda */

function buscarUsuarios( regExp ){

    return new Promise( ( resolve, reject ) => {

        Usuario.find({}, 'nombre email role')
            .or( [ {'nombre': regExp}, {'email': regExp} ] )
            .exec( ( err, usuarios ) => {

                if( err ){
                    reject('Error al cargar usuarios', err )
                } else {
                    resolve( usuarios )
                }

            })

    })

}




//
// BUSQUEDA POR COLECCIÓN
//
app.get('/:coleccion/:termino', (req, res, next) => {


    var termino = req.params.termino
    var coleccion = req.params.coleccion
    var regExp = new RegExp( termino, 'i' )

    var promesa

    switch ( coleccion ) {
        

        case 'usuarios':
            promesa = buscarUsuarios( regExp )
        break;

        case 'medicos':
            promesa = buscarMedicos( regExp )
        break;

        case 'hospitales':
            promesa = buscarHospitales( regExp )
        break;

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'Colección de busqueda invalido. Solo se permite: usuarios, medicos, u hospitales',
                error: {
                    message: 'Tipo de colección inválida'
                }
            })

    }

    // resultado puede ser el listado de usuarios, medicos u hospitales
    promesa.then( data => {

        // propiedades de objeto computadas/procesadas
        // en la propiedad coleccion tenemos el valor
        // si busca por usuarios, medicos u hospitales
        // [coleccion], que use el valor de esa propiedad

        res.status(200).json({
            ok: true,
            [coleccion]: data
        })

    })

})






module.exports = app;