import { Outlet } from 'react-router-dom';
import './DashboardEmpresario.css';
import DashboardLayout from './components/DashboardLayout';

export default function DashboardEmpresario() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
