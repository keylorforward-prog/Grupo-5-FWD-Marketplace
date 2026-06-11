import React from 'react';
import { XCircle } from 'lucide-react';

const DangerZone = () => {
  return (
    <div className="danger-zone">
      <div className="danger-info">
        <h3><XCircle size={24} /> Zona de Peligro</h3>
        <p>Estas acciones son irreversibles. Por favor procede con precaución.</p>
      </div>
      <button className="btn-danger-outline">
        Desactivar Empresa
      </button>
    </div>
  );
};

export default DangerZone;
