import React, { useState, useEffect, useCallback } from "react";
import "./css/inicio.css";

export const Inicio = () => {
  const [usuario, setUsuario] = useState(
    () => JSON.parse(localStorage.getItem("usuario")) || null
  );
  const [resenas, setResenas] = useState(
    () => JSON.parse(localStorage.getItem("resenas")) || []
  );
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [valoracion, setValoracion] = useState(1);

  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const nuevaResena = {
        nombre: usuario?.name || nombre,
        comentario,
        valoracion,
        titulo,
      };
      setResenas((prev) => [...prev, nuevaResena]);
      setNombre("");
      setComentario("");
      setValoracion(1);
      setTitulo("");
    },
    [usuario, nombre, comentario, valoracion, titulo]
  );

  const eliminarResena = useCallback((index) => {
    setResenas((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div>
      <div className="imagen-fondo">
        <div className="container text-center card-inicio">
          <h1 className="text-dark display-3 fw-bold">
            {usuario ? `¡Bienvenido ${usuario.name}!` : "¡Bienvenido!"}
          </h1>
          <p className="text-dark lead">
            Explora nuestros diseños únicos y encuentra tus calcetines ideales.
          </p>
          <a href="/catalogo" className="btn btn-dark btn-lg mt-4 btn-hover">
            Empezar a Comprar
          </a>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-5 title-section">
          Reseñas de Nuestros Productos
        </h2>

        {usuario && (
          <div className="d-flex justify-content-center mb-5">
            <div className="card-form p-4">
              <h4 className="text-center mb-4">Añadir una nueva reseña</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tu Nombre</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={usuario?.name || nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={!!usuario}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control custom-input mb-2"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                
                  <label className="form-label">Comentario</label>
                  <textarea
                    className="form-control custom-input"
                    rows="3"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label">Valoración</label>
                  <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa-${
                          star <= valoracion ? "solid" : "regular"
                        } fa-star fs-4 text-warning star-hover`}
                        onClick={() => setValoracion(star)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-dark w-100 btn-hover">
                  Añadir Reseña
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-5">
          <h4 className="text-center mb-4 subtitle-section">Reseñas</h4>
          {resenas.length > 0 ? (
            <div className="resenas-list">
              {resenas.map((reseña, index) => (
                <div key={index} className="resena-item p-4 mb-3">
                  <h5 className="fw-bold">{reseña.nombre}</h5>
                  <p className="stars">
                    {[...Array(reseña.valoracion)].map((_, i) => (
                      <i
                        key={i}
                        className="fa-solid fa-star text-warning fs-5"
                      ></i>
                    ))}
                    {[...Array(5 - reseña.valoracion)].map((_, i) => (
                      <i
                        key={i}
                        className="fa-regular fa-star text-secondary fs-5"
                      ></i>
                    ))}
                  </p>
                  <hr></hr>
                  <h5 className="text-muted"><strong>{reseña.titulo}</strong></h5>
                  <p className="text-muted">{reseña.comentario}</p>
                  {usuario?.tipo === "admin" && (
                    <button
                      onClick={() => eliminarResena(index)}
                      className="btn btn-danger btn-sm btn-hover"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted lead">
              Aún no hay reseñas. Sé el primero en añadir una.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
