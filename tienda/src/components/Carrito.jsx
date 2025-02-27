import React, { useState, useEffect } from "react";

export const Carrito = ({ carrito, setCarrito, finalizarCompra }) => {

  // Guardamos estado del usuario en localStorage
  const [usuario, setUsuarioGuardado] = useState(null);

  // Guardamos el estado de cantidades del carrito
  const [cantidades, setCantidades] = useState({});


  // Obtenemos el usuario guardado en localStorage cada vez que se renderiza la página
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioGuardado) {
      setUsuarioGuardado(usuarioGuardado);
    }

  // Inicializamos el estado de cantidades del carrito
    const cantidadesIniciales = {};
    Object.values(carrito).forEach((item) => {
      cantidadesIniciales[item.id] = item.cantidad;
    });
    setCantidades(cantidadesIniciales);
  }, [carrito]);

  // Calculamos el total del carrito
  const calcularTotal = () => {
    return Object.values(carrito)
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2); // Arreglamos el formato de la cantidad
  };


  // Actualizamos el estado del carrito
  const actualizarCarrito = (id, nuevaCantidad) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };

      if (nuevaCantidad > 0) {
        nuevoCarrito[id] = { ...nuevoCarrito[id], cantidad: nuevaCantidad };
      } else {
        delete nuevoCarrito[id];
      }

      localStorage.setItem(
        `carrito_${usuario?.email}`,
        JSON.stringify(nuevoCarrito)
      );
      return nuevoCarrito;
    });

    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: nuevaCantidad,
    }));
  };


  // Incrementamos la cantidad del producto seleccionado +
  const incrementarCantidad = (id) => {
    const nuevaCantidad = (cantidades[id] || 1) + 1;
    actualizarCarrito(id, nuevaCantidad);
  };


  // Decrementamos la cantidad del producto seleccionado -
  const decrementarCantidad = (id) => {
    if (cantidades[id] > 1) {
      const nuevaCantidad = cantidades[id] - 1;
      actualizarCarrito(id, nuevaCantidad);
    }
  };

  // Eliminamos el producto seleccionado del carrito
  const eliminarProducto = (id) => {
    actualizarCarrito(id, 0);
  };

  return (
    <div
      className="modal fade"
      id="carritoModal"
      tabIndex="-1"
      aria-labelledby="carritoModalLabel"
      aria-hidden="true"
    >

      {/* Ventana modal para mostrar el carrito */}
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-warning text-white">
            <h5 className="modal-title" id="carritoModalLabel">
              Tu Carrito
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            
            {Object.keys(carrito).length === 0 ? (
              <p className="text-center text-muted">Tu carrito está vacío.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-center">Precio</th>
                      <th className="text-end">Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(carrito).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={"http://localhost:5000/img/" + item.imagen}
                              alt={item.nombre}
                              className="me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "8px",
                              }}
                            />
                            <span>{item.nombre}</span>
                          </div>
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center align-items-center">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => decrementarCantidad(item.id)}
                            >
                              {" "}
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center mx-2"
                              style={{ width: "50px" }}
                              min="1"
                              value={cantidades[item.id] || 1}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => incrementarCantidad(item.id)}
                            >
                              {" "}
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-center">{item.precio} €</td>
                        <td className="text-end">
                          {(item.precio * item.cantidad).toFixed(2)} €
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarProducto(item.id)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {Object.keys(carrito).length > 0 && (
            <div className="modal-footer d-flex justify-content-between">
              <h5>
                Total: <strong>{calcularTotal()} €</strong>
              </h5>
              {usuario && (
                <button className="btn btn-warning" onClick={finalizarCompra}>
                  Finalizar Compra
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
