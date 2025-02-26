import React, { useState } from "react";

export const Registro = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tipo, setTipo] = useState("usuario"); // Valor por defecto "usuario"
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const user = await response.json();
      setUsers(user);
    } catch (error) {
      console.error(error);
    }
  };
  getUsers();

  const registro = async (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, rellena todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      limpiarForm();
      return;
    }

    if (users.find((user) => user.email === email)) {
      alert("Ya existe un usuario con ese email");
      limpiarForm();
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, tipo }),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      alert("Registro exitoso");
      limpiarForm();
      window.location.href = "/login";
    } catch (error) {
      alert("Hubo un error al registrar");
      console.error(error);
    }
  };

  const limpiarForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 fw-bold">Register</h3>
            <form onSubmit={registro}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="name"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="email"
                  placeholder="Introduce tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  Repite contraseña
                </label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="confirmPassword"
                  placeholder="Repite contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-dark w-100 rounded-3 fw-semibold">
                Registrar
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="small">
                ¿Ya tienes cuenta?{" "}
                <a href="/" className="text-decoration-none text-danger">
                  Entrar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
