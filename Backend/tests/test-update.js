const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/perfiles-empresario/perfil/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(JSON.stringify({
  nombre: "Empresario Prueba",
  cedula: "2-9999-9997",
  telefono_whatsapp: "8888-8888",
  sitio_web: "https://ejemplo.com",
  sector: "Software",
  descripcion: "Test"
}));

req.end();
