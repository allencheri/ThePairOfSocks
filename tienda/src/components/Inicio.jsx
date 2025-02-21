import React, { useState, useEffect, useCallback } from 'react';
import './css/inicio.css';

export const Inicio = () => {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem("usuario")) || null);
  const [resenas, setResenas] = useState(() => JSON.parse(localStorage.getItem("resenas")) || []);
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [valoracion, setValoracion] = useState(1);

  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const nuevaResena = {
      nombre: usuario.name, 
      comentario,
      valoracion
    };
    setResenas((prev) => [...prev, nuevaResena]);
    setNombre('');
    setComentario('');
    setValoracion(1);
  }, [usuario, nombre, comentario, valoracion]);

  const eliminarResena = useCallback((index) => {
    setResenas((prev) => prev.filter((_, i) => i !== index));
  });

  return (
    <div>
      <div className="imagen-fondo">
        <div className="container text-center card-inicio">
          <h1 className="text-dark">{usuario ? `¡Bienvenido ${usuario.name}!` : "¡Bienvenido!"}</h1>
          <p className="text-dark">Explora nuestros diseños únicos y encuentra tus calcetines ideales.</p>
          <a href="/catalogo" className="btn btn-dark btn-lg mt-4">Empezar a Comprar</a>
        </div>
      </div>
    
      <div className="container py-5">
        <h2 className="text-center mb-4">Reseñas de Nuestros Productos</h2>

        <div className="d-flex justify-content-center">

          {usuario && (
          <div className="card mb-4 p-4 shadow-lg w-50">
            <h4 className="text-center">Añadir una nueva reseña</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tu Nombre</label>
                <input type="text" className="form-control" value={usuario?.name || nombre} onChange={(e) => setNombre(e.target.value)} required disabled={!!usuario} />
              </div>

              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea className="form-control" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Valoración</label>
                <div className="d-flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <i key={star} className={`fa${star <= valoracion ? 's' : 'r'} fa-star fs-4 text-warning`} style={{ cursor: "pointer" }} onClick={() => setValoracion(star)}></i>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-dark w-100">Añadir Reseña</button>
            </form>
          </div>
          )}

        </div>

        <div className="mt-5">
          <h4 className="text-center">Reseñas</h4>
          {resenas.length > 0 ? (
            <div className="list-group">
              {resenas.map((reseña, index) => (
                <div key={index} className="list-group-item mb-3 shadow-sm p-3 rounded">
                  <h5>{reseña.nombre}</h5>
                  <p>
                    {[...Array(reseña.valoracion)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star text-warning fs-5"></i>
                    ))}
                    {[...Array(5 - reseña.valoracion)].map((_, i) => (
                      <i key={i} className="fa-regular fa-star text-secondary fs-5"></i>
                    ))}
                  </p>
                  <p>{reseña.comentario}</p>
                  {usuario?.tipo === "admin" && (
                    <button onClick={() => eliminarResena(index)} className="btn btn-sm btn-danger">Eliminar</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Aún no hay reseñas. Sé el primero en añadir una.</p>
          )}
        </div>
      </div>
    </div>
  );
};
