import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const Compra = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState({});
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        fetch("http://localhost:3000/productos")
            .then((response) => response.json())
            .then((data) => setProductos(data))
            .catch((error) => console.error("Error al cargar los productos: ", error));

        if (usuario) {
            const carritoGuardado = JSON.parse(localStorage.getItem(`carrito_${usuario.email}`)) || {};
            setCarrito(carritoGuardado);
        }
    }, [usuario]);

    useEffect(() => {
        const totalCompra = Object.values(carrito).reduce(
            (acc, producto) => acc + producto.precio * producto.cantidad,
            0
        );
        setTotal(totalCompra);
    }, [carrito]);

    const confirmarCompra = () => {
        if (Object.keys(carrito).length === 0) {
            alert("No has agregado productos al carrito.");
            return;
        }

        if (!usuario) {
            alert("Debes iniciar sesión para finalizar la compra.");
            navigate("/login");
            return;
        }

        alert("Compra confirmada, ¡Gracias por tu compra!");

        localStorage.removeItem(`carrito_${usuario.email}`);

        setCarrito({});
        
        navigate("/");
    };


    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-8">
                    <h2 className="mb-4">Resumen de la Compra</h2>

                    {Object.keys(carrito).length === 0 && (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <span>No hay productos en el carrito.</span>
                        </div>
                    )}

                    <div className="list-group">
                        {Object.values(carrito).map((producto) => (
                            <div
                                key={producto.id}
                                className="list-group-item d-flex justify-content-between align-items-center p-3 shadow-sm mb-3 rounded"
                            >
                                <div className="d-flex">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        className="rounded-circle me-3"
                                    />
                                    <div>
                                        <h6 className="mb-1">{producto.nombre}</h6>
                                        <small>Cantidad: {producto.cantidad}</small>
                                    </div>
                                </div>
                                <span className="badge bg-primary rounded-pill">
                                    ${producto.precio * producto.cantidad}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-lg p-4">
                        <h4 className="mb-3">Total de la Compra</h4>
                        <h3 className="mb-4">${total.toFixed(2)}</h3>
                        <button
                            onClick={confirmarCompra}
                            className="btn btn-primary w-100 py-3 fs-5 rounded-3 shadow-sm"
                        >
                            Confirmar Compra
                        </button>
                        <div className="mt-3">
                            <button
                                onClick={() => navigate("/")}
                                className="btn btn-outline-secondary w-100 py-3 fs-5 rounded-3 shadow-sm"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
