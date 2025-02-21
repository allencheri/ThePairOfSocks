import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="fw-bold">Enlaces rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
              <li><a href="/contacto" className="text-white text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Síguenos</h5>
            <div className="d-flex">
              <a href="https://facebook.com" className="text-white me-3">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="https://twitter.com" className="text-white me-3">
                <i className="bi bi-twitter fs-4"></i>
              </a>
              <a href="https://instagram.com" className="text-white me-3">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="https://linkedin.com" className="text-white">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Información</h5>
            <p className="small">
              Gracias por visitar nuestra página. Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.
            </p>
          </div>
        </div>
        <div className="text-center mt-4 border-top pt-3">
          <p className="small mb-0">© {new Date().getFullYear()} Todos los derechos reservados. </p>
          <p className="small">Alina Cherednichenko</p>
        </div>
      </div>
    </footer>
  )
}
