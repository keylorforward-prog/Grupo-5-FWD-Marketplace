import { Download } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function AdminExportButton({ tipo, label = 'Exportar CSV' }) {
  const descargar = async () => {
    const blob = await adminService.exportCsv(tipo);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tipo}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button className="admin-action-button neutral" type="button" onClick={descargar}>
      <Download size={14} />
      {label}
    </button>
  );
}
