import Header from '../../../components/Header/Header';
import HeroSection from './components/HeroSection';
import QuickCategories from './components/QuickCategories';
import FilterSidebar from './components/FilterSidebar';
import ProjectGrid from './components/ProjectGrid';
import './styles/DashboardEgresado.css';

const proyectosSimulados = [
  {
    id: 1,
    titulo: 'E-commerce con Next.js',
    estado: 'ACTIVO',
    descripcion: 'Desarrollo de tienda online con carrito de compras, pagos y panel de administración.',
    tecnologias: ['Next.js', 'React', 'Stripe', 'Tailwind CSS'],
    presupuesto: '$1,200 - $1,800',
    entrega: '7 - 14 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png',
    tipoEstado: 'activo'
  },
  {
    id: 2,
    titulo: 'Dashboard de Analíticas',
    estado: 'ACTIVO',
    descripcion: 'Dashboard interactivo para visualización de datos financieros y métricas de negocio.',
    tecnologias: ['React', 'TypeScript', 'Chart.js', 'Node.js'],
    presupuesto: '$2,000 - $3,200',
    entrega: '10 - 20 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/1541/1541433.png',
    tipoEstado: 'activo'
  },
  {
    id: 3,
    titulo: 'App Móvil de Tareas',
    estado: 'PENDIENTE',
    descripcion: 'Aplicación móvil para gestión de tareas y colaboración en equipo.',
    tecnologias: ['React Native', 'Firebase', 'Redux'],
    presupuesto: '$800 - $1,200',
    entrega: '5 - 10 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/5655/5655312.png',
    tipoEstado: 'pendiente'
  },
  {
    id: 4,
    titulo: 'API para Gestión de Usuarios',
    estado: 'ACTIVO',
    descripcion: 'API REST segura con autenticación JWT y roles de usuario.',
    tecnologias: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    presupuesto: '$600 - $1,000',
    entrega: '5 - 12 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111288.png',
    tipoEstado: 'activo'
  },
  {
    id: 5,
    titulo: 'Landing Page Corporativa',
    estado: 'PENDIENTE',
    descripcion: 'Diseño y desarrollo de landing page moderna y responsiva.',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    presupuesto: '$300 - $600',
    entrega: '3 - 7 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png',
    tipoEstado: 'pendiente'
  },
  {
    id: 6,
    titulo: 'Sistema de Autenticación',
    estado: 'ACTIVO',
    descripcion: 'Implementación de autenticación social y verificación en dos pasos.',
    tecnologias: ['Next.js', 'Auth0', 'PostgreSQL'],
    presupuesto: '$500 - $900',
    entrega: '4 - 9 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/6301/6301509.png',
    tipoEstado: 'activo'
  }
];

function DashboardEgresado() {
  return (
    <div className="contenedorDashboard">
      <Header />

      <main className="contenidoPrincipal">
        <HeroSection />
        <QuickCategories />

        <section className="seccionListado">
          <FilterSidebar />
          <ProjectGrid proyectos={proyectosSimulados} />
        </section>
      </main>
    </div>
  );
}

export default DashboardEgresado;
