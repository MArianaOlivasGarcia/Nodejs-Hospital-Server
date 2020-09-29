
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var medicoSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'El nombre es requerido']
    },
    img: {
        type: String, 
        required: false
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [ true, 'El id del hospital es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }


})


module.exports = mongoose.model( 'Medico', medicoSchema )