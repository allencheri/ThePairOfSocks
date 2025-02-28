import React, { useState, useEffect } from "react";
import { Carrito } from "./Carrito";
import "./css/catalogo.css";
import Swal from "sweetalert2";

export const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoInfo, setProductoInfo] = useState({}); 
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario")) || null;
    setUsuario(usuarioLogueado);

    if (usuarioLogueado) {
      const carritoGuardado =
        JSON.parse(localStorage.getItem(`carrito_${usuarioLogueado.email}`)) ||
        {};
      setCarrito(carritoGuardado);
    }
    

    const getProductos = async () => {
      const response = await fetch("http://localhost:3000/productos");
      const productos = await response.json();
      setProductos(productos);
      const cantidadesIniciales = productos.reduce((acc, producto) => {
        acc[producto.id] = 1;
        return acc;
      }, {});
      setCantidades(cantidadesIniciales);
    };
    getProductos();
  }, []);

  const incrementarCantidad = (id) => {
    setCantidades({ ...cantidades, [id]: cantidades[id] + 1 });
  };

  const decrementarCantidad = (id) => {
    if (cantidades[id] > 1) {
      setCantidades({ ...cantidades, [id]: cantidades[id] - 1 });
    }
  };

  const agregarAlCarrito = (producto) => {
    if (!usuario) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir productos al carrito.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    const cantidad = cantidades[producto.id] || 1;
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[producto.id]) {
        nuevoCarrito[producto.id].cantidad += cantidad;
      } else {
        nuevoCarrito[producto.id] = { ...producto, cantidad };
      }

      localStorage.setItem(
        `carrito_${usuario.email}`,
        JSON.stringify(nuevoCarrito)
      );

      mostrarAlerta(
        "¡Felicidades!",
        "¡Se ha añadido el producto a tu carrito!",
        "success"
      );

      return nuevoCarrito;
    });
  };

  const mostrarAlerta = (titulo, mensaje, icono) => {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
    });
  };

  const cantidadTotalProductos = Object.values(carrito).reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const finalizarCompra = () => {
    window.location.href = "/compra";
  };

  const abrirModalEdicion = (producto) => {
    setProductoInfo({
      nombre: producto.nombre || "",
      precio: producto.precio || "",
      imagen: producto.imagen || "",
      descripcion: producto.descripcion || "Sin descripción",
      color: producto.color || "Sin colores", // Evita errores al hacer split
      talla: producto.talla || "Sin talla",
      material: producto.material || "Sin material",
    });
    setShowModal(true);
  };

  return (
    <div className="container py-5">
      <div>
        <h1 className="text-primary mb-5">Todos los productos</h1>
      </div>
      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card card-catalogo border-0 shadow">
              <img
                onClick={() => abrirModalEdicion(producto)}
                src={"http://localhost:5000/img/" + producto.imagen}
                alt="Vista previa"
                className="prod-img"
              />
              <div className="card-body text-center">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.precio} €</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => decrementarCantidad(producto.id)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center mx-2"
                    style={{ width: "50px" }}
                    min="1"
                    value={cantidades[producto.id] || 1}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => incrementarCantidad(producto.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Añadir al carrito
                </button>
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  Más Información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary mb-3 position-fixed top-0 end-0 m-3"
        data-bs-toggle="modal"
        data-bs-target="#carritoModal"
      >
        <i className="fa fa-cart-shopping me-2"></i>
        <span>{cantidadTotalProductos}</span>
      </button>

      <Carrito
        carrito={Object.values(carrito)}
        setCarrito={setCarrito}
        finalizarCompra={finalizarCompra}
      />

      {/* VENTANA MODAL DE INFORMACIÓN DEL PRODUCTO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className="modal-content-wrapper">
              <div className="modal-image-section">
                <h3 className="modal-product-title mb-4">Información del producto</h3>
                <img
                  src={"http://localhost:5000/img/" + productoInfo.imagen}
                  alt={productoInfo.nombre}
                  className="modal-product-image"
                />
              </div>
              <div className="modal-info-section">
                <h5 className="modal-product-title">{productoInfo.nombre}</h5>
                <p className="modal-product-price">{productoInfo.precio} €</p>
                <div className="modal-info-item">
                  <span className="modal-info-label">Descripción:</span>
                  <p className="modal-info-text">{productoInfo.descripcion}</p>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Colores:</span>
                  <p className="modal-info-text">{productoInfo.color}</p>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Talla:</span>
                  <p className="modal-info-text">{productoInfo.talla}</p>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Material:</span>
                  <p className="modal-info-text">{productoInfo.material}</p>
                </div>
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={() => agregarAlCarrito(productoInfo)}

                >
                  
                  Añadir al carrito
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
