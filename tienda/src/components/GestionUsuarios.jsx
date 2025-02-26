import React, { useState, useEffect } from "react";
import "./css/usuarios.css";

export const GestionUsuarios = () => {
  const [usuario, setUsuario] = useState({
    name: "",
    email: "",
    password: "",
    tipo: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al cargar usuarios:", error));
  }, []);

  const abrirModalEdicion = (usuarioParaEditar) => {
    setUsuarioEditando(usuarioParaEditar);
    setUsuario({
      name: usuarioParaEditar.name,
      email: usuarioParaEditar.email,
      password: usuarioParaEditar.password,
      tipo: usuarioParaEditar.tipo,
    });
    setShowModal(true);
  };

  const handleActualizarUsuario = async (event) => {
    event.preventDefault();

    if (!usuario.name || !usuario.email || !usuario.password || !usuario.tipo) {
      alert("Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users/${usuarioEditando.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        }
      );

      if (response.ok) {
        const usuarioActualizado = await response.json();
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((u) =>
            u.id === usuarioActualizado.id ? usuarioActualizado : u
          )
        );
        alert("Usuario actualizado correctamente");
        setShowModal(false);
      } else {
        alert("Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleDeleteUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
        alert("Usuario eliminado");
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="usuariosWrapper">
      <h1 className="tituloGestion">Gestión de Usuarios</h1>

      <div className="tablaContenedor">
        <table className="usuariosTabla">
          <thead className="tablaEncabezado">
            <tr>
              <th className="celdaID">ID</th>
              <th className="celdaNombre">Nombre</th>
              <th className="celdaEmail">Email</th>
              <th className="celdaTipo">Tipo</th>
              <th className="celdaModificar">Modificar</th>
              <th className="celdaEliminar">Eliminar</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="filaUsuario">
                <td className="celdaID">{u.id}</td>
                <td className="celdaNombre">{u.name}</td>
                <td className="celdaEmail">{u.email}</td>
                <td className="celdaTipo">{u.tipo}</td>
                <td className="celdaModificar">
                  <button
                    className="botonEditar"
                    onClick={() => abrirModalEdicion(u)}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </td>
                <td className="celdaEliminar">
                  <button
                    className="botonEliminar"
                    onClick={() => handleDeleteUsuario(u.id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA EDICIÓN */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContenido">
            <div className="modalCabecera">
              <h5 className="modalTitulo">Editar Usuario</h5>
              <button
                type="button"
                className="botonCerrar"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modalCuerpo">
              <form onSubmit={handleActualizarUsuario}>
                <div className="campoFormulario">
                  <label htmlFor="name" className="etiquetaCampo">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="inputFormulario"
                    value={usuario.name}
                    onChange={(e) =>
                      setUsuario({ ...usuario, name: e.target.value })
                    }
                  />
                </div>
                <div className="campoFormulario">
                  <label htmlFor="email" className="etiquetaCampo">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="inputFormulario"
                    value={usuario.email}
                    onChange={(e) =>
                      setUsuario({ ...usuario, email: e.target.value })
                    }
                  />
                </div>
                <div className="campoFormulario">
                  <label htmlFor="password" className="etiquetaCampo">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="inputFormulario"
                    value={usuario.password}
                    onChange={(e) =>
                      setUsuario({ ...usuario, password: e.target.value })
                    }
                  />
                </div>
                <div className="campoFormulario">
                  <label htmlFor="tipo" className="etiquetaCampo">
                    Tipo de usuario
                  </label>
                  <select
                    className="selectorTipo"
                    id="tipo"
                    value={usuario.tipo}
                    onChange={(e) =>
                      setUsuario({ ...usuario, tipo: e.target.value })
                    }
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                  </select>
                </div>
                <button type="submit" className="botonActualizar">
                  Actualizar Usuario
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
