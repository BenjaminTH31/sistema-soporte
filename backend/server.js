
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sql, poolPromise } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API del Sistema de Soporte Técnico funcionando'
  });
});

// Obtener todos los tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const pool = await poolPromise;

    const resultado = await pool.request().query(`
      SELECT
        id,
        asunto,
        solicitante,
        descripcion,
        categoria,
        prioridad,
        estado,
        fechaRegistro
      FROM dbo.Tickets
      ORDER BY id DESC
    `);

    res.json(resultado.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudieron obtener los tickets'
    });
  }
});

// Obtener un ticket por su ID
app.get('/api/tickets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El ID debe ser un número entero positivo'
      });
    }

    const pool = await poolPromise;

    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT *
        FROM dbo.Tickets
        WHERE id = @id
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    res.json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo obtener el ticket'
    });
  }
});

// Validar los datos recibidos
function validarTicket(datos) {
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = datos;

  if (
    typeof asunto !== 'string' || !asunto.trim() ||
    typeof solicitante !== 'string' || !solicitante.trim() ||
    typeof descripcion !== 'string' || !descripcion.trim() ||
    typeof categoria !== 'string' || !categoria.trim()
  ) {
    return 'Asunto, solicitante, descripción y categoría son obligatorios';
  }

  if (!['Baja', 'Media', 'Alta'].includes(prioridad)) {
    return 'La prioridad debe ser Baja, Media o Alta';
  }

  if (
    estado !== undefined &&
    !['Pendiente', 'En proceso', 'Resuelto'].includes(estado)
  ) {
    return 'El estado no es válido';
  }

  if (asunto.trim().length > 150 || solicitante.trim().length > 100) {
    return 'El asunto o solicitante supera la longitud permitida';
  }

  if (categoria.trim().length > 50) {
    return 'La categoría no puede superar los 50 caracteres';
  }

  return null;
}

// Crear un ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const errorValidacion = validarTicket(req.body);

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const {
      asunto,
      solicitante,
      descripcion,
      categoria,
      prioridad
    } = req.body;

    const pool = await poolPromise;

    const resultado = await pool.request()
      .input('asunto', sql.NVarChar(150), asunto.trim())
      .input('solicitante', sql.NVarChar(100), solicitante.trim())
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion.trim())
      .input('categoria', sql.NVarChar(50), categoria.trim())
      .input('prioridad', sql.NVarChar(20), prioridad)
      .query(`
        INSERT INTO dbo.Tickets
          (asunto, solicitante, descripcion, categoria, prioridad)
        OUTPUT INSERTED.*
        VALUES
          (@asunto, @solicitante, @descripcion, @categoria, @prioridad)
      `);

    res.status(201).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo crear el ticket'
    });
  }
});

// Editar un ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El ID debe ser un número entero positivo'
      });
    }

    const errorValidacion = validarTicket(req.body);

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const {
      asunto,
      solicitante,
      descripcion,
      categoria,
      prioridad,
      estado
    } = req.body;

    const pool = await poolPromise;

    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .input('asunto', sql.NVarChar(150), asunto.trim())
      .input('solicitante', sql.NVarChar(100), solicitante.trim())
      .input('descripcion', sql.NVarChar(sql.MAX), descripcion.trim())
      .input('categoria', sql.NVarChar(50), categoria.trim())
      .input('prioridad', sql.NVarChar(20), prioridad)
      .input('estado', sql.NVarChar(30), estado || 'Pendiente')
      .query(`
        UPDATE dbo.Tickets
        SET asunto = @asunto,
            solicitante = @solicitante,
            descripcion = @descripcion,
            categoria = @categoria,
            prioridad = @prioridad,
            estado = @estado
        WHERE id = @id;

        SELECT *
        FROM dbo.Tickets
        WHERE id = @id;
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    res.json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo actualizar el ticket'
    });
  }
});

// Eliminar un ticket
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El ID debe ser un número entero positivo'
      });
    }

    const pool = await poolPromise;

    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM dbo.Tickets
        OUTPUT DELETED.id
        WHERE id = @id
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    res.json({
      mensaje: 'Ticket eliminado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudo eliminar el ticket'
    });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
