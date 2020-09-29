
var express = require('express')
var fileUpload = require('express-fileupload')
var fs = require('fs')

var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')

var app = express()

app.use( fileUpload() )


app.put('/:coleccion/:id', ( req, res, next ) => {

    var coleccion = req.params.coleccion
    var id = req.params.id


    // Colecciones validas
    var coleccionesValidas = ['hospitales', 'usuarios', 'medicos']

    if( coleccionesValidas.indexOf( coleccion ) < 0 ){

        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no válida',
            errors: {
                message: 'Las colecciones validas son ' + coleccionesValidas.join(', ')
            }
        })

    }



    if( !req.files ){

        return res.status(400).json({
            ok: false,
            mensaje: 'No se selecciono un archivo',
            errors: {
                message: 'Debe de seleccionar una imagen'
            }
        })

    }

    var archivo = req.files.imagen
    /* El nombre del archivo seleccionado lo voy a cortar 
    cada que haya un punto.
    El split devuelve un arreglo con todas las palabras */
    var nombreCortado = archivo.name.split('.')
    /* La extension la optengo en la ultima posicion del arreglo */
    var extension = nombreCortado[ nombreCortado.length -1 ]


    // Extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    // Si la extension no corresponde a alguna posicion 
    // del arreglo de extensiones validas retorna un -1
    if( extensionesValidas.indexOf( extension ) < 0 ){

        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(', ')
            }
        })

    }

    // Nombrar la foto
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Mover la foto a la carpeta
    var path = `./uploads/${ coleccion }/${ nombreArchivo }`

    
    subirPorColeccion( coleccion, id, nombreArchivo, archivo, path, res )


})


// Mover la foto a la carpeta
function moverArchivo( archivo, path ){

    archivo.mv( path, ( err ) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al subir archivo',
                errors: err
            })
        }

    })

}



// Método que asigna la imagen
function subirPorColeccion( coleccion, id, nombreArchivo, archivo, path, res){

    if( coleccion === 'usuarios' ){

        Usuario.findById( id, ( err, usuariodb ) => {


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
            
            // Si si existe muevo la foto a la carpeta
            moverArchivo(archivo, path )

            // Obtener el path viejo de la imagen antigua del usuario para borrarla
            var pathViejo = `./uploads/usuarios/${ usuariodb.img }`
            
            // Usando el FileSystem de node
            // Verificar que el archivo exista
            if( fs.existsSync( pathViejo ) ){
                // Borrar el archivo
                fs.unlinkSync( pathViejo )
            }

            usuariodb.img = nombreArchivo

            usuariodb.save( (err, usuarioActualizado ) => {

                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al subir imagen del usuario',
                        errors: err
                    })
                }

                // Ocultar la contraseña antes de mostrarla
                usuarioActualizado.password = undefined;

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                    
                })

            })
           

        })

    } 


    if (coleccion === 'medicos') {

        // Los mismo que usaurios solo que con medicos
        
    }

    if (coleccion === 'hospitales') {

        // Los mismo que usaurios solo que con hospitales
       
    }




    

    
   
   

}

module.exports = app;

