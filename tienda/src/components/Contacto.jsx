import React from "react";

export const Contacto = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <h1 className="display-4 mb-4 text-primary">Contacto</h1>
          <h2 className="h4 mb-3">Información de la tienda</h2>
          <p className="mb-1">Avenida de Galicia, 101,</p>
          <p className="mb-1">36216 Vigo, Pontevedra</p>
          <p className="mb-1">España</p>
          <p className="mb-1">Teléfono: +34 650 00 00 00</p>
          <p className="mb-3">Correo: info@miservicio.com</p>
          <p className="text-muted">O puede rellenar el formulario a continuación.</p>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-lg p-4">
            <h3 className="h5 mb-4 ">Formulario de contacto</h3>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" placeholder="Tu nombre" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Tu correo electrónico" />
              </div>
              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                <textarea className="form-control" id="mensaje" rows="4" placeholder="Tu mensaje"></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Enviar</button>
            </form>
          </div>
        </div>

        <div className="col-12 mt-4 rounded-3 shadow-sm p-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12011.840413612465!2d-8.690004771019685!3d42.251394451294765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2e79b0781eeb99%3A0x5ffed636def2ac07!2sAvenida%20de%20Galicia%2C%20101%2C%2036216%20Vigo%2C%20Pontevedra!5e0!3m2!1ses!2ses!4v1675966589843!5m2!1ses!2ses"
            width="100%" 
            height="400" 
          ></iframe>
        </div>
      </div>
    </div>
  );
};
