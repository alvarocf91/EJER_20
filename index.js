const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Autor = require('./models/Autor');
const Libro = require('./models/Libro');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));


app.get('/api/autores', async (req, res) => {
  const { nacionalidad } = req.query;
  const filtro = nacionalidad ? { nacionalidad: new RegExp(nacionalidad, 'i') } : {};
  const autores = await Autor.find(filtro);
  res.json(autores);
});

app.get('/api/autores/:id', async (req, res) => {
  const autor = await Autor.findById(req.params.id);
  res.json(autor);
});

app.post('/api/autores', async (req, res) => {
  const nuevoAutor = new Autor(req.body);
  await nuevoAutor.save();
  res.status(201).json(nuevoAutor);
});

app.put('/api/autores/:id', async (req, res) => {
  const actualizado = await Autor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});

app.delete('/api/autores/:id', async (req, res) => {
  await Autor.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Autor eliminado" });
});

app.get('/api/autores/:id/libros', async (req, res) => {
  const autor = await Autor.findById(req.params.id);
  if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
  const libros = await Libro.find({ autor: autor.referencia });
  res.json(libros);
});

app.get('/api/libros', async (req, res) => {
  let query = Libro.find();
  if (req.query.sort === 'titulo') query = query.sort({ titulo: 1 });
  const libros = await query;
  res.json(libros);
});

app.get('/api/libros/:id', async (req, res) => {
  const libro = await Libro.findById(req.params.id);
  res.json(libro);
});


app.post('/api/libros', async (req, res) => {
  const nuevoLibro = new Libro(req.body);
  await nuevoLibro.save();
  res.status(201).json(nuevoLibro);
});


app.put('/api/libros/:id', async (req, res) => {
  const actualizado = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});

app.delete('/api/libros/:id', async (req, res) => {
  await Libro.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Libro eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));