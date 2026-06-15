import { Outlet } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

export default function DashboardEgresado() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
