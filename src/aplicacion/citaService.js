// Casos de uso de citas: coordinan las reglas del dominio y los repositorios.
const reglas = require('../dominio/reglasDeAgenda');
const citaRepository = require('../persistencia/citaRepository');
const profesionalRepository = require('../persistencia/profesionalRepository');

async function consultarCitas() {
  return citaRepository.listarTodas();
}

async function consultarProfesionales() {
  return profesionalRepository.listarTodos();
}

async function reservarCita(datos) {
  // 1. Validaciones en memoria (0 ms)
  reglas.validarDatosCompletos(datos);
  reglas.validarFechaFutura(datos.fecha_hora);

  // 2. Intento directo de guardado (1 solo viaje por la red)
  // Si choca, el repository lanzará automáticamente el error AGENDA_OCUPADA
  const id = await citaRepository.guardar(datos);
  
  return { mensaje: 'Cita creada', id };
}

module.exports = { consultarCitas, consultarProfesionales, reservarCita };
