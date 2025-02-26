import React, { useState, useEffect } from "react";

export const GestionProductos = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });
  const [productos, setProductos] = useState([]);
  const [imagenCargada, setImagenCargada] = useState(false); // Para verificar si la imagen fue subida

  // Cargar productos al iniciar
  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Guardamos la ruta completa de la imagen
          setProducto((prev) => ({ ...prev, imagen: data.filename }));
          setImagenCargada(true); // Marcamos que la imagen fue cargada
        })
        .catch((error) => {
          console.error("Error al subir la imagen:", error);
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificamos que todos los campos estén completos y que la imagen haya sido cargada
    if (!producto.nombre || !producto.precio || !producto.imagen) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const nuevoProducto = { ...producto, id: Date.now() };

    try {
      const response = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProductos([...productos, addedProduct]);
        alert("Producto agregado exitosamente");
        setProducto({ nombre: "", precio: "", imagen: "" });
        setImagenCargada(false); // Resetear imagen cargada
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const imagen = productos.find((prod) => prod.id === id);
      console.log(imagen);
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProductos(productos.filter((prod) => prod.id !== id));
        alert("Producto eliminado");

        const response = await fetch(`http://localhost:5000/upload/${imagen.imagen}`, {
          method: "DELETE",
        });
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Gestión de Productos</h1>
      <div className="card p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={producto.nombre}
              onChange={(e) =>
                setProducto({ ...producto, nombre: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">
              Precio
            </label>
            <input
              type="number"
              id="precio"
              className="form-control"
              value={producto.precio}
              onChange={(e) =>
                setProducto({ ...producto, precio: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">
              Imagen
            </label>
            <input
              type="file"
              id="imagen"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </form>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>
                  {prod.imagen && (
                    <img
                      src={`http://localhost:5000/img/${prod.imagen}`}
                      alt="Vista previa"
                      width="50"
                      height="50"
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(prod.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
