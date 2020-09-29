

var express = require('express')
var path = require('path')
var fs = require('fs')

var app = express()


app.get('/:coleccion/:img', (req, res ) => {

    var coleccion = req.params.coleccion;
    var img = req.params.img

    // En __dirname obtengo la ruta en donde estoy en este momento
    // obtener la direccion de la imagen
    var pathImagen = path.resolve( __dirname, `../../uploads/${ coleccion }/${ img }` )
    // Verificar si el path es valido
    if( fs.existsSync( pathImagen) ){
        res.sendFile( pathImagen )
    } // Caso contrario que la imagen no existe
      // Retornarle la noimage.png
    else {
        var pathNoImagen = path.resolve( __dirname, `../../assets/images/noimage.png` )
        res.sendFile( pathNoImagen )
    }

    
})


module.exports = app