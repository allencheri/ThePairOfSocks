import React, { useState } from 'react';

export const GestionProductos = () => {
    const [producto, setProducto] = useState({
        nombre: '',
        precio: '',
        imagen: '', // Guardar solo el nombre de la imagen
    });

    const [productos, setProductos] = useState([]);
    
    // Función para manejar el cambio de la imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageName = Date.now() + '-' + file.name; // Crear un nombre único para la imagen
            setProducto({ ...producto, imagen: imageName });

            // Subir la imagen a la carpeta public/img (esto se manejará en el backend)
            const formData = new FormData();
            formData.append('image', file);

            fetch('http://localhost:5000/upload', { // Esto lo manejaremos en el backend
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => console.log('Imagen subida correctamente:', data))
            .catch(error => console.error('Error al subir la imagen:', error));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { nombre, precio, imagen } = producto;

        if (!nombre || !precio || !imagen) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const nuevoProducto = {
            ...producto,
            id: Date.now(), // ID único basado en el tiempo
        };

        try {
            const response = await fetch('http://localhost:5000/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (response.ok) {
                const addedProduct = await response.json();
                setProductos((prevProductos) => [...prevProductos, addedProduct]);
                alert('Producto agregado exitosamente');
                setProducto({ nombre: '', precio: '', imagen: '' }); // Reset form
            } else {
                alert('Error al agregar producto');
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Error al agregar producto');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/productos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProductos((prevProductos) => prevProductos.filter((prod) => prod.id !== id));
                alert('Producto eliminado');
            } else {
                alert('Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto');
        }
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Gestión de Productos</h1>
            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="form-control"
                            value={producto.nombre}
                            onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="precio" className="form-label">Precio</label>
                        <input
                            type="number"
                            id="precio"
                            className="form-control"
                            value={producto.precio}
                            onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imagen" className="form-label">Imagen</label>
                        <input
                            type="file"
                            id="imagen"
                            className="form-control"
                            onChange={handleImageChange} // Cambiar a la función para cargar el archivo
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
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
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.precio}</td>
                                <td>
                                    {producto.imagen && (
                                        <img
                                            src={`./img/${producto.imagen}`} // Mostrar imagen desde la carpeta public/img
                                            alt="Vista previa"
                                            width="50"
                                            height="50"
                                        />
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteProduct(producto.id)}
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
