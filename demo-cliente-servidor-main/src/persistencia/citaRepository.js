// Acceso a datos de citas. Todo el SQL de la tabla citas vive en este módulo.
const pool = require('./db');
const { ErrorDeNegocio } = require('../dominio/reglasDeAgenda'); //cambio

async function listarTodas() {
  const resultado = await pool.query(
    `SELECT c.id, c.paciente, c.fecha_hora, p.nombre AS profesional
       FROM citas c
       JOIN profesionales p ON p.id = c.profesional_id
      ORDER BY c.fecha_hora`
  );
  return resultado.rows;
}

async function guardar({ paciente, profesional_id, fecha_hora }) {
  try {
    const resultado = await pool.query(
      `INSERT INTO citas (paciente, profesional_id, fecha_hora)
       VALUES ($1, $2, $3) RETURNING id`,
      [paciente, profesional_id, fecha_hora]
    );
    return resultado.rows[0].id;
  } catch (error) {
    // Si Postgres detecta que el horario ya está ocupado, devuelve el código 23505
    if (error.code === '23505') {
      throw new ErrorDeNegocio(
        'AGENDA_OCUPADA', 
        'Regla del servidor: ese profesional ya tiene una cita a esa hora'
      );
    }
    throw error; // Si es un error distinto (ej. se cayó la red), lo deja pasar
  }
}

// Recuerda quitar existeEnHorario del exports
module.exports = { listarTodas, guardar };