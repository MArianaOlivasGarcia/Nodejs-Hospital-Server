
var jtw = require('jsonwebtoken')

var SEED = require('../config/config').SEED

// Vefificacion del token

exports.verificaToken = function( req, res, next ) {


    var token = req.query.token

    jtw.verify( token, SEED, (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                errors: err
            })
        }

        // Enviar / Recuperar el decoded
        req.decoded = decoded
        
        next()
    })


}