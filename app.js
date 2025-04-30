const express = require('express');
const app = express();
const PORT = 3000;

// Importar la base de datos y el modelo Task
const sequelize = require('./database');
const Task = require('./models/task');

// Middleware para procesar JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API To-Do List funcionando!');
});

// Ruta: GET /tasks → devuelve todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Ruta: POST /tasks → crear nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const nuevaTarea = await Task.create({ title, description });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});
app.get('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  });

  app.put('/tasks/:id', async (req, res) => {
    try {
      const { title, description, completed } = req.body;
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (completed !== undefined) task.completed = completed;
  
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
  });
  
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      await task.destroy();
      res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
  });
// Conectar con la base de datos y sincronizar el modelo
sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada y modelo sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
  });
// Middleware para manejar rutas no existentes
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });
  