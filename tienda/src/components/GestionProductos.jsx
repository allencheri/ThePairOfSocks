import React, { useState, useEffect } from "react";

export const GestionProductos = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    descripcion: "",
    color: "",
    talla: "",
    material: "",
  });
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null); // Producto seleccionado para editar
  const [imagenCargada, setImagenCargada] = useState(false); // Para verificar si la imagen fue subida
  const [file, setFile] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("Datos no válidos recibidos");
        }
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  // Gestionamos el cambio de archivo
  const handleImageChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Subimos la imagen seleccionada
  // Subimos la imagen seleccionada
  const subirImg = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Archivo subido", data);
        return data.filename; // Asegúrate de que 'filename' es la clave que devuelve el backend
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
    return null; // Si no hay archivo, retorna null
  };

  // Metodo para guardar un producto
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!producto.nombre || !producto.precio) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const file = await subirImg();

    const productoConImg = {
      ...producto,
      imagen: file,
    };
    const nuevoProducto = { ...productoConImg, id: Date.now() };

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
        setProducto({
          nombre: "",
          precio: "",
          imagen: "",
          descripcion: "",
          color: "",
          talla: "",
          material: "",
        });
        setImagenCargada(false);
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto");
    }
  };

  // Metodo para modificar un producto
  const handleModificarProduct = (id) => {
    const productoParaEditar = productos.find((prod) => prod.id === id);
    setProductoEditando(productoParaEditar);
    setProducto({
      nombre: productoParaEditar.nombre,
      precio: productoParaEditar.precio,
      imagen: productoParaEditar.imagen,
      descripcion: productoParaEditar.descripcion,
      color: productoParaEditar.color,
      talla: productoParaEditar.talla,
      material: productoParaEditar.material,
    });
  };

  // Metodo para actualizar un producto
  // Metodo para actualizar un producto
  // Metodo para actualizar un producto
const handleActualizarProducto = async (event) => {
  event.preventDefault();

  if (!producto.nombre || !producto.precio) {
    alert("Por favor, completa todos los campos");
    return;
  }

  // Si no se seleccionó una nueva imagen, mantenemos la imagen anterior
  let imagenFinal = producto.imagen;

  // Si se seleccionó una nueva imagen, la subimos
  if (file) {
    imagenFinal = await subirImg();  // 'file' es el archivo de la imagen que el usuario seleccionó
  }

  const productoConImg = {
    ...producto,
    imagen: imagenFinal,  // Guardamos el nombre de la imagen o la URL de la imagen aquí
  };

  try {
    const response = await fetch(
      `http://localhost:3000/productos/${productoEditando.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoConImg),
      }
    );

    if (response.ok) {
      const updatedProduct = await response.json();
      setProductos(
        productos.map((prod) =>
          prod.id === updatedProduct.id ? updatedProduct : prod
        )
      );
      alert("Producto actualizado exitosamente");
      setProductoEditando(null);
      setProducto({ nombre: "", precio: "", imagen: "", descripcion: "", color: "", talla: "", material: "" });
      setImagenCargada(false);
    } else {
      alert("Error al actualizar producto");
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    alert("Error al actualizar producto");
  }
};


  // Metodo para eliminar un producto
  const handleDeleteProduct = async (id, imagenEliminar) => {
    console.log(id);
    console.log(imagenEliminar);
    try {
      if (imagenEliminar) {
        const responceImg = await fetch(
          `http://localhost:5000/delete/${imagenEliminar}`,
          {
            method: "DELETE",
          }
        );

        if (!responceImg.ok) {
          alert("Error al eliminar imagen");
          return;
        }
      }

      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProductos(productos.filter((prod) => prod.id !== id));
        alert("Producto eliminado");
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
      <h1 className="text-center mb-4 tituloGestion">Gestión de Productos</h1>
      <div className="card p-4 shadow-sm">
        <form
          onSubmit={productoEditando ? handleActualizarProducto : handleSubmit}
        >
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
          <div>
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control mb-2"
              id="descripcion"
              rows="3"
              value={producto.descripcion}
              onChange={(e) =>
                setProducto({ ...producto, descripcion: e.target.value })
              }
            ></textarea>
          </div>
          <div>
            <label htmlFor="color" className="form-label">
              Color
            </label>
            <input
              type="text"
              id="color"
              className="form-control mb-2"
              value={producto.color}
              onChange={(e) =>
                setProducto({ ...producto, color: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="talla" className="form-label">
              Talla
            </label>
            <input
              type="text"
              id="talla"
              className="form-control mb-2"
              value="Talla única"
              disabled
            />
          </div>
          <div>
            <label htmlFor="material" className="form-label">
              Material
            </label>
            <input
              type="text"
              id="material"
              className="form-control mb-2"
              value={producto.material}
              onChange={(e) =>
                setProducto({ ...producto, material: e.target.value })
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
              className="form-control mb-2"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {productoEditando ? "Actualizar Producto" : "Guardar Producto"}
          </button>
        </form>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Color</th>
              <th>Talla</th>
              <th>Imagen</th>
              <th>Eliminar</th>
              <th>Modificar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>{prod.descripcion}</td>
                <td>{prod.color}</td>
                <td>{prod.talla}</td>
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
                    onClick={() => handleDeleteProduct(prod.id, prod.imagen)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleModificarProduct(prod.id)}
                  >
                    <i className="fa fa-edit"></i>
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
