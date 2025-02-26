import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/navbar.css";

export const NavBar = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      setUsuarioLogueado(JSON.parse(usuario));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(null);
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between align-items-center"
          id="navbarNav"
        >
          <h5 className="navbar-brand text-light mb-0">
            <Link to="/" className="text-decoration-none text-light">
              <strong className="text-primary">The</strong> Pair Of Socks
            </Link>
          </h5>

          <ul className="navbar-nav d-flex justify-content-center align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/catalogo" className="nav-link text-light">
                Catálogo
              </Link>
            </li>
            {usuarioLogueado && (
              <li className="nav-item">
                <Link to="/compra" className="nav-link text-light">
                  Comprar
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/contacto" className="nav-link text-light">
                Contacto
              </Link>
            </li>
            {usuarioLogueado.tipo === "admin" && (
              <li className="nav-item">
                <Link to="/gestion-productos" className="nav-link text-light">
                  Gestión productos
                </Link>
              </li>
            )}
            {usuarioLogueado.tipo === "admin" && (
              <li className="nav-item">
                <Link to="/gestion-usuarios" className="nav-link text-light">
                  Gestión usuarios
                </Link>
              </li>
            )}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle text-light"
                type="button"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-regular fa-circle-user fa-lg"></i>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                {!usuarioLogueado && (
                  <li>
                    <Link className="dropdown-item" to="/registro">
                      Registrarse
                    </Link>
                  </li>
                )}
                {!usuarioLogueado && (
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Iniciar sesión
                    </Link>
                  </li>
                )}
                {usuarioLogueado && (
                  <li>
                    <button
                      onClick={logout}
                      className="dropdown-item btn btn-danger"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                )}
              </ul>
            </li>
            {usuarioLogueado && (
              <li className="nav-item">
                <p className="text-warning mb-0 ms-2">{usuarioLogueado.name}</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
