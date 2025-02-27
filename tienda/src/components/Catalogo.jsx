import React, { useState, useEffect } from 'react';
import { Carrito } from './Carrito';
import './css/catalogo.css';
import Swal from 'sweetalert2';


export const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [usuario, setUsuario] = useState(null);


  // Obtenemos el usuario guardado en localStorage cada vez que se renderiza la página
  useEffect(() => {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || null;
    setUsuario(usuarioLogueado);

    if (usuarioLogueado) {
      const carritoGuardado = JSON.parse(localStorage.getItem(`carrito_${usuarioLogueado.email}`)) || {};
      setCarrito(carritoGuardado);
    }

    // Obtenemos los productos del servidor
    const getProductos = async () => {
      const response = await fetch('http://localhost:3000/productos');
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

    

  // Incrementamos la cantidad del producto seleccionado +
  const incrementarCantidad = (id) => {
    setCantidades({ ...cantidades, [id]: cantidades[id] + 1 });
  };


  // Decrementamos la cantidad del producto seleccionado -
  const decrementarCantidad = (id) => {
    if (cantidades[id] > 1) {
      setCantidades({ ...cantidades, [id]: cantidades[id] - 1 });
    }
  };


  // Agregamos el producto seleccionado al carrito
  const agregarAlCarrito = (producto) => {

    // Si el usuario no está logueado, mostramos un mensaje de alerta
    if (!usuario) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir productos al carrito.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión"
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    const cantidad = cantidades[producto.id] || 1;

    // Actualizamos el estado del carrito
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[producto.id]) {
        nuevoCarrito[producto.id].cantidad += cantidad;
      } else {
        nuevoCarrito[producto.id] = { ...producto, cantidad };
      }

      localStorage.setItem(`carrito_${usuario.email}`, JSON.stringify(nuevoCarrito));
      
      mostrarAlerta("¡Felicidades!", "¡Se ha añadido el producto a tu carrito!", "success");

      return nuevoCarrito;
    });
  };


  // Mostramos un mensaje de alerta con el título, el mensaje y el icono
  const mostrarAlerta = (titulo, mensaje, icono) => {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
    });
  };

  const cantidadTotalProductos = Object.values(carrito).reduce((total, item) => total + item.cantidad, 0);


  // Finalizamos la compra
  const finalizarCompra = () => {
    window.location.href = "/compra";

  };

  return (
    <div className="container py-5">
      
      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card card-catalogo border-0 shadow">
              <img src={"http://localhost:5000/img/" + producto.imagen} alt="Vista previa" className='prod-img'/> 
              <div className="card-body text-center">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.precio} €</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                  <button className="btn btn-outline-secondary" onClick={() => decrementarCantidad(producto.id)}>-</button>
                  <input
                    type="number"
                    className="form-control text-center mx-2"
                    style={{ width: '50px' }}
                    min="1"
                    value={cantidades[producto.id] || 1}
                    readOnly
                  />
                  <button className="btn btn-outline-secondary" onClick={() => incrementarCantidad(producto.id)}>+</button>
                </div>

                <button className="btn btn-primary w-100" onClick={() => agregarAlCarrito(producto)}>
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mb-3 position-fixed top-0 end-0 m-3" data-bs-toggle="modal" data-bs-target="#carritoModal">
      <i className="fa fa-cart-shopping me-2"></i>

        <span>{cantidadTotalProductos}</span>
      </button>

      <Carrito carrito={Object.values(carrito)} setCarrito={setCarrito} finalizarCompra={finalizarCompra} />
    </div>
  );
};
