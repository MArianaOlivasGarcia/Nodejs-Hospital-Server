
var express = require('express')
var brcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var app = express()

var Usuario = require('../models/usuario')
var SEED = require('../config/config').SEED


app.post('/login', (req, res) => {
    

    var body = req.body;

    Usuario.findOne( { email: body.email }, (err, usuariodb) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if( !usuariodb ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas e'
            })
        }

        if( !body.password ){
            return res.status(400).json({
                ok: false,
                mensaje: 'El password es requerido'
            })
        }

        // Comparar la contraseña encriptada
        if( !brcrypt.compareSync( body.password, usuariodb.password ) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas p',
            })
        }


        //
        // Crear un token
        //

        usuariodb.password = undefined

                            // payload, seed, fecha expiración
        var token = jwt.sign({ usuario: usuariodb }, SEED, {expiresIn: 14400} ) // 4 horas

        res.status(200).json({
            ok: true,
            usuariodb,
            token
        })

    })


})




module.exports = app;