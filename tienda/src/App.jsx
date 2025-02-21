import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Inicio } from './components/Inicio';
import { Login } from './components/Login';
import { Registro } from './components/Registro';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Catalogo } from './components/Catalogo';
import { Compra } from './components/Compra';
import { Contacto } from './components/Contacto';
import { GestionProductos } from './components/GestionProductos';


function App() {
  return (
    <Router className="container"> 
      <NavBar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/compra" element={<Compra />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/gestion-productos" element={<GestionProductos />} />
      </Routes>
      <Footer className="footer" />
    </Router>
  );
}

export default App;
