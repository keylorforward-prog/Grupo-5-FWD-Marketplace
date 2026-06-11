export const mockProjects = [
  {
    id: 1,
    name: 'Sistema de Inventario',
    status: 'En recepcion de ofertas',
    statusType: 'recepcion',
    meta: '15 ofertas recibidas - Cierra en 5 dias',
    icon: '📦',
    iconColor: 'blue',
    action: 'Ver Ofertas',
  },
  {
    id: 2,
    name: 'Pagina Web Restaurante',
    status: 'En desarrollo',
    statusType: 'desarrollo',
    meta: 'Estudiante: Juan Perez - Inicio: 20 may 2024',
    icon: '🌐',
    iconColor: 'orange',
    action: 'Ver Progreso',
  },
  {
    id: 3,
    name: 'Dashboard de Ventas',
    status: 'Finalizado',
    statusType: 'finalizado',
    meta: 'Finalizado el 12 may 2024 - Calificado',
    icon: '📊',
    iconColor: 'green',
    action: 'Ver Entregables',
  },
];

export const mockTalent = [
  {
    id: 1,
    name: 'Maria Gonzalez',
    verified: true,
    skills: 'React - Node.js - TypeScript',
    rating: 4.9,
    projects: 28,
    match: 95,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Carlos Vargas',
    verified: true,
    skills: 'Python - IA - Machine Learning',
    rating: 4.8,
    projects: 19,
    match: 91,
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

export const mockOffers = [
  { id: 1, title: 'App Movil para Delivery', sender: 'Ana Lopez', time: 'Hoy' },
  { id: 2, title: 'Dashboard RH', sender: 'Jose Mora', time: 'Ayer' },
  { id: 3, title: 'Sitio Web Corporativo', sender: 'Laura Ruiz', time: 'Ayer' },
];

export const mockDeliverables = [
  {
    id: 1,
    name: 'Sistema POS - Version 1.0',
    meta: 'Juan Perez - Entregable final',
    status: 'Pendiente de revision',
  },
  {
    id: 2,
    name: 'Dashboard Financiero',
    meta: 'Maria Gonzalez - Entregable parcial',
    status: 'Pendiente de revision',
  },
  {
    id: 3,
    name: 'Landing Page Marketing',
    meta: 'Carlos Vargas - Entregable final',
    status: 'Pendiente de revision',
  },
];

export const mockMessages = [
  {
    id: 1,
    name: 'Juan Perez',
    preview: 'Ya termine el modulo de autenticacion, adjunto avances del proyecto.',
    time: '10:30 AM',
    unread: true,
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 2,
    name: 'Ana Lopez',
    preview: 'Tengo una consulta sobre el diseno de la pantalla de inicio.',
    time: 'Ayer',
    unread: false,
    avatar: 'https://i.pravatar.cc/150?img=26',
  },
  {
    id: 3,
    name: 'Maria Gonzalez',
    preview: 'Te envie el plan de trabajo actualizado.',
    time: '2 dias',
    unread: false,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
];

export const mockNotifications = [
  {
    id: 1,
    text: 'El proyecto "E-commerce" recibio una nueva oferta.',
    time: 'Hace 10 minutos',
    icon: '📩',
    iconType: 'blue',
  },
  {
    id: 2,
    text: 'Entregable final disponible para revision.',
    time: 'Hace 1 hora',
    icon: '📋',
    iconType: 'green',
  },
  {
    id: 3,
    text: 'Nuevo mensaje de Ana Lopez en el proyecto "App Movil para Delivery".',
    time: 'Hace 2 horas',
    icon: '💬',
    iconType: 'purple',
  },
  {
    id: 4,
    text: 'El proyecto "Sistema de Inventario" esta proximo a cerrar la recepcion de ofertas.',
    time: 'Hace 3 horas',
    icon: '⏰',
    iconType: 'orange',
  },
];
