import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';

const ETIQUETA_JORNADA = {
  tiempo_completo: 'Tiempo completo',
  medio_tiempo: 'Medio tiempo',
  por_horas: 'Por horas',
  practica: 'Práctica',
};

const formatearSalario = (min, max) => {
  if (!min && !max) return 'A convenir';
  const fmt = (n) => `₡${Number(n).toLocaleString('es-CR')}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `Desde ${fmt(min)}`;
  return `Hasta ${fmt(max)}`;
};

export default function OfertasEmpleo() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerOfertasEmpleo(),
    [],
  );

  return (
    <>
      <div className="de-page-heading">
        <p className="de-eyebrow">Empresa</p>
        <h1>Ofertas de Empleo</h1>
        <p className="de-page-subtitle">Las posiciones que publicaste para contratar talento.</p>
        <button
          className="de-btn-primary"
          type="button"
          onClick={() => navigate('/DashboardEmpresario/publicar-empleo')}
        >
          + Publicar Oferta de Empleo
        </button>
      </div>

      <div className="de-panel">
        <EstadoDatos
          loading={loading}
          error={error}
          empty={!data.length}
          emptyText="Todavía no publicaste ofertas de empleo."
        />
        {!loading && !error && data.map((oferta) => (
          <div key={oferta.id_oferta_empleo} className="de-offer-item">
            <div className="de-offer-icon-wrap"><Briefcase size={16} /></div>
            <div className="de-offer-info">
              <p className="de-offer-title">{oferta.titulo}</p>
              <p className="de-offer-sender">
                {ETIQUETA_JORNADA[oferta.tipo_jornada] ?? oferta.tipo_jornada}
                {' · '}
                {oferta.modalidad.charAt(0).toUpperCase() + oferta.modalidad.slice(1)}
                {oferta.ubicacion ? ` · ${oferta.ubicacion}` : ''}
              </p>
            </div>
            <div className="de-offer-right">
              <span className="de-badge nueva">{oferta.estado}</span>
              <span className="de-offer-time">
                {formatearSalario(oferta.salario_min, oferta.salario_max)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
