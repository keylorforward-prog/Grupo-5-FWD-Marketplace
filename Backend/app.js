require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Config/swagger');
const sequelize = require('./Config/db');
const config = require('./Config/config');
const session = require('express-session');
const passport = require('./Config/passport');

const { ConversacionIA } = require('./Models');
// ── Rutas ──────────────────────────────────────────────────────────────────────
const authRoutes = require('./Routes/authRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');
const perfilEstudianteRoutes = require('./Routes/perfilEstudianteRoutes');
const curriculumRoutes = require('./Routes/curriculumRoutes');
const historialProyectoEstudianteRoutes = require('./Routes/historialProyectoEstudianteRoutes');
const perfilEmpresarioRoutes = require('./Routes/perfilEmpresarioRoutes');
const historialProyectoEmpresaRoutes = require('./Routes/historialProyectoEmpresaRoutes');
const propuestaRoutes = require('./Routes/propuestaRoutes');
const catalogoTecnologiaRoutes = require('./Routes/catalogoTecnologiaRoutes');
const tecnologiaPropuestaRoutes = require('./Routes/tecnologiaPropuestaRoutes');
const postulacionRoutes = require('./Routes/postulacionRoutes');
const conversacionRoutes = require('./Routes/conversacionRoutes');
const mensajeRoutes = require('./Routes/mensajeRoutes');
const proyectoPlataformaRoutes = require('./Routes/proyectoPlataformaRoutes');
const entregableRoutes = require('./Routes/entregableRoutes');
const evaluacionRoutes = require('./Routes/evaluacionRoutes');
const pagoRoutes = require('./Routes/pagoRoutes');
const reporteRoutes = require('./Routes/reporteRoutes');
const notificacionRoutes = require('./Routes/notificacionRoutes');
const ofertaRoutes = require('./Routes/ofertaRoutes');
const catalogoSectorRoutes = require('./Routes/catalogoSectorRoutes');
const dashboardEmpresarioRoutes = require('./Routes/dashboardEmpresarioRoutes');
const agentRoutes = require('./Routes/agentRoutes');
const conversacionIARoutes = require('./Routes/conversacionIARoutes');
const dashboardEgresadoRoutes = require('./Routes/dashboardEgresadoRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const app = express();

// ── Middlewares globales ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true, // Necesario para enviar/recibir cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fwd-marketplace-session',
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de passport
app.use(passport.initialize());
app.use(passport.session());






// ── Swagger docs ───────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/perfiles-estudiante', perfilEstudianteRoutes);
app.use('/api/curriculums', curriculumRoutes);
app.use('/api/historial-proyectos-estudiante', historialProyectoEstudianteRoutes);
app.use('/api/perfiles-empresario', perfilEmpresarioRoutes);
app.use('/api/historial-proyectos-empresa', historialProyectoEmpresaRoutes);
app.use('/api/propuestas', propuestaRoutes);
app.use('/api/catalogo-tecnologias', catalogoTecnologiaRoutes);
app.use('/api/tecnologias-propuesta', tecnologiaPropuestaRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/conversaciones', conversacionRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/proyectos-plataforma', proyectoPlataformaRoutes);
app.use('/api/entregables', entregableRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/ofertas', ofertaRoutes);
app.use('/api/catalogo-sectores', catalogoSectorRoutes);
app.use('/api/dashboard-empresario', dashboardEmpresarioRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/conversaciones-ia', conversacionIARoutes);
app.use('/api/dashboard-egresado', dashboardEgresadoRoutes);
app.use('/api/admin', adminRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 FWD Marketplace API corriendo correctamente',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ── Error global handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('========== ERROR NO MANEJADO ==========');
  console.error(err);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// ── Inicio ─────────────────────────────────────────────────────────────────────
const PORT = config.server.port;

const startServer = async () => {
  try {
    // 1. Verificar conexión a la base de datos a través de Sequelize
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente con Sequelize.');

    // Limpiar conversaciones en progreso de IA al inicio
    try {
      const [updatedRows] = await ConversacionIA.update(
        { estado: 'abandonada' },
        { where: { estado: 'en_progreso' } }
      );
      if (updatedRows > 0) {
        console.log(`🧹 Se limpiaron ${updatedRows} conversaciones de IA interrumpidas.`);
      }
    } catch (e) {
      console.error('Error limpiando conversaciones de IA al inicio:', e.message);
    }

    // 2. Levantar el servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Swagger docs en  http://localhost:${PORT}/api-docs\n`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

startServer();
