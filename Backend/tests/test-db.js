const { Usuario, PerfilEmpresario } = require('../Models');

async function test() {
  try {
    const id_usuario = 1; // Assuming id 1 exists for testing
    // Actualizamos Usuario
    await Usuario.update({ nombre: "Prueba", cedula: "2-9999-9997", telefono_whatsapp: "8888-8888" }, { where: { id_usuario } });

    // Actualizamos PerfilEmpresario
    await PerfilEmpresario.update(
      { sitio_web: "https://ej.com", sector: "IT", descripcion: "Test", telefono_whatsapp: "8888-8888" },
      { where: { id_usuario } }
    );
    console.log("Success");
  } catch (err) {
    console.error("FAILED:");
    console.error(err);
  }
}
test();
