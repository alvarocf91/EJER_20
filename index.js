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
  .catch(err => console.error(' Error de conexión:', err));


app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <ul>
       <p>Autores:<a href="/api/autores" target="_blank">/api/autores</a></p>
       <p>Libros:<a href="/api/libros" target="_blank">/api/libros</a></p>
      </ul>
    </div>
  `);
});


app.get('/api/autores', async (req, res) => {
  try {
    const { nacionalidad } = req.query;
    const filtro = nacionalidad ? { nacionalidad: new RegExp(nacionalidad, 'i') } : {};
    const autores = await Autor.find(filtro);
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/autores/:id', async (req, res) => {
  try {
    const autor = await Autor.findOne({ referencia: req.params.id });
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/autores', async (req, res) => {
  try {
    const nuevoAutor = new Autor(req.body);
    await nuevoAutor.save();
    res.status(201).json(nuevoAutor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/autores/:id', async (req, res) => {
  try {
    const actualizado = await Autor.findOneAndUpdate(
      { referencia: req.params.id }, 
      req.body, 
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/autores/:id', async (req, res) => {
  try {
    const eliminado = await Autor.findOneAndDelete({ referencia: req.params.id });
    if (!eliminado) return res.status(404).json({ error: "Autor no encontrado" });
    res.json({ mensaje: "Autor eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/autores/:id/libros', async (req, res) => {
  try {
    const libros = await Libro.find({ autor: req.params.id });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/libros', async (req, res) => {
  try {
    let query = Libro.find();
    if (req.query.sort === 'titulo') query = query.sort({ titulo: 1 });
    const libros = await query;
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/libros/:id', async (req, res) => {
  try {
    const libro = await Libro.findOne({ referencia: req.params.id });
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/libros', async (req, res) => {
  try {
    const nuevoLibro = new Libro(req.body);
    await nuevoLibro.save();
    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/libros/:id', async (req, res) => {
  try {
    const actualizado = await Libro.findOneAndUpdate(
      { referencia: req.params.id }, 
      req.body, 
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/libros/:id', async (req, res) => {
  try {
    const eliminado = await Libro.findOneAndDelete({ referencia: req.params.id });
    if (!eliminado) return res.status(404).json({ error: "Libro no encontrado" });
    res.json({ mensaje: "Libro eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));