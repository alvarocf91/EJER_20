const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
  referencia: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  nacionalidad: String,
  fechaNacimiento: Date,
  imagenUrl: String
});

module.exports = mongoose.model('Autor', autorSchema, 'autores');