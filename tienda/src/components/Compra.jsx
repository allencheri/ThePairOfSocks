import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Compra = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState({});
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Carga inicial de productos y carrito
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch("http://localhost:3000/productos");
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProductos();

        if (usuario) {
            const carritoGuardado = JSON.parse(localStorage.getItem(`carrito_${usuario.email}`)) || {};
            setCarrito(carritoGuardado);
        }
    }, [usuario]);

    // Cálculo del total optimizado
    useEffect(() => {
        const nuevoTotal = Object.values(carrito).reduce(
            (acc, { precio, cantidad }) => acc + precio * cantidad,
            0
        );
        setTotal(nuevoTotal);
    }, [carrito]);

    // Manejo de la confirmación de compra
    const confirmarCompra = () => {
        if (!Object.keys(carrito).length) {
            alert("Tu carrito está vacío. ¡Agrega algunos productos primero!");
            return;
        }

        if (!usuario) {
            alert("Por favor, inicia sesión para completar tu compra");
            navigate("/login");
            return;
        }

        alert("¡Compra realizada con éxito! Gracias por elegirnos");
        localStorage.removeItem(`carrito_${usuario.email}`);
        setCarrito({});
        navigate("/");
    };

    return (
        <div className="container compra-container py-5 min-vh-100">
            <div className="row g-4">
                {/* Sección de resumen de compra */}
                <div className="col-lg-8">
                    <h2 className="mb-4 fw-bold text-dark">Tu Carrito</h2>

                    {!Object.keys(carrito).length ? (
                        <div className="alert alert-warning d-flex align-items-center animate__animated animate__fadeIn" role="alert">
                            <i className="bi bi-basket me-2 fs-4"></i>
                            <span>Tu carrito está vacío. ¡Explora nuestros productos!</span>
                        </div>
                    ) : (
                        <div className="list-group animate__animated animate__fadeInUp">
                            {Object.values(carrito).map((producto) => (
                                <div
                                    key={producto.id}
                                    className="list-group-item d-flex align-items-center p-4 mb-3 bg-white rounded-3 shadow-sm hover-shadow transition-all"
                                >
                                    <img
                                        src={`http://localhost:5000/img/${producto.imagen}`}
                                        alt={producto.nombre}
                                        className="rounded-circle me-3 border"
                                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                        onError={(e) => (e.target.src = '/placeholder-image.jpg')} // Imagen por defecto si falla
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1 fw-semibold text-dark">{producto.nombre}</h5>
                                        <p className="mb-0 text-muted">
                                            Cantidad: <span className="fw-medium">{producto.cantidad}</span>
                                        </p>
                                    </div>
                                    <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                                        ${(producto.precio * producto.cantidad).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de total y acciones */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg p-4 rounded-3 sticky-top" style={{ top: '20px' }}>
                        <h4 className="mb-4 fw-bold text-dark">Resumen</h4>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fs-5 text-muted">Total:</span>
                            <h3 className="fw-bold text-primary mb-0">${total.toFixed(2)}</h3>
                        </div>
                        
                        <button
                            onClick={confirmarCompra}
                            className="btn btn-primary btn-lg w-100 py-3 rounded-3 shadow-sm hover-lift transition-all mb-3"
                            disabled={!Object.keys(carrito).length}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Confirmar Compra
                        </button>
                        
                        <button
                            onClick={() => navigate("/catalogo")}
                            className="btn btn-outline-secondary btn-lg w-100 py-3 rounded-3 transition-all hover-lift"
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Seguir Comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};