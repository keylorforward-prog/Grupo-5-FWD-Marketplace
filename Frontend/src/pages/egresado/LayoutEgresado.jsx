import Aside from '../../components/sidebar/Aside';
import Header from '../../components/Header/Header';
import './LayoutEgresado.css';

function LayoutEgresado({ children }) {
  return (
    <div className="layoutEgresado">
      <Aside />
      <div className="layoutEgresadoContenido">
        <Header />
        <main className="layoutEgresadoMain">{children}</main>
      </div>
    </div>
  );
}

export default LayoutEgresado;
