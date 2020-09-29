

var mongoose = require('mongoose')

// Importar plugins adicionales
var mongoosePaginate = require('mongoose-paginate-v2')
var uniqueValidator = require('mongoose-unique-validator')



// Funcion para definir schemas
var Schema = mongoose.Schema


// Roles validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


// Definir el schema
var usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'El nombre es requerido' ]
    },

    email: {
        type: String,
        required: [ true, 'El email es requerido' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es requerida' ],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },



})

// Asignarle plugins
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' })
usuarioSchema.plugin( mongoosePaginate )

module.exports = mongoose.model( 'Usuario', usuarioSchema )